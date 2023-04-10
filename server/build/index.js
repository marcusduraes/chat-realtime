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
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("./database/models/User"));
const Message_1 = __importDefault(require("./database/models/Message"));
const app = (0, express_1.default)();
const port = +process.env.PORT || 3000;
const secret = process.env.SECRET || "tsitelecom";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password } = req.body;
    password = yield bcrypt_1.default.hash(password, 10);
    const query = yield User_1.default.create({
        username,
        password,
    });
    if (query)
        res.status(201).json({ data: "created" });
}));
app.post("/api/v1/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = (yield User_1.default.findOne({
        where: {
            username: username._value,
        },
    }));
    if (!user)
        return res.status(404).json({ data: "Usuário não encontrado" });
    const compare = yield bcrypt_1.default.compare(password._value, user.password);
    if (!compare)
        return res.status(401).json({ data: "Senha inválida" });
    const token = jsonwebtoken_1.default.sign({ user: user.username }, secret, {
        expiresIn: "1h",
    });
    return res.status(201).json({ data: token });
}));
app.get("/api/v1/generate-token", (req, res) => { });
const server = app.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
function verifyToken(token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        return payload;
    }
    catch (error) {
        return false;
    }
}
function historyMessages() {
    const findMessages = Message_1.default.findAll()
        // @ts-ignore
        .then(res => console.log(res))
        .catch(err => console.log(err));
}
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws, request) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    historyMessages();
    let token = (_a = request.url) === null || _a === void 0 ? void 0 : _a.split("?")[1];
    token = token === null || token === void 0 ? void 0 : token.replace("token=", "");
    if (!token)
        return ws.close();
    const payload = verifyToken(token);
    if (payload)
        wss.clients.add(ws);
    else
        ws.close(401);
    ws.on("error", console.error);
    ws.on("message", message => {
        wss.clients.forEach(wsClient => {
            if (wsClient !== ws && wsClient.readyState === ws_1.WebSocket.OPEN) {
                wsClient.send(message.toString());
            }
            else {
                Message_1.default.create({
                    username: payload.user,
                    message: message.toString(),
                });
            }
        });
    });
}));
