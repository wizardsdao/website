import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC721Checkpointable } from "../ERC721Checkpointable";
export declare class ERC721Checkpointable__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): ERC721Checkpointable;
}
