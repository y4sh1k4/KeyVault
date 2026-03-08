import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authMiddleware } from "../lib/middleware";
import AuthRouter from "../routes/auth/routes"
import ProjectRouter from "../routes/project/routes"
import SecretRouter from "../routes/secret/routes"

const app = express();
app.use(cors({
  origin: "http://localhost:3001", 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", AuthRouter);

app.use("/project", authMiddleware,  ProjectRouter)

app.use("/secret", authMiddleware,  SecretRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});