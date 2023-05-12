import moment from "moment";

export interface FormattedMessage {
    username: string;
    messageText: string;
    time: string;
}

export function formatMessage(
    username: string,
    messageText: string
): FormattedMessage {
    return {
        username,
        messageText,
        time: moment().format("h:mm a"),
    };
}
