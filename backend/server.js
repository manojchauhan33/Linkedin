import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // allow frontend
    credentials: true, // allow cookies if you ever need
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

//app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  console.log(` running on  ${PORT}`);
});
