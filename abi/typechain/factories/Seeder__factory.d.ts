import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Seeder } from "../Seeder";
export declare class Seeder__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<Seeder>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): Seeder;
    connect(signer: Signer): Seeder__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): Seeder;
}
