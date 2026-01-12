import { getAuth } from "@clerk/express";
import type {Request, Response, NextFunction} from "express";
import {prisma} from "../db/prisma.js";

const checkAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {isAuthenticated} = getAuth(req);
    if(!isAuthenticated){
        return res.status(401).json({error: "Unauthorized", message: "User is not authenticated"});
    }
    next();
};

const getAuthenticatedUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {isAuthenticated, userId} = getAuth(req);

    if(!isAuthenticated){
        return res.status(401).json({error: "Unauthorized", message: "User is not authenticated | middleware/auth.ts"});
    }

    try{
        const user = await prisma.user.findUnique({
            where:{
                clerkId: userId,
            }
        });
        if(!user){
            return res.status(404).json({error: "User not found", message: "Authenticated user not found in database"});
        }
        (req as any).user=user;
        return next()
    }
    catch(error){
        console.log("Error fetching authenticated user:", error);
        return res.status(500).json({error: "Internal Server Error", message: "Could not fetch authenticated user | middleware/auth.ts"});
    }
}

export default {checkAuth, getAuthenticatedUser}