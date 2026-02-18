import { prisma } from "../../lib/prisma";
import { projectSchema } from "../../validations/projectSchema";
import { Request, Response } from 'express';

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const existingProject = await prisma.project.findUnique({
      where: {
        userId: Number(userId),
      },
    });
    if (existingProject) {
      return res.status(409).json({
        message: "A single user can create only one project", 
      });
    }

    const { title, description } = req.body;
    const parseBody = projectSchema.safeParse({ title, description });
    if (!parseBody.success) {
      return res.status(400).json({
        message: "Invalid Input",
      });
    }
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: Number(userId),
      },
    });
    return res.status(201).json({
      project,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const getProjectController = async (req: Request, res: Response)=>{
  try{
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const existingProject = await prisma.project.findUnique({
      where: {
        userId: Number(userId),
      },
    });
    return res.status(200).json({
      existingProject,
    });
  }
  catch(e){
    console.log("error", e);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}