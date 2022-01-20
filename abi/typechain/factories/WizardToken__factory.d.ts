import { Signer, BigNumberish, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { WizardToken } from "../WizardToken";
export declare class WizardToken__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(_creatorsDAO: string, _minter: string, _descriptor: string, _seeder: string, _proxyRegistry: string, _supply: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<WizardToken>;
    getDeployTransaction(_creatorsDAO: string, _minter: string, _descriptor: string, _seeder: string, _proxyRegistry: string, _supply: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): WizardToken;
    connect(signer: Signer): WizardToken__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): WizardToken;
}
