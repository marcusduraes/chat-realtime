"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const port = +process.env.PORT || 3000;
app.get("/chat", (req, res) => {
    res.sendFile(path_1.default.resolve("public", "index.html"));
});
app.post("/api/v1/generate-token", (req, res) => {
    const { username, password } = req.body;
});
app.get("/api/v1/auth", (req, res) => { });
const server = app.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", ws => {
    wss.clients.add(ws);
    ws.on("error", console.error);
    ws.on("message", message => {
        wss.clients.forEach(wsClient => {
            if (wsClient !== ws && wsClient.readyState === ws_1.WebSocket.OPEN) {
                wsClient.send(message.toString());
            }
        });
    });
});
