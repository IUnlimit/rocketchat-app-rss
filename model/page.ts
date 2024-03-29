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
        this.description = pageInfo[2].elements![0].text as string

        for (var i = 3; i < pageInfo.length; ++ i) {
            this.iteams.push(new Item(pageInfo[i].elements! as Array<Element>));
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
        this.description = (itemElems[2].elements![0].cdata as string).substring(0, 100)
        this.guid = itemElems[3].elements![0].text as string
        this.pubDate = new Date(itemElems[4].elements![0].text as string).getTime();
    }
}