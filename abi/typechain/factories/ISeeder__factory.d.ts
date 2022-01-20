import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ISeeder } from "../ISeeder";
export declare class ISeeder__factory {
    static connect(address: string, signerOrProvider: Signer | Provider): ISeeder;
}
