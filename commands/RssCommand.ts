import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { RssApp } from "../RssApp";
import { sendMessage, sendNotification } from '../lib/message';
import { parserRss } from '../lib/parser';

const HELP_STRING =
"Usage:\n" +
"`/rss [sub|s] <link>` to subscribe a rss link\n" +
"`/rss [unsub|u] <index>` to unsubscribe a rss link (use `/rss list` to display the index)\n" +
"`/rss [list|l]` to list all subscribed rss links\n" +
"`/rss [help|h]` to get the help message";

export class RssCommand implements ISlashCommand {
    public command = 'rss'; 
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    constructor(private readonly app: RssApp) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const [subcommand, arg1] = context.getArguments(); 
        const room = context.getRoom();
        const sender = context.getSender();
        read.getUserReader();

        if (!subcommand) { 
            await sendNotification(modify, room, sender, HELP_STRING);
            return
        }

        switch (subcommand) {
            case 's':
            case 'sub': 
                if (!arg1) {
                    await sendNotification(modify, room, sender, "Please input the rss URL !");
                    break;
                }
                await parserRss(modify, room, sender, http, arg1);
                break;

            case 'u':
            case 'unsub': 
                // todo
                break;

            case 'l':
            case 'list': 
                // todo
                break;

            case 'h':
            case 'help':
            default: 
                await sendNotification(modify, room, sender, HELP_STRING);
        }
    }
}