import moment from "moment";
import { FormattedMessageType } from "../../utils/types";

export function formatMessage(
    username: string,
    messageText: string
): FormattedMessageType {
    return {
        username,
        messageText,
        time: moment().format("h:mm a"),
    };
}
