import express from "express";
import logger from "morgan";
import http from "http";
import ViteExpress from "vite-express";
import { PORT } from "./utils/env";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

server.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}...`)
);

ViteExpress.bind(app, server);
