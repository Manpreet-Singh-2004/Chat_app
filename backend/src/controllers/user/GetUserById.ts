import {prisma} from "../../db/prisma.js"
import type {Request, Response} from "express";
import { getAuth } from '@clerk/express';

export default async function getUserById (req: Request, res: Response){
    const {isAuthenticated} = getAuth(req);
    
    if(!isAuthenticated){
        return res.status(401).json({error: "Unauthorized", message: "User is not authenticated"});
    }
    try{
        const {id} = req.params;

        const user = await prisma.user.findUnique({
            where: {id: id},
        })
        if(!user){
            return res.status(404).json({error: "User not found", message: "No user found in DB with the given ID"})
        }
        return res.status(200).json({ success: true , message: "Information of a specific User" , user});
    } catch(error){
        console.log("Error fetching user by ID: ", error)
        return res.status(500).json({error: "Internal Server Error"})
    }
}