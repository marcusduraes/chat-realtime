"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const Message_1 = __importDefault(require("./database/models/Message"));
const verifyToken_1 = __importDefault(require("@/modules/functions/verifyToken"));
const app = (0, express_1.default)();
const port = +process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(router_1.default);
const server = app.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws, request) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = (_a = request.url) === null || _a === void 0 ? void 0 : _a.split("?")[1];
    token = token === null || token === void 0 ? void 0 : token.replace("token=", "");
    if (!token)
        return ws.close(3001, "Forneça um token");
    const payload = (0, verifyToken_1.default)(token);
    if (!payload) {
        return ws.close(3000, "Token inválido");
    }
    const user = payload.user;
    let history = yield Message_1.default.findAll();
    const dataJson = JSON.stringify({ user, history });
    wss.clients.add(ws);
    ws.send(dataJson);
    ws.on("error", console.error);
    ws.on("message", data => {
        wss.clients.forEach(wsClient => {
            if (wsClient !== ws && wsClient.readyState === ws_1.WebSocket.OPEN) {
                const message = JSON.stringify({ message: data.toString() });
                wsClient.send(message);
            }
            else {
                Message_1.default.create({
                    username: user,
                    message: JSON.parse(data.toString()).message,
                });
            }
        });
    });
}));
