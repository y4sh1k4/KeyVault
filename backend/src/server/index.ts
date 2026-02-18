import express from "express";
import cookieParser from "cookie-parser";
import { authMiddleware } from "../lib/middleware";
import AuthRouter from "../routes/auth/routes"
import ProjectRouter from "../routes/project/routes"
import SecretRouter from "../routes/secret/routes"

const app = express();
app.use(cookieParser());

app.use("/auth", AuthRouter);

app.use("/project", authMiddleware,  ProjectRouter)

app.post("/secret", authMiddleware,  SecretRouter);
