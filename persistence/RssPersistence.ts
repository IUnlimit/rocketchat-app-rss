import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { Rss } from '../model/rss';

export class RssPersistence {
    // add records
    // @return id
    public static async persist(persis: IPersistence, room: IRoom, rss: Rss): Promise<string> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'rss'), 
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, rss.url),
        ];

        try {
            return await persis.updateByAssociations(associations, rss, true);
        } catch (err) {
            console.error(err);
        }
        return "";
    }

    // query all records within the "scope" - rss
    public static async findAll(persis: IPersistenceRead): Promise<Array<Rss>> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'rss'),
        ];

        let result: Array<Rss> = [];
        try {
            result = (await persis.readByAssociations(associations)) as Array<Rss>;
        } catch (err) {
            console.error(err);
        }
        return result;
    }

    // query all records by room within the "scope" - rss
    public static async findByRoom(persis: IPersistenceRead, room: IRoom): Promise<Array<Rss>> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'rss'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
        ];

        let result: Array<Rss> = [];
        try {
            result = (await persis.readByAssociations(associations)) as Array<Rss>;
        } catch (err) {
            console.error(err);
        }
        return result;
    }

    // remove all records by room within the "scope" - rss
    public static async removeByRoom(persis: IPersistence, room: IRoom): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'rss'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
        ];

        try {
            await persis.removeByAssociations(associations);
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    // remove all records by id within the "scope" - rss
    public static async removeById(persis: IPersistence, room: IRoom, id: string): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'rss'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id),
        ];

        try {
            await persis.removeByAssociations(associations);
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    // remove all records within the "scope" - rss
    public static async clear(persis: IPersistence): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'rss'),
        ];

        try {
            await persis.removeByAssociations(associations);
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }
}