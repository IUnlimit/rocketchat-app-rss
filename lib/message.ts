import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
// import { PlainText } from '@rocket.chat/ui-kit'

// App send room message for response
export async function sendMessage(
    modify: IModify,
    room: IRoom,
    message: string,
): Promise<string> {
    const msg = modify.getCreator().startMessage()
        .setRoom(room);

        const block = modify.getCreator().getBlockBuilder();
        block.addSectionBlock({
            text: block.newMarkdownTextObject(message),
        });
        msg.setBlocks(block);

    return await modify.getCreator().finish(msg);
}

// App send block message for tip
export async function sendNotification(
    modify: IModify,
    room: IRoom,
    user: IUser,
    message: string
): Promise<void> {
    const msg = modify.getCreator().startMessage()
        .setRoom(room);

    const block = modify.getCreator().getBlockBuilder();
    block.addSectionBlock({
        text: block.newMarkdownTextObject(message),
    });
    msg.setBlocks(block);

    return await modify
        .getNotifier()
        .notifyUser(user, msg.getMessage());
}

// App send block message for tip
export async function sendRoomNotification(
    modify: IModify,
    room: IRoom,
    message: string
): Promise<void> {
    const msg = modify.getCreator().startMessage()
        .setRoom(room);

    const block = modify.getCreator().getBlockBuilder();
    block.addSectionBlock({
        text: block.newMarkdownTextObject(message),
    });
    msg.setBlocks(block);

    return await modify
        .getNotifier()
        .notifyRoom(room, msg.getMessage());
}