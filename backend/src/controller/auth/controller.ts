import { generateAccessToken, generateRefreshToken } from "../../lib/jwt";
import { prisma } from "../../lib/prisma";
import { signupSchema } from "../../validations/signupSchema";
import bcrypt from "bcrypt";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const parseBody = signupSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const existing = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existing) {
      return res.status(409).json({ message: "User already exists" }); 
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      accessToken,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const logInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const parseBody = signupSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const existing = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!existing) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const correctPassword = await bcrypt.compare(password, existing.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const accessToken = generateAccessToken(existing.id);
    const refreshToken = generateRefreshToken(existing.id);

    await prisma.user.update({
      where: { id: existing.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      accessToken,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      message: "no refresh token in body",
    });
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as { id: string };
    const userId = decodedToken.id;
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(404).json({
        message: "No user with this token found",
      });
    }
    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      accessToken,
    });
  } catch {
    res.status(400).json({
      message: "Incorrect refresh token",
    });
  }
}

export const logOutController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { refreshToken: null },
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}