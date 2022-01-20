import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { AuctionHouseProxyAdmin } from "../AuctionHouseProxyAdmin";
export declare class AuctionHouseProxyAdmin__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<AuctionHouseProxyAdmin>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): AuctionHouseProxyAdmin;
    connect(signer: Signer): AuctionHouseProxyAdmin__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): AuctionHouseProxyAdmin;
}
