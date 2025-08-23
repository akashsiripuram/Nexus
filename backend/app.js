import { config } from "dotenv";
import express from "express";
import connectDB from "./utils/connection.js";
import userRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
const app = express();
config();
connectDB();
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/project", projectRouter);

app.listen(8080);
