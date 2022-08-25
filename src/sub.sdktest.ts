
/* import newFlatSubsocialApi and util functions */
import { newFlatSubsocialApi } from '@subsocial/api'
import {Feed} from "./feed.model";
import {PostData} from "@subsocial/types/dto/sub";
import config from './config/Config';

/*
  Store the URLs of the Substrate and IPFS nodes
  Note: You can either run local substrateNode or use our testnet.
*/

const substrateNodeUrl = config.substrateNodeUrlRco;
const offchainUrl = config.offchainUrl;
const ipfsNodeUrl = config.ipfsNodeUrl;
const spaceId = config.spaceIdDigestBr;


console.log("testando subsocial api teste");

export const fetchPosts = async () => {
    try {
        const flatApi = await newFlatSubsocialApi({substrateNodeUrl, offchainUrl, ipfsNodeUrl});
        const postIds = await flatApi.subsocial.substrate.postIdsBySpaceId(spaceId as any)

        return  flatApi.subsocial.findPosts({ids: postIds})

    }catch (error) {
        console.log(`Erro ao  conectar na api do subsocial: ${error}`);
    }

}


//transforma os posts em uma lista de Feeds
export const processPosts =  (posts: PostData[]) => {
    let feeds: Feed[];
    feeds = [];
    for (const post of posts) {
        const feed: Feed = {
            uid: post.struct.id.toString(),
            updateDate: new Date(Date.now()),
            titleText: post.content.title,
            mainText: post.content.body,
            redirectUrl: post.content.link,
}
        feeds.push(feed)
    }
    return feeds
}


async function main() {
    try {
        const posts = await fetchPosts();
        const feeds = processPosts(posts);
        console.log(feeds);

    } catch (error) {
        console.log(`Erro ao  fazer o fetch: ${error}`);
    }

}




main();

console.log("fim do teste");







