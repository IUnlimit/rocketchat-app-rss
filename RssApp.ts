import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { RssCommand } from './commands/RssCommand';

export class RssApp extends App {

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors)
    }
    
    public async extendConfiguration(configuration: IConfigurationExtend) {
        await configuration.slashCommands.provideSlashCommand(
            new RssCommand(this));
    }
}
