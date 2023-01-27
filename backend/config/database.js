import { Sequelize } from "sequelize";

const db = new Sequelize("users","root","Anak123",{
  host: "localhost",
  dialect: "mysql"
});

export default db;