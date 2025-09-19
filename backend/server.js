import express from "express";
import dotenv from "dotenv";
// import connectDB from "./config/database.js";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB, sequelize } from "./config/database.js";

dotenv.config();
// connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",  // allow frontend
    credentials: true,        // allow cookies if you ever need
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", router);

//app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();  // auto create tables
    console.log("All right");

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
