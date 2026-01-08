import { getAuth } from "@clerk/express";
import type {Request, Response} from "express";
import {prisma} from "../../db/prisma.js"

export default async function userProfile (req: Request, res: Response) {

    const {isAuthenticated, userId} = getAuth(req);

    if(!isAuthenticated){
        return res.status(401).json({error: "Unauthorized", message: "User is not authenticated"});
    }

    try{
        const user = await prisma.user.findUnique({
            where: {clerkId: userId},
        })

        if(!user){
            return res.status(404).json({error: "User not found", message: "No user found in DB with the giver clerkId"})
        }
        return res.status(200).json({ success: true , user});
    } catch(error){
        console.log("Error fetching user profile:", error);
        return res.status(500).json({error: "Internal Server Error"})
    }
}