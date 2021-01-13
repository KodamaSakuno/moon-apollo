import { erc20ABI, LunarModuleAbi } from 'features/configure/abi';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../../common/redux/actions';
import { ethers, utils, BigNumber } from 'ethers';

import { useConnectWallet } from '../../home/redux/hooks';
import { getBasicsOf } from "../../common/LunarModule";
import { ReadOnlyProvider } from "../../common/rpcProviders";
export { useFetchBalances } from './fetchBalances';
export { useFetchPoolBalances } from './fetchPoolBalances';
export { useFetchApproval } from './fetchApproval';
export { useFetchDeposit } from './fetchDeposit';
export { useFetchWithdraw } from './fetchWithdraw';
export { useFetchContractApy } from './fetchContractApy';

export function usePoolApy(
    pool,
    everyRewardValue,
    everyStakingValue
    // pool.itokenDecimals: number,
    // pool.tokenDecimals: number
  ) {
    const [rewardRate, updateRewardRate] = useState(BigNumber.from(0));
    const [totalStaked, updateTotalStaked] = useState(BigNumber.from(0));
    const [stats, updateStats] = useState({
      mission: "",
    });

    const contract = useMemo(() => {
      return new ethers.Contract(
        pool.earnContractAddress,
        LunarModuleAbi,
        ReadOnlyProvider[pool.chainId]
      );
    }, [pool]);

    const update = useCallback(async () => {
      // rewardRate = reward for every second staking
      // const rewardRate = await contract.rewardRate();
      // // totalStaked amounts for this pool
      // const totalStaked = await contract.totalSupply();
      // const currentMission = await contract.mission();
      const { rewardRate, totalSupply, mission } = await getBasicsOf(
        pool.chainId,
        pool.earnContractAddress
      );

      updateRewardRate(rewardRate);
      updateTotalStaked(totalSupply);
      updateStats({
        mission,
      });
    }, [pool.earnContractAddress, pool.chainId]);

    // let apyForDisplay = '---.--'
    // if (rewardRate !== '0' || totalStaked !== '0' ) {
    //     // 365天，24小时，每个小时3600秒
    //     const yearlyRewardInBNB = Number(rewardRate) * 365 * 24 * 3600
    //     // 年利润 / 总抵押额。均以BNB为计价单位
    //     const _apy = (yearlyRewardInBNB / Number(totalStaked))
    //     apyForDisplay = (_apy * 100).toFixed(2)
    // }

    const isPoolStopped = useMemo(() => rewardRate.eq(0), [rewardRate]);

    const memoizedApy = useMemo(() => {
      if (pool.itokenDecimals === 0 || pool.tokenDecimals === 0) {
        return "---.--";
      }
      const formattedRewardTokenValue = utils.formatUnits(
        everyRewardValue,
        pool.itokenDecimals
      );
      const formattedStakingTokenValue = utils.formatUnits(
        everyStakingValue,
        pool.tokenDecimals
      );

      const formattedRewardRate = utils.formatUnits(
        rewardRate,
        pool.itokenDecimals
      );
      const formattedtotalStaked = utils.formatUnits(
        totalStaked,
        pool.tokenDecimals
      );
      // 365天，24小时，每个小时3600秒
      const yearlyRewardInBNB =
        Number(formattedRewardRate) *
        365 *
        24 *
        3600 *
        Number(formattedRewardTokenValue);
      const totalStakedTokenInBNB =
        Number(formattedtotalStaked) * Number(formattedStakingTokenValue);
      let apy = yearlyRewardInBNB / totalStakedTokenInBNB;
      if (pool.chainId === 56)
        apy = apy * 1600; // multiply with 1600 for bnb chain ?
      const apyForDisplay = (apy * 100).toFixed(2);
      return apy === Number.POSITIVE_INFINITY ? "---.--" : apyForDisplay;
    }, [
      everyRewardValue,
      everyStakingValue,
      pool.itokenDecimals,
      pool.tokenDecimals,
      rewardRate,
      totalStaked,
      pool.chainId,
    ]);
    useEffect(() => {
      if (contract) {
        update();
      }
    }, [contract, update]);

    return {
      update,
      apy: memoizedApy,
      totalStake: totalStaked,
      rewardRate: rewardRate,
      stats,
      isPoolStopped,
    };
  }

export function useApprove(tokenAddress, poolAddress) {
    const { web3, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleApprove = useCallback(async () => {
        setIsPending(true);
        try {
            await new Promise((resolve, reject) => {
                const contract = new web3.eth.Contract(erc20ABI, tokenAddress);

                contract.methods.approve(poolAddress, ethers.constants.MaxUint256.toString(10)).send({ from: address })
                .on('transactionHash', function(hash){
                    dispatch(enqueueSnackbar({
                        message: hash,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success'
                        },
                        hash
                    }));
                })
                .on('receipt', function(receipt){
                    resolve()
                })
                .on('error', function(error) {
                    console.log(error)
                    reject(error)
                })
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
            });
        } finally {
            setIsPending(false);
        }
    }, [dispatch, setIsPending, web3, address, poolAddress, tokenAddress]);

    return { isPending, onApprove: handleApprove };
  }

export function useAllowance(tokenAddress, spender) {
    const { web3, address } = useConnectWallet();
    const [allowance, setAllowance] = useState("0");

    const fetchAllowance = useCallback(async () => {
        if (tokenAddress === '') {
            setAllowance(ethers.constants.MaxUint256.toString(10))
            return;
        }
        const contract = new web3.eth.Contract(erc20ABI, tokenAddress);

        const allowance = await contract.methods.allowance(address, spender).call()
        setAllowance(allowance)
    }, [address, spender, setAllowance, tokenAddress, web3])

    useEffect(() => {
        if (web3 && address) {
            fetchAllowance()
        }
        let refreshInterval = setInterval(fetchAllowance, 10000)
        return () => clearInterval(refreshInterval)
    }, [web3, address, fetchAllowance])

    return allowance
}

export function useBalanceOf(tokenAddress) {
    const { web3, address } = useConnectWallet();
    const [balance, setBalance] = useState("0");

    const fetchBalance = useCallback(async () => {
        let balance;
        if (tokenAddress === '') {
            balance = await web3.eth.getBalance(address);
        } else {
            const contract = new web3.eth.Contract(erc20ABI, tokenAddress);

            balance = await contract.methods.balanceOf(address).call()
        }
        setBalance(balance)
    }, [address, setBalance, tokenAddress, web3])

    useEffect(() => {
        if (web3 && address) {
            fetchBalance()
        }
        let refreshInterval = setInterval(fetchBalance, 10000)
        return () => clearInterval(refreshInterval)
    }, [web3, address, fetchBalance])

    return balance
}

export function useEarned(poolAddress) {
    const { web3, address } = useConnectWallet();
    const [earned, setEarned] = useState("0");

    const fetchEarned = useCallback(async () => {
        const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

        const earned = await contract.methods.earned(address).call()
        setEarned(earned)
    }, [address, setEarned, poolAddress, web3])

    useEffect(() => {
        if (web3 && address) {
            fetchEarned()
        }
        let refreshInterval = setInterval(fetchEarned, 10000)
        return () => clearInterval(refreshInterval)
    }, [web3, address, fetchEarned])

    return earned
}


export function useDeposit(poolAddress, tokenAddress) {
    const { web3, networkId, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleDeposit = useCallback(async (amount) => {
        setIsPending(true);
        try {
            await new Promise(async (resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                let gas = await tokenAddress !== '' ? contract.methods.deposit(amount).estimateGas({ from: address })
                : contract.methods.depositETH().estimateGas({ from: address, value: amount });
                if (networkId === 128)
                    gas = Math.floor(gas * 1.1)
                const p = tokenAddress !== '' ? contract.methods.deposit(amount).send({ from: address, gas })
                : contract.methods.depositETH().send({ from: address, value: amount, gas })
                p.on('transactionHash', function(hash){
                    dispatch(enqueueSnackbar({
                        message: hash,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success'
                        },
                        hash
                    }));
                })
                .on('receipt', function(receipt){
                    resolve()
                })
                .on('error', function(error) {
                    console.log(error)
                    reject(error)
                })
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
            });
        } finally {
            setIsPending(false);
        }
    }, [dispatch, setIsPending, web3, address, poolAddress, tokenAddress, networkId]);

    return { isPending, onDeposit: handleDeposit };
}
export function useWithdraw(poolAddress, tokenAddress) {
    const { web3, networkId, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleWithdraw = useCallback(async (amount) => {
        setIsPending(true);
        try {
            await new Promise(async (resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                let gas = await contract.methods.withdraw(amount).estimateGas({ from: address });
                if (networkId === 128)
                    gas = Math.floor(gas * 1.1)
                const p = contract.methods.withdraw(amount).send({ from: address, gas })
                p.on('transactionHash', function(hash){
                    dispatch(enqueueSnackbar({
                        message: hash,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success'
                        },
                        hash
                    }));
                })
                .on('receipt', function(receipt){
                    resolve()
                })
                .on('error', function(error) {
                    console.log(error)
                    reject(error)
                })
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
            });
        } finally {
            setIsPending(false);
        }
    }, [dispatch, setIsPending, web3, address, poolAddress, networkId]);

    return { isPending, onWithdraw: handleWithdraw };
}
export function useFetchGetReward(poolAddress) {
    const { web3, networkId, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleGetReward = useCallback(async () => {
        setIsPending(true);
        try {
            await new Promise(async (resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                let gas = await contract.methods.getReward().estimateGas({ from: address });
                if (networkId === 128)
                    gas = Math.floor(gas * 1.1)
                contract.methods.getReward().send({ from: address, gas })
                .on('transactionHash', function(hash){
                    dispatch(enqueueSnackbar({
                        message: hash,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success'
                        },
                        hash
                    }));
                })
                .on('receipt', function(receipt){
                    resolve()
                })
                .on('error', function(error) {
                    console.log(error)
                    reject(error)
                })
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
            });
        } finally {
            setIsPending(false);
        }
    }, [dispatch, setIsPending, web3, address, poolAddress, networkId]);

    return { isPending, onGetReward: handleGetReward };
}
export function useFetchExit(poolAddress) {
    const { web3, networkId, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleExit = useCallback(async () => {
        setIsPending(true);
        try {
            await new Promise(async (resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                let gas = await contract.methods.exit().estimateGas({ from: address });
                if (networkId === 128)
                    gas = Math.floor(gas * 1.1)
                contract.methods.exit().send({ from: address, gas })
                .on('transactionHash', function(hash){
                    dispatch(enqueueSnackbar({
                        message: hash,
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success'
                        },
                        hash
                    }));
                })
                .on('receipt', function(receipt){
                    resolve()
                })
                .on('error', function(error) {
                    console.log(error)
                    reject(error)
                })
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
            });
        } finally {
            setIsPending(false);
        }
    }, [dispatch, setIsPending, web3, address, poolAddress, networkId]);

    return { isPending, onExit: handleExit };
}
