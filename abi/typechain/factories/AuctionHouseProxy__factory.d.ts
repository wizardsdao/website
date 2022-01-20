import { Signer, BytesLike, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { AuctionHouseProxy } from "../AuctionHouseProxy";
export declare class AuctionHouseProxy__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(logic: string, admin: string, data: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<AuctionHouseProxy>;
    getDeployTransaction(logic: string, admin: string, data: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): AuctionHouseProxy;
    connect(signer: Signer): AuctionHouseProxy__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): AuctionHouseProxy;
}
