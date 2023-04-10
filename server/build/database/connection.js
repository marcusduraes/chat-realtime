"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: "db.sqlite",
});
connection
    .authenticate()
    .then(() => console.log("conectado com o banco de dados"))
    .catch(err => console.error(err));
exports.default = connection;
