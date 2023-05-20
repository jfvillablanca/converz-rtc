import { Dispatch, SetStateAction } from "react";

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
    user: UserAndRoomFormType['username'];
    room: UserAndRoomFormType['room'];
    messageBody: string;
};

export type ConnectedUser = {
    user: UserType;
    sessionid: string;
    room: string;
};

export type ContextType = [
    userAndRoom: UserAndRoomFormType,
    setUserAndRoom: Dispatch<SetStateAction<UserAndRoomFormType>>,
    roomNames: string[]
];
