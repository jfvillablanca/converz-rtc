import {
    ConnectedUser,
    UserAndRoomFormType,
} from "../../utils/types";

const users: ConnectedUser[] = [];

export function logTheUserIn(sessionid: string, user: UserAndRoomFormType['username'], room: UserAndRoomFormType['room']) {
    users.push({
        user,
        sessionid,
        room,
    });
}

export function logTheUserOut(sessionid: string): ConnectedUser | undefined {
    const index = users.findIndex((user) => user.sessionid === sessionid);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

export function isIdAUniqueConnection(sessionid: string): boolean {
    return !users.some((user) => user.sessionid === sessionid);
}

export function getAllConnectedUsers(
    room: UserAndRoomFormType["room"]
): UserAndRoomFormType['username'][] {
    return users
        .filter((connectedUser) => connectedUser.room === room)
        .map((connectedUser) => connectedUser.user);
}
