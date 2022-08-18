import {newFlatSubsocialApi} from "@subsocial/api";
import {PostData} from "@subsocial/types/dto/sub";
import {Feed} from "./feed.model";
import {FlatSubsocialApi} from "@subsocial/api/flat-subsocial";
import removeMarkdown from "markdown-to-text";

const substrateNodeUrl = process.env.SUBSTRATE_NODE_URL || "wss://testnet.subsocial.network";
const offchainUrl = process.env.OFF_CHAIN__URL ||  "https://staging.subsocial.network/offchain";
const ipfsNodeUrl = process.env.IPFS_NODE_URL || "https://app.subsocial.network/ipfs";



export class SubService {
    private flatApi: Promise<FlatSubsocialApi>;

     constructor() {
        this.flatApi =  newFlatSubsocialApi({substrateNodeUrl, offchainUrl, ipfsNodeUrl});
    }

    //traz todos os posts do subsocial da spaceId
    private fetchPosts = async (spaceId) => {
        const postIds =  await (await this.flatApi).subsocial.substrate.postIdsBySpaceId(spaceId)

        return  (await this.flatApi).subsocial.findPosts({ids: postIds})
    }

    //trata o texto para retirar markdown, links, tags e outros
    private static transformText(text) {
        const regex = /\[([^\]]*)\]\((https?:\/\/[^$#\s].[^\s]*)\)/gm;
        text = text.replace(regex, ' ');
        text = removeMarkdown(text);
        const regexN = /\n/gms;
        text = text.replace(regexN, '.');
        return text;

    }

    private static transformTitle(title) {
        const regex = /Polkadot digest/gmsi;
       title = (title ? title.replace(regex, '') : `Polkadot  ${new Date().toLocaleDateString()}`);
        return title;
    }

//transforma os posts em uma lista de Feeds
     private processPosts =  (posts: PostData[]) => {


        let feeds: Feed[];
        feeds = [];
        for (const post of posts) {
            const text = SubService.transformText(post.content.body);
            const title = SubService.transformTitle(post.content.title);

            const feed: Feed = {
                uid: post.struct.id.toString(),
                updateDate: new Date(Date.now()),
                titleText: title,
                mainText: text,
                redirectUrl: post.content.link,
            }
            feeds.push(feed)
        }
        return feeds

    }

//retorna uma lista de Feeds a partir de um id de espaco
    private fetchFeeds = async (spaceId) => {
        const posts = await this.fetchPosts(spaceId);
          return this.processPosts(posts)
    }


     async getAllFeeds(spaceId ): Promise<Feed[]> {
             return this.fetchFeeds(spaceId);
     }

     async lastFeed(spaceId): Promise<Feed> {
         const allFeeds = await this.getAllFeeds(spaceId);
        return allFeeds[allFeeds.length - 1];

 }



}






