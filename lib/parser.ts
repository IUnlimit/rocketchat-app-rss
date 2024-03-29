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

export async function parseAndPersistRss(
    modify: IModify,
    room: IRoom,
    sender: IUser,
    persis: IPersistence,
    http: IHttp,
    url: string
): Promise<Rss> {
    const resp = await http.get(url);
    if (resp.statusCode != 200) {
        await sendNotification(modify, room, sender, `URL: ${url} are unavailable (status ${resp.statusCode})`);
        return await Promise.reject(null);
    }
    
    await sendNotification(modify, room, sender, "Processing rss subscription");
    const elem = xml2js(resp.content!);
    const parent = elem.elements[0] as Element;
    if (parent.name != "rss") {
        await sendNotification(modify, room, sender, `Unknow xml type: ${parent.name}`);
        return await Promise.reject(null);
    }
    
    const son = parent.elements![0] as Element;
    const rssInfo = son.elements! as Array<Element>;
    const page = new Page(rssInfo);
    const rss = new Rss(url, page);
    await RssPersistence.removeById(persis, room, url);
    await RssPersistence.persist(persis, room, rss);
    return await Promise.resolve(rss);
}