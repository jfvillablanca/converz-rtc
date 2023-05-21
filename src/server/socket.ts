import { Server, Socket } from "socket.io";
import {
    BOT_NAME,
    EVENT_CHAT,
    EVENT_CHAT_FROM_SERVER,
    EVENT_UPDATE_USER_LIST,
    EVENT_UPDATE_USER_LIST_FROM_SERVER,
} from "../utils/namespace";
import { ChatMessageType, UserAndRoomFormType } from "../utils/types";
import { formatMessage } from "./utils/messages";
import {
    getAllConnectedUsers,
    isIdAUniqueConnection,
    logTheUserIn,
    logTheUserOut,
} from "./utils/users";

export default function serverSocket(io: Server) {
    const logoutWrapper = (io: Server, id: string) => {
        const exitingUser = logTheUserOut(id);
        if (exitingUser) {
            const { user, room } = exitingUser;
            io.to(room).emit(
                EVENT_UPDATE_USER_LIST_FROM_SERVER,
                getAllConnectedUsers(room)
            );
            io.to(room).emit(
                EVENT_CHAT_FROM_SERVER,
                formatMessage(`${BOT_NAME} | ${room}`, `${user} left the room`)
            );
        }
    };

    io.on("connection", (socket: Socket) => {
        // HACK: Must use actual session IDs from a db.
        const { id } = socket;
        let currentRoom: UserAndRoomFormType["room"];

        socket.on(
            EVENT_UPDATE_USER_LIST,
            (userAndRoom: UserAndRoomFormType) => {
                const { username, room } = userAndRoom;
                // NOTE: NOT SURE IF THIS `IF` WILL STILL BE NECESSARY WITH SESSION IDs
                // React re-renders the DOM twice during development mode
                // causing two emits (from the same socket.id)
                if (isIdAUniqueConnection(id) || currentRoom !== room) {
                    socket.join(room);
                    if (currentRoom) {
                        logoutWrapper(io, id);
                        socket.leave(currentRoom);
                    }
                    currentRoom = room;

                    logTheUserIn(id, username, currentRoom);
                    io.to(currentRoom).emit(
                        EVENT_UPDATE_USER_LIST_FROM_SERVER,
                        getAllConnectedUsers(currentRoom)
                    );
                    io.to(currentRoom).emit(
                        EVENT_CHAT_FROM_SERVER,
                        formatMessage(
                            `${BOT_NAME} | ${currentRoom}`,
                            `${username} joins the room`
                        )
                    );
                }
            }
        );

        socket.on(EVENT_CHAT, (msg: ChatMessageType) => {
            const { user, messageBody } = msg;
            io.to(currentRoom).emit(
                EVENT_CHAT_FROM_SERVER,
                formatMessage(user, messageBody)
            );
        });

        socket.on("disconnect", () => {
            logoutWrapper(io, id);
        });
    });
}
