import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import cors from "cors";

import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./database/models/User";
import Message from "./database/models/Message";

const app = express();
const port = +process.env.PORT! || 3000;

const secret = process.env.SECRET! || "tsitelecom";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/user", async (req, res) => {
  let { username, password } = req.body;

  password = await bcrypt.hash(password, 10);

  const query = await User.create({
    username,
    password,
  });
  if (query) res.status(201).json({ data: "created" });
});

app.post("/api/v1/auth", async (req, res) => {
  const { username, password } = req.body;
  const user = (await User.findOne({
    where: {
      username: username._value,
    },
  })) as any;

  if (!user) return res.status(404).json({ data: "Usuário não encontrado" });

  const compare = await bcrypt.compare(password._value, user.password);

  if (!compare) return res.status(401).json({ data: "Senha inválida" });

  const token = jsonwebtoken.sign({ user: user.username }, secret, {
    expiresIn: "1h",
  });

  return res.status(201).json({ data: token });
});

app.get("/api/v1/generate-token", (req, res) => {});

const server = app.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

function verifyToken(token: string) {
  try {
    const payload = jsonwebtoken.verify(token, secret);
    return payload;
  } catch (error) {
    return false;
  }
}


const wss = new WebSocketServer({ server });

wss.on("connection", async (ws, request) => {

  let token = request.url?.split("?")[1];
  token = token?.replace("token=", "");
  if (!token) return ws.close();
  const payload = verifyToken(token) as any;
  if (payload) wss.clients.add(ws);
  else ws.close(401);

  ws.on("error", console.error);

  ws.on("message", message => {
    wss.clients.forEach(wsClient => {
      if (wsClient !== ws && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(message.toString());
      } else {
        Message.create({
          username: payload.user,
          message: message.toString(),
        });
      }
    });
  });
});
