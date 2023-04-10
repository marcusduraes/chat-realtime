import "module-alias/register";
import connection from "@/database/connection";
import { DataTypes } from "sequelize";
// @ts-ignore

const User = connection.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.sync();

export default User;
