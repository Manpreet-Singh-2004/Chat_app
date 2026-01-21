import type { Request, Response } from "express";
import {prisma} from '../../db/prisma.js'

export async function getChatId (req: Request, res: Response) {
    const userId = (req as any).user.id;
    const {otherUserId} =  req.body;

    try{
        const chat = await prisma.chat.findFirst({
            where:{
                chatType: "DM",
                chatUsers:{
                    some:{
                        userId,
                    },
                },
                AND: {
                    chatUsers: {
                        some: {
                            userId: otherUserId,
                        }
                    }
                }
            },
            select: {
                id: true
            }
        });

        if(!chat){
            return res.status(404).json({success: false, message: "No Chat was found. Please send an invite"});
        }

        return res.status(200).json({success: true, chat, message: "Chat found"});

    } catch(error){
        console.log("Chat Controller | Error fetching chat ID:", error);
        return res.status(500).json({error: "Internal Server Error | Chat Controller"})
    }
}