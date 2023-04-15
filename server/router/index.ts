import "module-alias/register";
import express from "express";
import User from "@/database/models/User";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = process.env.SECRET || "tsitelecom";

const router = express.Router();

router.post("/user", async (req, res) => {
  let { username, password } = req.body;

  const isNotAvailable = await User.findOne({
    where: {
      username,
    },
  });

  if (isNotAvailable) {
    return res.status(400).json({ data: "Nome de usuário não disponível" });
  }

  password = await bcrypt.hash(password, 10);

  const query = await User.create({
    username,
    password,
  });

  if (query) return res.status(201).json({ data: "Usuário criado!" });
});

router.post("/api/v1/auth", async (req, res) => {
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

export default router;
