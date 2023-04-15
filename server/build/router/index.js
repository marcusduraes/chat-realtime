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
const User_1 = __importDefault(require("@/database/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const secret = process.env.SECRET || "tsitelecom";
const router = express_1.default.Router();
router.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password } = req.body;
    const isNotAvailable = yield User_1.default.findOne({
        where: {
            username,
        },
    });
    if (isNotAvailable) {
        return res.status(400).json({ data: "Nome de usuário não disponível" });
    }
    password = yield bcrypt_1.default.hash(password, 10);
    const query = yield User_1.default.create({
        username,
        password,
    });
    if (query)
        return res.status(201).json({ data: "Usuário criado!" });
}));
router.post("/api/v1/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = router;
