import { Sequelize } from "sequelize";
const connection = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
});

connection
  .authenticate()
  .then(() => console.log("conectado com o banco de dados"))
  .catch(err => console.error(err));

export default connection;
