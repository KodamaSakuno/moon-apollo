import { erc20ABI, LunarModuleAbi } from 'features/configure/abi';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../../common/redux/actions';
import { ethers } from 'ethers';

import { useConnectWallet } from '../../home/redux/hooks';
export { useFetchBalances } from './fetchBalances';
export { useFetchPoolBalances } from './fetchPoolBalances';
export { useFetchApproval } from './fetchApproval';
export { useFetchDeposit } from './fetchDeposit';
export { useFetchWithdraw } from './fetchWithdraw';
export { useFetchContractApy } from './fetchContractApy';

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
    const { web3, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleDeposit = useCallback(async (amount) => {
        setIsPending(true);
        try {
            await new Promise((resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                const p = tokenAddress !== '' ? contract.methods.deposit(amount).send({ from: address })
                : contract.methods.depositETH().send({ from: address, value: amount })
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
    }, [dispatch, setIsPending, web3, address, poolAddress, tokenAddress]);

    return { isPending, onDeposit: handleDeposit };
}
export function useWithdraw(poolAddress, tokenAddress) {
    const { web3, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleWithdraw = useCallback(async (amount) => {
        setIsPending(true);
        try {
            await new Promise((resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                const p = tokenAddress !== '' ? contract.methods.withdraw(amount).send({ from: address })
                : contract.methods.withdrawETH(amount).send({ from: address })
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
    }, [dispatch, setIsPending, web3, address, poolAddress, tokenAddress]);

    return { isPending, onWithdraw: handleWithdraw };
}
export function useFetchGetReward(poolAddress) {
    const { web3, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleGetReward = useCallback(async () => {
        setIsPending(true);
        try {
            await new Promise((resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                contract.methods.getReward().send({ from: address })
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
    }, [dispatch, setIsPending, web3, address, poolAddress]);

    return { isPending, onGetReward: handleGetReward };
}
export function useFetchExit(poolAddress) {
    const { web3, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();


    const handleExit = useCallback(async () => {
        setIsPending(true);
        try {
            await new Promise((resolve, reject) => {
                const contract = new web3.eth.Contract(LunarModuleAbi, poolAddress);

                contract.methods.exit().send({ from: address })
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
    }, [dispatch, setIsPending, web3, address, poolAddress]);

    return { isPending, onExit: handleExit };
}
