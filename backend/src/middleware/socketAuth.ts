import { Socket } from "socket.io";
import { verifyToken } from "@clerk/backend";

export interface AuthenticatedSocket extends Socket {
    userId?: string;
}

export const socketAuth = async (socket: Socket, next: (err?: any) => void) =>{

    const token = socket.handshake.auth.token as string | undefined;

    if(!token){
        console.log('Socket Auth | no token is provided')
        return next(new Error('Authentication error: no token is provided'))
    }

    try{
        const verifiedToken = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        })

        if(!verifiedToken){
            return next(new Error("Authintication Error: invalid token payload"))
        }

        (socket as AuthenticatedSocket).userId = verifiedToken.sub

        console.log("Socket Auth | User authenticated: ", verifiedToken.sub)
        next()

    } catch(err){
        console.log("Socket Auth | Verification failed: ", err)
        next(new Error("Authentication error | Socket Auth"))
    }
}