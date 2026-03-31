import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET|| "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzczODA4OTUwLCJleHAiOjE3NzM4MDk4NTB9.WKnPtZQLIT43ROACyvD9I9BIIfY6efX1xP2EcU24laQ";
export interface AuthPayload {
  userId: string;
}
export const verifyToken = (token: string)=>{
    try{
        console.log("Verifying token:", token);
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        console.log("Decoded token payload:", decoded);
        return decoded.userId;
    }
    catch(err){
        console.error("Token verification failed:", err);
        throw new Error("Invalid token");
    }
}