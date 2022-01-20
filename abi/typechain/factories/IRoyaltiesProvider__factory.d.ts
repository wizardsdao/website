import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IRoyaltiesProvider } from "../IRoyaltiesProvider";
export declare class IRoyaltiesProvider__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): IRoyaltiesProvider;
}
