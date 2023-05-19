import moment from "moment";

export type UserType = string;

export type FormattedMessageType = {
    messageBody: string;
    user: UserType;
    time: string;
}

export type ChatMessageType = {
    messageBody: string;
    user: UserType;
};

export type ConnectedUser = {
    user: UserType;
    sessionid: string;
    room: string;
};



