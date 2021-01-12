import { utils } from "ethers";
import { LunarModuleAbi } from "../configure/abi";
import { multicall } from "./Multicall";

export async function getBasicsOf(networkId, poolAddress) {
  const ILunarModule = new utils.Interface(LunarModuleAbi);
  const fragments = [
    ILunarModule.getFunction("rewardRate"),
    ILunarModule.getFunction("totalSupply"),
    ILunarModule.getFunction("mission"),
  ];
  const readCalls = fragments.map((frag) => ({
    target: poolAddress,
    callData: ILunarModule.encodeFunctionData(frag),
  }));
  const { rawReturns } = await multicall(networkId, readCalls);
  const [rewardRate, totalSupply, mission] = rawReturns.map(
    (res, idx) => ILunarModule.decodeFunctionResult(fragments[idx], res)[0]
  );
  return { rewardRate, totalSupply, mission };
}
