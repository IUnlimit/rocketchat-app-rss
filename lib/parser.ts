import {
    IHttp,
    IModify,
    IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { sendNotification } from './message';
import { xml2js, Element } from 'xml-js';
import { Page } from '../model/page';
import { RssPersistence } from '../persistence/RssPersistence'
import { Rss } from '../model/rss';

export async function noticeParseAndPersistRss(
    modify: IModify,
    room: IRoom,
    sender: IUser,
    persis: IPersistence,
    http: IHttp,
    url: string
): Promise<Rss> {
    await sendNotification(modify, room, sender, "Processing rss subscription");
    try {
        const rss = await parseRss(http, room.id, url);
        await RssPersistence.removeById(persis, room, url);
        await RssPersistence.persist(persis, room, rss);
        return Promise.resolve(rss);
    } catch(e) {
        sendNotification(modify, room, sender, (e as Error).message);
    }
    return await Promise.reject(null);
}

export async function parseRss(
    http: IHttp,
    roomId: string,
    url: string
): Promise<Rss> {
    const resp = await http.get(url);
    if (resp.statusCode != 200) {
        throw new Error(`URL: ${url} are unavailable (status ${resp.statusCode})`);
    }
    
    const elem = xml2js(resp.content!);
    const parent = elem.elements[0] as Element;
    if (parent.name != "rss") {
        throw new Error(`Unknow xml type: ${parent.name}`);
    }
    
    const son = parent.elements![0] as Element;
    const rssInfo = son.elements! as Array<Element>;
    const page = new Page(rssInfo);
    const rss = new Rss(roomId, url, page);
    return await Promise.resolve(rss);
}