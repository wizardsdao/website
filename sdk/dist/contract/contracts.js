"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractsForChainOrThrow = void 0;
const src_1 = require("../../../abi/src/");
const addresses_1 = require("./addresses");
/**
 * Get contract instances that target the Ethereum mainnet
 * or a supported testnet. Throws if there are no known contracts
 * deployed on the corresponding chain.
 * @param chainId The desired chain id
 * @param signerOrProvider The ethers v5 signer or provider
 */
const getContractsForChainOrThrow = (chainId, signerOrProvider) => {
  const addresses = (0, addresses_1.getContractAddressesForChainOrThrow)(
    chainId
  );
  return {
    wizardTokenContract: src_1.WizardToken__factory.connect(
      addresses.wizardToken,
      signerOrProvider
    ),
    auctionHouseContract: src_1.AuctionHouse__factory.connect(
      addresses.auctionHouseProxy,
      signerOrProvider
    ),
    descriptorContract: src_1.Descriptor__factory.connect(
      addresses.descriptor,
      signerOrProvider
    ),
    seederContract: src_1.Seeder__factory.connect(
      addresses.seeder,
      signerOrProvider
    ),
  };
};
exports.getContractsForChainOrThrow = getContractsForChainOrThrow;
