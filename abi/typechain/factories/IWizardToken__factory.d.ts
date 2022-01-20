import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IWizardToken } from "../IWizardToken";
export declare class IWizardToken__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): IWizardToken;
}
