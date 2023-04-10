import "module-alias/register";
import connection from "@/database/connection";
import { DataTypes } from "sequelize";
// @ts-ignore

const Message = connection.define("Message", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Message.sync();

export default Message;
