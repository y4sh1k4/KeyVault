import { prisma } from "../../lib/prisma";
import { Request, Response } from 'express';
import { secretSchema } from "../../validations/secretSchems";

export const createSecretController = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const project = await prisma.project.findUnique({
      where: { userId: Number(userId) },
    });
    if (!project) {
      return res.status(404).json({
        message: "No project found",
      });
    }

    const { key, value } = req.body;
    const parseBody = secretSchema.safeParse({ key, value });
    if (!parseBody.success) {
      return res.status(400).json({
        message: "Invalid Input",
      });
    }
    await prisma.secret.create({
      data: {
        key,
        value,
        projectId: project.pid,
      },
    });
    return res.status(201).json({
      message: "New Secret Created",
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const getSecretsController = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const project = await prisma.project.findUnique({
      where: { userId: Number(userId) },
    });
    if (!project) {
      return res.status(404).json({
        message: "No project found",
      });
    }
    const secrets = await prisma.secret.findMany({
      where: {
        project: {
          userId: Number(userId),
        },
      },
      select: {
        sid: true,
        key: true,
        value: true,
      },
    });
    return res.status(200).json({
      secrets,
    });
  } catch (err) {
      console.log("error", err);
      res.status(500).json({
        message: "Internal Server Error",
      });
  }
}