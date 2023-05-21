import express from "express";
import http from "http";
import logger from "morgan";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import serverSocket from "./socket";
import { ENVIRONMENT, PORT, URL } from "./utils/env";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: URL,
    },
});

serverSocket(io);

if (ENVIRONMENT !== "production") {
    app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

server.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}...`)
);

ViteExpress.bind(app, server);
