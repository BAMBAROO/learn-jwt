import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";
dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("database connected...")
} catch (error) {
  console.log(error)
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(router);

app.listen(5000, () => {
  console.log("server running at port 5000")
});