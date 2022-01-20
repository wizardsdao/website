import { ContractAddresses } from './types';
/**
 * Get addresses of contracts that have been deployed to the
 * Ethereum mainnet or a supported testnet. Throws if there are
 * no known contracts deployed on the corresponding chain.
 * @param chainId The desired chainId
 */
export declare const getContractAddressesForChainOrThrow: (chainId: number) => ContractAddresses;
