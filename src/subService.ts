
import {PostData} from "@subsocial/types/dto/sub";
import {Feed} from "./feedModel";
import {FlatSubsocialApi} from "@subsocial/api/flat-subsocial";
import {Subsocial} from "./connections/subsocial";
import {WordProcessor} from "./wordProcessor";


const ERROR_NO_FETCH = 'Unable to fetch posts on subsocial';
const MSG_SEARCHING_POSTS = 'Searching posts on Substrate/Subsocial...';

export class SubService {
    private flatApi: FlatSubsocialApi;
    private wordProcessor: WordProcessor;

     private constructor(flatApi: FlatSubsocialApi) {
         this.flatApi = flatApi;
         this.wordProcessor = new WordProcessor();
     }


    public static async getInstanceSubService(): Promise<SubService> {
        const flatApi = Subsocial.getInstanceSubSocialApi();
        return new SubService(await flatApi);

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


//transforma os posts do subsocial em uma lista de Feeds(objetos interpretados pela alexa)
     private processPosts =  (posts: PostData[]) => {

        let feeds: Feed[];
        feeds = [];
        for (const post of posts) {
            const feed: Feed = {
                uid: post.struct.id.toString(),
                updateDate: new Date(Date.now()),
                titleText: this.wordProcessor.transformTitle(post.content.title),
                //mainText: post.content.body,
                mainText: this.wordProcessor.transformText(post.content.body),
                redirectUrl: post.content.link,
            }
            feeds.push(feed);
        }
        return feeds

    }


     async getAllFeeds(spaceId): Promise<Feed[]> {
         const posts = await this.fetchPosts(spaceId);
         return this.processPosts(posts)
     }

     async getLastFeed(spaceId): Promise<Feed> {
         const allFeeds = await this.getAllFeeds(spaceId);
         console.log(allFeeds[allFeeds.length - 1].mainText);
        return allFeeds[allFeeds.length - 1];

 }



}






