import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IJobContext } from "@rocket.chat/apps-engine/definition/scheduler";
import { RssPersistence } from "../persistence/RssPersistence";
import { parseRss } from "../lib/parser";
import { sendMessage } from "../lib/message";
import { formatDate } from "../lib/date";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";

export async function onUpdate(
    jobContext: IJobContext, 
    read: IRead, 
    modify: IModify, 
    http: IHttp,
    persis: IPersistence
): Promise<void> {
    const persisRead = read.getPersistenceReader();
    const rssList = await RssPersistence.findAll(persisRead);
    if (rssList?.length == 0) return

    // update
    for (const rss of rssList) {
        try {
            const updateRss = await parseRss(http, rss.roomId, rss.url);
            if (isNaN(updateRss.recordPubDate) || isNaN(rss.recordPubDate)) {
                console.error(`Rss url ${rss.url} parse failed, is it adapted`);
                continue;
            }
    
            if (updateRss.recordPubDate <= rss.recordPubDate) continue;
            // deprecated
            let updateItemNotice = `### Rss subscription [${rss.title}] has update(s) !`;
            const deprecatedPubDate = rss.recordPubDate;
            const room = await read.getRoomReader().getById(rss.roomId) as IRoom;
            for (const updateItem of updateRss.iteams) {
                if (updateItem.pubDate <= deprecatedPubDate) break;
                updateItemNotice += `\n[${updateItem.title}](${updateItem.link})` +
                `\n> updated at: ${formatDate(updateItem.pubDate)}` +
                `\n${updateItem.description}`;
            }
            RssPersistence.persist(persis, room, updateRss);
            sendMessage(modify, room, updateItemNotice);
        } catch(e) {
            console.error(e);
        }
    }
}