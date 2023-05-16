import moment from "moment";

export type FormattedMessageType = {
    username: string;
    messageText: string;
    time: string;
}

export type UserType = string;

export type ChatMessageType = {
    messagebody: string;
    user: UserType;
};


