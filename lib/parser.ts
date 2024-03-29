import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { sendNotification } from './message';
import { xml2js, Element } from 'xml-js';
import { Page } from '../model/page';
import { RSSPersistence } from '../persistence/RSSPersistence'

export async function parserRss(
    modify: IModify,
    room: IRoom,
    sender: IUser,
    http: IHttp,
    url: string
) {
    const resp = await http.get(url)
    if (resp.statusCode != 200) {
        await sendNotification(modify, room, sender, "URL:  " + url + " are unavailable (status " + resp.statusCode + ")")
        return
    }
    await sendNotification(modify, room, sender, "Processing rss subscription")
    const elem = xml2js(resp.content!)
    const parent = elem.elements[0] as Element
    if (parent.name != "rss") {
        throw new Error('Unknow xml type: ' + parent.name)
    }
    const son = parent.elements![0] as Element
    const rssInfo = son.elements! as Array<Element>
    const page = new Page(rssInfo)
    await sendNotification(modify, room, sender, "OK")
}