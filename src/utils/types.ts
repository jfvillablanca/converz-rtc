import { Dispatch, SetStateAction } from "react";

// FIXME: This place is in the BIG REFACTOR zone 🤮

export type UserAndRoomFormType = {
    username: string;
    room: string;
};

export type FormattedMessageType = {
    user: UserAndRoomFormType['username'];
    messageBody: string;
    time: string;
}

export type ChatMessageType = {
    user: UserAndRoomFormType['username'];
    room: UserAndRoomFormType['room'];
    messageBody: string;
};

export type ConnectedUser = {
    user: UserAndRoomFormType['username'];
    room: UserAndRoomFormType['room'];
    sessionid: string;
};

export type ContextType = [
    userAndRoom: UserAndRoomFormType,
    setUserAndRoom: Dispatch<SetStateAction<UserAndRoomFormType>>,
    roomNames: UserAndRoomFormType['room'][]
];
