import type { Request, Response } from "express";
import {prisma} from '../../db/prisma.js'

export async function getDMBetweenUsers (req: Request, res: Response) {
    const userId = (req as any).user.id;
    const {otherUserId} =  req.params;

    if(!otherUserId){
        return res.status(400).json({success: false, message: "Other User ID is required"})
    }

    try{
        const chat = await prisma.chat.findFirst({
            where:{
                chatType: "DM",
                AND: [
                    {chatUsers: {some: {userId: userId}}},
                    {chatUsers: {some: {userId: otherUserId}}}
                ]
            },
            select:{
                id: true,
                status: true,
                invitedByUserId: true
            }
        });

        if(!chat){
            return res.status(404).json({success: false, message: "No Chat was found. Please send an invite"});
        }

        console.log("Chat found between users:", chat);
        return res.status(200).json({success: true, id: chat.id, status: chat.status, invitedByUserId: chat.invitedByUserId, message: "Chat found"});

    } catch(error){
        console.log("Chat Controller | Error fetching chat ID:", error);
        return res.status(500).json({error: "Internal Server Error | Chat Controller"})
    }
}
