
/* import newFlatSubsocialApi and util functions */
import { newFlatSubsocialApi } from '@subsocial/api'
import {Feed} from "./feed.model";
import {PostData} from "@subsocial/types/dto/sub";

/*
  Store the URLs of the Substrate and IPFS nodes
  Note: You can either run local substrateNode or use our testnet.
*/

const substrateNodeUrl = "wss://rpc.subsocial.network"
const offchainUrl = "https://app.subsocial.network/offchain"
const ipfsNodeUrl = "https://app.subsocial.network/ipfs"
const spaceId = "7199"




console.log("testando subsocial api");

export const fetchPosts = async () => {
    const flatApi = await newFlatSubsocialApi({substrateNodeUrl, offchainUrl, ipfsNodeUrl});
    const postIds = await flatApi.subsocial.substrate.postIdsBySpaceId(spaceId as any)

    return  flatApi.subsocial.findPosts({ids: postIds})
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
    const posts = await fetchPosts();
    const feeds = processPosts(posts);
    console.log(feeds);
}




main();

console.log("fim do teste");







