import { LunarModuleAbi } from 'features/configure/abi';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import { useConnectWallet } from '../../home/redux/hooks';
export { useFetchBalances } from './fetchBalances';
export { useFetchPoolBalances } from './fetchPoolBalances';
export { useFetchApproval } from './fetchApproval';
export { useFetchDeposit } from './fetchDeposit';
export { useFetchWithdraw } from './fetchWithdraw';
export { useFetchContractApy } from './fetchContractApy';

export function useFetchExit() {
    const { web3, address } = useConnectWallet();
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleExit = useCallback(async (poolAddress) => {
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
    }, [dispatch, setIsPending, web3, address, enqueueSnackbar]);

    return { isPending, onExit: handleExit };
}
