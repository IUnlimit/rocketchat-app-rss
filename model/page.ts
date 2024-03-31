import { Element } from 'xml-js';
// import { toElementMap } from '../lib/parser';

export class Page {
    // IllTamer's Blog
    public title: string;
    // http://localhost:8090/
    public link: string;
    // IllTamer's Blog
    public description: string = "";
    // items list
    public iteams: Array<Item>

    constructor(pageInfo: Array<Element>) {
        const elemMap = new Map();
        elemMap.set("item", new Array<Element>());
        for (const elem of pageInfo) {
            if (elem.name == "item") {
                (elemMap.get("item") as Array<Element>).push(elem);
                continue;
            }
            elemMap.set(elem.name, elem);
        }
        
        this.title = elemMap.get("title")?.elements![0].text as string;
        this.link = elemMap.get("link")?.elements![0].text as string;
        const desElems = elemMap.get("description")?.elements;
        if (desElems != null) {
            this.description = (desElems[0].text as string).substring(0, 80)
        }
        this.iteams = []

        const reverseInfos = elemMap.get("item")! as Array<Element>
        for (const info of reverseInfos) {
            const item = new Item(info.elements! as Array<Element>);
            this.iteams.push(item);
        }
        this.iteams.sort((a, b) => b.pubDate - a.pubDate);
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
        // const elemMap = toElementMap(itemElems);
        const elemMap = new Map();
        elemMap.set("item", new Array<Element>());
        for (const elem of itemElems) {
            if (elem.name == "item") {
                (elemMap.get("item") as Array<Element>).push(elem);
                continue;
            }
            elemMap.set(elem.name, elem);
        }

        this.title = elemMap.get("title")?.elements![0].cdata as string
        this.link = elemMap.get("link")?.elements![0].text as string
        this.description = (elemMap.get("description")?.elements![0].cdata as string)
        this.guid = elemMap.get("guid")?.elements![0].text as string
        this.pubDate = Date.parse(elemMap.get("pubDate")?.elements![0].text as string);
    }
}