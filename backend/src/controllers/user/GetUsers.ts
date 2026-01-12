import {prisma} from '../../db/prisma.js'
import { getAuth } from '@clerk/express';
import type {Request, Response} from "express";

export default async function getUsers (req: Request, res: Response){
    // const {isAuthenticated} = getAuth(req);
    // if(!isAuthenticated){
    //     return res.status(401).json({error: "Unauthorized", message: "User is not authenticated"});
    // }
    try{
        const users = await prisma.user.findMany();

        if(!users || users.length === 0){
            return res.status(404).json({message: "Could not find any users"});
        }
        return res.status(200).json({ success: true , users});
    } catch(error){
        console.log("Error fetching users:", error);
        return res.status(500).json({error: "Internal Server Error"})
    }
}