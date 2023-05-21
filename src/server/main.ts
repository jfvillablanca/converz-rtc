import express from "express";
import logger from "morgan";
import http from "http";
import ViteExpress from "vite-express";
import { ENVIRONMENT, PORT, URL } from "./utils/env";
import { Server, Socket } from "socket.io";
import { formatMessage } from "./utils/messages";
import { ChatMessageType, UserAndRoomFormType } from "../utils/types";
import {
    EVENT_CHAT,
    EVENT_CHAT_FROM_SERVER,
    EVENT_UPDATE_USER_LIST,
    EVENT_UPDATE_USER_LIST_FROM_SERVER,
} from "../utils/event-namespace";
import {
    getAllConnectedUsers,
    isIdAUniqueConnection,
    logTheUserIn,
    logTheUserOut,
} from "./utils/users";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: URL,
    },
});

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
            formatMessage(`${botName} | ${room}`, `${user} left the room`)
        );
    }
};

const botName = "ConverzBot";
io.on("connection", (socket: Socket) => {
    // HACK: Must use actual session IDs from a db.
    const { id } = socket;
    let currentRoom: UserAndRoomFormType["room"];

    socket.on(EVENT_UPDATE_USER_LIST, (userAndRoom: UserAndRoomFormType) => {
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
                    `${botName} | ${currentRoom}`,
                    `${username} joins the room`
                )
            );
        }
    });

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

if (ENVIRONMENT !== "production") {
    app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

server.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}...`)
);

ViteExpress.bind(app, server);
