import express from "express";
import logger from "morgan";
import http from "http";
import ViteExpress from "vite-express";
import { ENVIRONMENT, PORT } from "./utils/env";
import { Server, Socket } from "socket.io";
import { formatMessage } from "./utils/messages";
import { ChatMessageType, UserType } from "../utils/types";
import {
    EVENT_CHAT,
    EVENT_CHAT_FROM_SERVER,
    EVENT_LOGIN,
    EVENT_LOGIN_FROM_SERVER,
} from "../utils/event-namespace";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket: Socket) => {

    socket.on(EVENT_CHAT, (msg: ChatMessageType) => {
        io.emit(
            EVENT_CHAT_FROM_SERVER,
            formatMessage(msg.user, msg.messagebody)
        );
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
