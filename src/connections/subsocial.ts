import {newFlatSubsocialApi} from '@subsocial/api'
import {FlatSubsocialApi} from "@subsocial/api/flat-subsocial";

import config from "../config/Config";

const substrateNodeUrl = config.substrateNodeUrlRco;
const offchainUrl = config.offchainUrl;
const ipfsNodeUrl = config.ipfsNodeUrl;

const MSG_CONNECTION_SUBSTRATE= "Connecting to Substrate/Subsocial...";
const MSG_CONNECTION_SUCCESS = "Connected to Substrate/Subsocial";
const ERROR_CONNECTION_FAILED = "Connection in Substrate/Subsocial failed";

let subsocial: FlatSubsocialApi;

export class Subsocial {


    /**
     * Create a new or return existing connection to Subsocial API
     * (includes Substrate and IPFS connections).
     */
    public static async getInstanceSubSocialApi(): Promise<FlatSubsocialApi> {
        if (!subsocial) {
            try {
                console.log(MSG_CONNECTION_SUBSTRATE);
                subsocial = await newFlatSubsocialApi({substrateNodeUrl, offchainUrl, ipfsNodeUrl});

            } catch (e) {
                throw new Error(`${ERROR_CONNECTION_FAILED} Erro: ${e}`);

            }
            console.log(MSG_CONNECTION_SUCCESS);

        }
        return subsocial;
    }

}




