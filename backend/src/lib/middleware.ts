import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const { authHeader } = req.headers;
    if (!authHeader || typeof authHeader !== "string") {
        return res.status(401).json({
            message: "No authorization header provided"
        });
        }
    const token = authHeader.split(" ")[1];
    try{
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! ) as {id: string}
        req.userId = decodedToken.id;
        next();
    }
    catch(e){
        console.log("error in middleware", e)
        res.json({status: 400, message: "Invalid Token"})
    }
}