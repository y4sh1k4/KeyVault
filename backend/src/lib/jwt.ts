import jwt from 'jsonwebtoken'
import "dotenv/config";

export const generateAccessToken = (id: number)=>{
    return jwt.sign(
        {id}, 
        process.env.ACCESS_TOKEN_SECRET!
        ,{ expiresIn: '15min' }
    )
}

export const generateRefreshToken = (id: number)=>{
    return jwt.sign(
        {id}, 
        process.env.REFRESH_TOKEN_SECRET!
        ,{ expiresIn: '7days' }
    )
}

