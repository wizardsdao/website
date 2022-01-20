import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC1967Upgrade } from "../ERC1967Upgrade";
export declare class ERC1967Upgrade__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): ERC1967Upgrade;
}
