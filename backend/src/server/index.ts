import express from 'express';
import { signupSchema } from '../validations/signupSchema';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from '../lib/jwt';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";


const app = express();
const saltRounds = 10;
app.post("/auth/signup",async(req,res)=>{
    const {email, password} = req.body;
    const parseBody = signupSchema.safeParse(req.body)
    if(!parseBody.success){
        return res.json({status: 400, message: "Invalid request body"})
    }
    const existing = await prisma.user.findUnique({
        where: { email: email },
    })
    if(existing){
        return res.json({status: 400, message: "User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser =  await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword
        },
    });

    const accessToken = generateAccessToken(newUser.id)
    const refreshToken = generateRefreshToken(newUser.id)

    await prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken }
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,        
        sameSite: "strict",  
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
        accessToken,
    });

})

app.post("/auth/login",async(req,res)=>{
    const {email, password} = req.body;
    const parseBody = signupSchema.safeParse(req.body)
    if(!parseBody.success){
        return res.json({status: 400, message: "Invalid request body"})
    }
    const existing = await prisma.user.findUnique({
        where: { email: email },
    })
    if(!existing){
        return res.json({status: 400, message: "User not logged in"})
    }

    const correctPassword = await bcrypt.compare(password, existing.password)
    if(!correctPassword){
        return res.json({status: 400, message: "Incorrect Password"})
    }

    const accessToken = generateAccessToken(existing.id)
    const refreshToken = generateRefreshToken(existing.id)

    await prisma.user.update({
        where: { id: existing.id },
        data: { refreshToken }
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,        
        sameSite: "strict",  
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
        accessToken,
    });

})

app.post("/auth/refresh",async(req,res)=>{
    const {refreshToken} = req.body;
    if (!refreshToken){
        return res.json({
            status: 400, message:"no refresh token in body"
        })
    }

    try{
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET! ) as {id: string}
        const userId = decodedToken.id;
        const user = await prisma.user.findUnique({
            where: {id: Number(userId)}
        })
        if(!user || user.refreshToken !== refreshToken){
            return res.json({
                status: 400, 
                message: "No user with this token found"
            })
        }
        const accessToken = generateAccessToken(user.id)
        const newRefreshToken = generateRefreshToken(user.id)

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,        
            sameSite: "strict",  
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({
            accessToken
        })
    }
    catch{
        res.json({
            status: 400, message: "Incorrect refresh token"
        })
    }

})

app.post("/auth/logout", async (req, res) => {
  const { userId } = req.body;

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { refreshToken: null }
  });

  res.json({ message: "Logged out successfully" });
});