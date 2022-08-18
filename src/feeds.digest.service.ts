import {Feed} from "./feed.model";
import {Injectable} from "@nestjs/common";

@Injectable()
export class FeedsDigestService {
feeds: Feed[] = [
        new Feed("1", new Date(), "Título do digest", "Texto do digest", "http://www.google.com"),
        new Feed("2", new Date(), "Título do digest", "Texto do digest", "http://www.google.com"),
        new Feed("3", new Date(), "Título do digest", "Texto do digest", "http://www.google.com"),
    ];
    obterTodos(): Feed[] {
        return this.feeds;
    }
    ultimo(): Feed {
        return this.feeds[this.feeds.length - 1];
    }
    obterUm(uid: string): Feed {
        return this.feeds.find(feed => feed.uid === uid);
    }
}