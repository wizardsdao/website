import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { RoyaltiesV2 } from "../RoyaltiesV2";
export declare class RoyaltiesV2__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): RoyaltiesV2;
}
