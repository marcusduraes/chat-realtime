"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const connection_1 = __importDefault(require("@/database/connection"));
const sequelize_1 = require("sequelize");
// @ts-ignore
const Message = connection_1.default.define("Message", {
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
});
Message.sync();
exports.default = Message;
