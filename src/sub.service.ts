import {newFlatSubsocialApi} from "@subsocial/api";
import {PostData} from "@subsocial/types/dto/sub";
import {Feed} from "./feed.model";
import {FlatSubsocialApi} from "@subsocial/api/flat-subsocial";
import removeMarkdown from "markdown-to-text";

const substrateNodeUrl = process.env.SUBSTRATE_NODE_URL || "wss://rpc.subsocial.network/";
const offchainUrl = process.env.OFF_CHAIN__URL ||  "https://app.subsocial.network/offchain";
const ipfsNodeUrl = process.env.IPFS_NODE_URL || "https://app.subsocial.network/ipfs";


const ERROR_CONNECTION_FAILED = "Connection in Substrate/Subsocial failed";
const ERROR_NO_FETCH = "Unable to fetch posts on subsocial";

const MSG_CONNECTION_SUBSTRATE= "Connecting to Substrate/Subsocial...";
const MSG_CONNECTION_SUCCESS = "Connected to Substrate/Subsocial";
const MSG_SEARCHING_POSTS = "Searching posts on Substrate/Subsocial...";

export class SubService {
    private flatApi: FlatSubsocialApi;

     private constructor(flatApi: FlatSubsocialApi) {
         this.flatApi = flatApi;
     }


    public static async createSubService(): Promise<SubService> {
         let flatApi: FlatSubsocialApi;
         try{
             console.log(MSG_CONNECTION_SUBSTRATE);
             flatApi = await newFlatSubsocialApi({substrateNodeUrl, offchainUrl, ipfsNodeUrl});

         }
         catch (e) {
             throw new Error(`${ERROR_CONNECTION_FAILED} Erro: ${e}`);

        }
        console.log(MSG_CONNECTION_SUCCESS);
        return new SubService(flatApi);
    }




    //traz todos os posts do subsocial da spaceId
    private async fetchPosts (spaceId) {
        try {
            console.log(MSG_SEARCHING_POSTS);
            const postIds = await this.flatApi.subsocial.substrate.postIdsBySpaceId(spaceId);
            return this.flatApi.subsocial.findPosts({ids: postIds});

        } catch (error) {
            console.log(`${ERROR_NO_FETCH} Erro: ${error}`);
        }
    }

    //trata o texto para retirar markdown, links, tags e outros
    private static transformText(text) {
         console.log(`text puro: ${text}`);
        const regex = /\[([^\]]*)\]\((https?:\/\/[^$#\s].[^\s]*)\)/gm;
        text = text.replace(regex, ' ');
        text = removeMarkdown(text);
        const regexN = /\n/gms;
        text = text.replace(regexN, '.');
        console.log(`text tratado: ${text}`);
        return text;

    }

    private static transformTitle(title) {
         console.log(`title puro: ${title}`);
        const regex = /Polkadot digest/gmsi;
       title = (title ? title.replace(regex, '') : `Polkadot  ${new Date().toLocaleDateString()}`);
       console.log(`title tratado: ${title}`);
        return title;
    }

//transforma os posts do subsocial em uma lista de Feeds(objetos interpretados pela alexa)
     private processPosts =  (posts: PostData[]) => {


        let feeds: Feed[];
        feeds = [];
        for (const post of posts) {
            const feed: Feed = {
                uid: post.struct.id.toString(),
                updateDate: new Date(Date.now()),
                titleText: SubService.transformTitle(post.content.title),
                mainText: SubService.transformText(post.content.body),
                redirectUrl: post.content.link,
            }
            feeds.push(feed);
        }
        return feeds

    }


     async getAllFeeds(spaceId ): Promise<Feed[]> {
         const posts = await this.fetchPosts(spaceId);
         return this.processPosts(posts)
     }

     async getLastFeed(spaceId): Promise<Feed> {
         const allFeeds = await this.getAllFeeds(spaceId);
        return allFeeds[allFeeds.length - 1];

 }



}






