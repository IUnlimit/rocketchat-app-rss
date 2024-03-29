import {
    IPersistenceRead,
    type IHttp,
    type IModify,
    type IPersistence,
    type IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    type ISlashCommand,
    type SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { type RssApp } from "../RssApp";
import { sendNotification, sendMessage } from '../lib/message';
import { parseAndPersistRss } from '../lib/parser';
import { formatDate } from '../lib/date';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { RssPersistence } from '../persistence/RssPersistence';

const HELP_STRING =
    "*Usage:*\n" +
    "- `/rss [sub|s] <link>` to subscribe a rss link\n" +
    "- `/rss [unsub|u] <index>` to unsubscribe a rss link (use `/rss list` to display the index)\n" +
    "- `/rss [list|l]` to list all subscribed rss links\n" +
    "- `/rss [help|h]` to get the help message";

export class RssCommand implements ISlashCommand {
    public command = 'rss';
    public i18nParamsExample = 'sub-command';
    public i18nDescription = 'To operate RSS subscription';
    // public permission = ;
    public providesPreview = false;

    constructor(private readonly app: RssApp) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [subcommand, arg1] = context.getArguments();
        const room = context.getRoom();
        const sender = context.getSender();
        const persisRead = read.getPersistenceReader();
        read.getUserReader();

        if (!subcommand) {
            await sendNotification(modify, room, sender, HELP_STRING);
            return
        }

        switch (subcommand) {
            case 's':
            case 'sub':
                return await RssCommand.sub(persis, http, modify, room, sender, arg1);

            case 'u':
            case 'unsub':
                return await RssCommand.unsub(persis, persisRead, http, modify, room, sender, arg1);

            case 'l':
            case 'list':
                return await RssCommand.list(persisRead, modify, room, sender);

            case 'c':
            case 'clear':
                await sendMessage(modify, room, `All rss feeds are cleared-${await RssPersistence.removeByRoom(persis, room)} in this room by @${sender.username}`)
                return

            case 'h':
            case 'help':
            default:
                await sendNotification(modify, room, sender, HELP_STRING);
        }
    }

    private static async sub(persis: IPersistence, http: IHttp, modify: IModify, room: IRoom, sender: IUser, arg1: string): Promise<void> {
        if (!arg1) {
            return await sendNotification(modify, room, sender, "Please input the rss URL !");
        }
        const rss = await parseAndPersistRss(modify, room, sender, persis, http, arg1);
        if (!rss) {
            throw new Error(`Failed to parse rss link: ${arg1}`);
        }
        let pageInfo = `RSS feed has been successfully added to this channel! (by @${sender.username}) :partying_face: \n` +
            `> Name: ${rss.title}\n` +
            `> HomeLink: ${rss.homeLink}\n` +
            `> LastUpdate: ${formatDate(rss.recordPubDate)}\n` +
            `> Description: ${rss.description}`;
        for (const item of rss.iteams) {
            pageInfo += `\n- [${item.title}](${item.link}) (${formatDate(item.pubDate)})`;
        }
        await sendMessage(modify, room, pageInfo);
    }

    private static async unsub(persis: IPersistence, persisRead: IPersistenceRead, http: IHttp, modify: IModify, room: IRoom, sender: IUser, arg1: string): Promise<void> {
        const index = Number(arg1)
        if (!arg1 || isNaN(index)) {
            return await sendNotification(modify, room, sender, "Please input the rss index ! (use `/rss l` show subs index)");
        }
        const rssList = await RssPersistence.findByRoom(persisRead, room);
        if (rssList.length <= index) {
            return sendNotification(modify, room, sender, `Index out of range(${rssList.length}) !`);
        }
        const rss = rssList.splice(index, 1)[0];
        const success = await RssPersistence.removeById(persis, room, rss.url);
        await sendMessage(modify, room, `Rss feed [${rss.title}](${rss.url}) has been removed-${success} from this channel (by @${sender.username}) ! :ok_hand: `);
    }

    private static async list(persisRead: IPersistenceRead, modify: IModify, room: IRoom, sender: IUser): Promise<void> {
        const rssList = await RssPersistence.findByRoom(persisRead, room);
        let listInfo = `The RSS subscription list of the current channel is as follows`;
        for (let i = 0; i < rssList.length; i++) {
            const rss = rssList[i];
            listInfo += `\n- [${i}] [${rss.title}](${rss.homeLink}) (last updated at ${formatDate(rss.recordPubDate)})`;
        }
        return await sendNotification(modify, room, sender, listInfo);
    }

}