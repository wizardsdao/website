import type { Signer } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import { Contracts } from './types';
/**
 * Get contract instances that target the Ethereum mainnet
 * or a supported testnet. Throws if there are no known contracts
 * deployed on the corresponding chain.
 * @param chainId The desired chain id
 * @param signerOrProvider The ethers v5 signer or provider
 */
export declare const getContractsForChainOrThrow: (chainId: number, signerOrProvider?: Signer | Provider | undefined) => Contracts;
