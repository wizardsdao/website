import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Descriptor } from "../Descriptor";
export declare class Descriptor__factory extends ContractFactory {
    constructor(linkLibraryAddresses: DescriptorLibraryAddresses, signer?: Signer);
    static linkBytecode(linkLibraryAddresses: DescriptorLibraryAddresses): string;
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<Descriptor>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): Descriptor;
    connect(signer: Signer): Descriptor__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): Descriptor;
}
export interface DescriptorLibraryAddresses {
    ["__$ca3b859211b1a9a5742dc282f70bfa123b$__"]: string;
}
