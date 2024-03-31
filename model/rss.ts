import { Item, Page } from "./page";

export class Rss {
    // rss sub room id
    public roomId: string;
    // rss url
    public url: string;
    // IllTamer's Blog
    public title: string;
    // home page link: http://localhost:8090/
    public homeLink: string;
    // IllTamer's Blog
    public description: string;
    // latest record pubDate
    public recordPubDate: number;
    // items list
    public iteams: Array<Item>;

    constructor(roomId: string, url: string, page: Page) {
        this.roomId = roomId;
        this.url = url;
        this.title = page.title;
        this.homeLink = page.link;
        this.description = page.description;
        this.iteams = page.iteams;
        this.recordPubDate = page.iteams[0].pubDate
    }
}