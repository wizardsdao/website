import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { AbstractRoyalties } from "../AbstractRoyalties";
export declare class AbstractRoyalties__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): AbstractRoyalties;
}
