import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { StartupType } from '@rocket.chat/apps-engine/definition/scheduler';
import { RssCommand } from './commands/RssCommand';
import { onUpdate } from './scheduler/RssUpdater';

export class RssApp extends App {

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors)
    }
    
    public async extendConfiguration(configuration: IConfigurationExtend) {
        await configuration.slashCommands.provideSlashCommand(
            new RssCommand(this));

        configuration.scheduler.registerProcessors([
            {
                id: 'update',
                processor: onUpdate,
                startupSetting: {
                    type: StartupType.RECURRING,
                    interval: '60 seconds',
                }
            },
        ]);
    }
}
