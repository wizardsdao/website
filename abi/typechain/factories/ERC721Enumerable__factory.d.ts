import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC721Enumerable } from "../ERC721Enumerable";
export declare class ERC721Enumerable__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): ERC721Enumerable;
}
