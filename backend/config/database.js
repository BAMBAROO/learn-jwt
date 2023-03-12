import { Sequelize } from "sequelize";

const db = new Sequelize("users","root","password",{
  host: "localhost",
  dialect: "mysql"
});

export default db;
