// FIXME: This place is in the BIG REFACTOR zone 🤮

export type UserType = string;

export type UserAndRoomFormType = {
    username: string;
    room: string;
};

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



