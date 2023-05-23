import moment from "moment";
import {
    ChatMessageType,
    FormattedMessageType,
    MessageThread,
    UserAndRoomFormType,
} from "../../utils/types";

const messages: MessageThread[] = [];

function formatMessage(
    user: string,
    messageBody: string
): FormattedMessageType {
    return {
        user,
        messageBody,
        time: moment().format("h:mm a"),
    };
}

export function addMessageToThread(message: ChatMessageType) {
    const { user, room, messageBody } = message;

    const targetRoom = messages.find((thread) => thread.room === room);

    if (targetRoom) {
        targetRoom.thread.push(formatMessage(user, messageBody));
    } else {
        messages.push({
            room,
            thread: [formatMessage(user, messageBody)],
        });
    }
}

export function getAllMessagesFromRoom(
    room: UserAndRoomFormType["room"]
): FormattedMessageType[] {
    return messages
        .filter((thread) => thread.room === room)
        .flatMap((thread) => thread.thread);
}
