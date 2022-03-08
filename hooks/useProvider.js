import { ethers } from "ethers";
import { singletonHook } from "react-singleton-hook";

const wcCfg = {
  rpc: {
    1: process.env.NEXT_PUBLIC_MAINNET_RPC_URI, // mainnet
    4: process.env.NEXT_PUBLIC_RINKEBY_RPC_URI, // rinkeby
    31337: process.env.NEXT_PUBLIC_LOCAL_RPC_URI, // local hardhat node
  },
};

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const useProviderImpl = () => {
  return new ethers.providers.JsonRpcProvider({ url: wcCfg.rpc[CHAIN_ID] });
};

export const useProvider = singletonHook(null, useProviderImpl);
