import {Feed} from "./feed.model";
import {SubService} from "./sub.service";
import {Controller, Get} from "@nestjs/common";

@Controller("polkadotdigest")
export class PolkadotDigestController {
    private subService: SubService;
    private spaceIdDigest = process.env.SPACE_ID_DIGEST_BRASIL || 7199;

    constructor() {
        this.subService = new SubService();
    }


    @Get()
     async obterTodos(): Promise<Feed[]> {
        console.log("obterTodos");
        const feeds = await this.subService.getAllFeeds(this.spaceIdDigest);
        console.log(feeds);

        return feeds;

     }

    @Get("last")
    async ultimo(): Promise<Feed> {
        return  this.subService.lastFeed(this.spaceIdDigest);
    }

    @Get("teste")
    teste(): string {
        return "buhu";
    }




}
