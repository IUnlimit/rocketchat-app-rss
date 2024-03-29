import { Element } from 'xml-js';

export class Page {
    // IllTamer's Blog
    public title: string;
    // http://localhost:8090/
    public link: string;
    // IllTamer's Blog
    public description: string;
    // items list
    public iteams: Array<Item>

    constructor(pageInfo: Array<Element>) {
        this.title = pageInfo[0].elements![0].text as string
        this.link = pageInfo[1].elements![0].text as string
        this.description = (pageInfo[2].elements![0].text as string).substring(0, 80)
        this.iteams = []

        // revserse to show items desc
        const reverseInfos = pageInfo.slice(3).reverse()
        let subCount = 3;
        for (const info of reverseInfos) {
            if (subCount-- == 0) break;
            const item = new Item(info.elements! as Array<Element>);
            this.iteams.push(item);
        }
    }

}

// 文章详情
export class Item {
    // 超详细 Windows 安装 Docker Desktop 全过程
    public title: string;
    // http://localhost:8090/2022/08/11/windows-install-docker-desktop
    public link: string;
    // <h2 id=\"前言\">前言</h2>\n<p>
    public description: string;
    // /2022/08/11/windows-install-docker-desktop
    public guid: string;
    // Thu, 11 Aug 2022 02:11:00 GMT
    public pubDate: number;

    constructor(itemElems: Array<Element>) {
        this.title = itemElems[0].elements![0].cdata as string
        this.link = itemElems[1].elements![0].text as string
        this.description = (itemElems[2].elements![0].cdata as string).substring(0, 200)
        this.guid = itemElems[3].elements![0].text as string
        this.pubDate = new Date(itemElems[4].elements![0].text as string).getTime();
    }
}