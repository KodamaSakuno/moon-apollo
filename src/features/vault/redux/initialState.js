import { pools } from "../../configure";

const tokens = {
  56: {},
  128: {},
  1: {},
};

pools.map(({chainId, token, tokenAddress, earnedToken, earnedTokenAddress})=> {
  tokens[chainId][token] = {
    tokenAddress: tokenAddress,
    tokenBalance: 0
  }
  tokens[chainId][earnedToken] = {
    tokenAddress: earnedTokenAddress,
    tokenBalance: 0
  }
  return '';
})

// console.log(tokens)

const initialState = {
  pools,
  tokens,
  contractApy: {},
  fetchContractApyPending: false,
  fetchPoolBalancesPending: false,
  fetchBalancesPending: false,
  fetchApprovalPending: {},
  fetchDepositPending: {},
  fetchWithdrawPending: {},
};

export default initialState;