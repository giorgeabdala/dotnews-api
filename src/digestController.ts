import {Feed} from "./feedModel";
import {SubService} from "./subService";
import {Controller, Get} from "@nestjs/common";
import config from "./config/Config";


const MSG_SEARCHING_LAST_POST = "Searching last post...";

@Controller("polkadotdigest")
export class PolkadotDigestController {
    private subService: SubService;
    private readonly spaceIdDigestBr = config.spaceIdDigestBr;

    constructor() {
         SubService.getInstanceSubService().then(sub => {
            this.subService = sub;
            }).catch(err => {
                console.log(err);
            }   );

    }


    @Get()
     async obterTodos(): Promise<Feed[]> {
        console.log("obterTodos");
        return this.subService.getAllFeeds(this.spaceIdDigestBr);

     }

    @Get("last")
    async ultimo(): Promise<Feed> {
        console.log(MSG_SEARCHING_LAST_POST);
        return this.subService.getLastFeed(this.spaceIdDigestBr);
    }

}
