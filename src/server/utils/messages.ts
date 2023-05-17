import moment from "moment";
import { FormattedMessageType } from "../../utils/types";

export function formatMessage(
    user: string,
    messageBody: string
): FormattedMessageType {
    return {
        user,
        messageBody,
        time: moment().format("h:mm a"),
    };
}
