import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { LibPart } from "../LibPart";
export declare class LibPart__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<LibPart>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): LibPart;
    connect(signer: Signer): LibPart__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): LibPart;
}
