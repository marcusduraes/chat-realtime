import "module-alias/register";
import express from "express";
import router from "./router";
import { WebSocket, WebSocketServer } from "ws";
import cors from "cors";

import Message from "./database/models/Message";
import verifyToken from "@/modules/functions/verifyToken";

const app = express();
const port = +process.env.PORT! || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const server = app.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const wss = new WebSocketServer({ server });
wss.on("connection", async (ws, request) => {
  let token = request.url?.split("?")[1];
  token = token?.replace("token=", "");
  if (!token) return ws.close(3001, "Forneça um token");
  const payload = verifyToken(token) as any;

  if (!payload) {
    return ws.close(3000, "Token inválido");
  }

  const user = payload.user;
  let history = await Message.findAll();
  const dataJson = JSON.stringify({ user, history });
  wss.clients.add(ws);
  ws.send(dataJson);

  ws.on("error", console.error);

  ws.on("message", data => {
    wss.clients.forEach(wsClient => {
      if (wsClient !== ws && wsClient.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ message: data.toString() });
        wsClient.send(message);
      } else {
        Message.create({
          username: user,
          message: JSON.parse(data.toString()).message,
        });
      }
    });
  });
});
