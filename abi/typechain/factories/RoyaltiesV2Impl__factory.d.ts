import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { RoyaltiesV2Impl } from "../RoyaltiesV2Impl";
export declare class RoyaltiesV2Impl__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<RoyaltiesV2Impl>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): RoyaltiesV2Impl;
    connect(signer: Signer): RoyaltiesV2Impl__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): RoyaltiesV2Impl;
}
