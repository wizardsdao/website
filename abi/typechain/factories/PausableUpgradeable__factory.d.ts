import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { PausableUpgradeable } from "../PausableUpgradeable";
export declare class PausableUpgradeable__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): PausableUpgradeable;
}
