import { IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

// 发送普通消息
export async function sendMessage(
    modify: IModify,
    room: IRoom,
    sender: IUser,
    message: string,
): Promise<string> {
    const msg = modify.getCreator().startMessage()
        .setSender(sender)
        .setRoom(room)
        .setText(message);

    return await modify.getCreator().finish(msg);
}

// 发送块提示消息
export async function sendNotification(
    modify: IModify,
    room: IRoom,
    sender: IUser,
    message: string
): Promise<void> {
    let msg = modify.getCreator().startMessage()
        .setRoom(room)
        .setText(message);

    // lets build a really simple block (more on that on other Commands)
    const block = modify.getCreator().getBlockBuilder();
    // we want this block to have a Text supporting MarkDown
    block.addSectionBlock({
        text: block.newMarkdownTextObject(message),
    });

    // now let's set the blocks in our message
    msg.setBlocks(block);
    // and finally, notify the user with the IMessage
    return await modify
        .getNotifier()
        .notifyUser(sender, msg.getMessage());
}