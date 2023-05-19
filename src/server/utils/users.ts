import { ConnectedUser, UserType } from "../../utils/types";

const users: ConnectedUser[] = [];

export function logTheUserIn(sessionid: string, user: UserType, room: string) {
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

export function getAllConnectedUsers(): UserType[] {
    return users.map((connectedUser) => connectedUser.user);
}
