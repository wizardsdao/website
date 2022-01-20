import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IDescriptor } from "../IDescriptor";
export declare class IDescriptor__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): IDescriptor;
}
