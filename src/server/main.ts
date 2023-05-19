import express from "express";
import logger from "morgan";
import http from "http";
import ViteExpress from "vite-express";
import { ENVIRONMENT, PORT, URL } from "./utils/env";
import { Server, Socket } from "socket.io";
import { formatMessage } from "./utils/messages";
import { ChatMessageType, UserAndRoomFormType, UserType } from "../utils/types";
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

const botName = "ConverzBot";
io.on("connection", (socket: Socket) => {
    // HACK: Must use actual session IDs from a db.
    const { id } = socket;

    socket.on(EVENT_UPDATE_USER_LIST, (userAndRoom: UserAndRoomFormType) => {
        // NOTE: NOT SURE IF THIS `IF` WILL STILL BE NECESSARY WITH SESSION IDs
        // React re-renders the DOM twice during development mode
        // causing two emits (from the same socket.id)
        const { username } = userAndRoom;
        if (isIdAUniqueConnection(id)) {
            logTheUserIn(id, username, "default-room");
            io.emit(EVENT_UPDATE_USER_LIST_FROM_SERVER, getAllConnectedUsers());
            io.emit(
                EVENT_CHAT_FROM_SERVER,
                formatMessage(botName, `${username} joins the chat`)
            );
        }
    });

    socket.on(EVENT_CHAT, (msg: ChatMessageType) => {
        io.emit(
            EVENT_CHAT_FROM_SERVER,
            formatMessage(msg.user, msg.messageBody)
        );
    });

    socket.on("disconnect", () => {
        const exitingUser = logTheUserOut(id);
        if (exitingUser) {
            io.emit(EVENT_UPDATE_USER_LIST_FROM_SERVER, getAllConnectedUsers());
            io.emit(
                EVENT_CHAT_FROM_SERVER,
                formatMessage(botName, `${exitingUser.user} left the chat`)
            );
        }
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
