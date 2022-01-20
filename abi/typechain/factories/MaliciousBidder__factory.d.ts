import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MaliciousBidder } from "../MaliciousBidder";
export declare class MaliciousBidder__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<MaliciousBidder>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): MaliciousBidder;
    connect(signer: Signer): MaliciousBidder__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): MaliciousBidder;
}
