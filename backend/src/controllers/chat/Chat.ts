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
            const newChat = await prisma.chat.create({
                data:{
                    chatUsers: {
                        create: [
                            {
                                user: {
                                    connect:{
                                        id: userId,
                                    }
                                }
                            },
                            {
                                user: {
                                    connect:{
                                        id: otherUserId,
                                    }
                                }
                            }
                        ]
                    }
                },
                select:{
                    id: true
                },
            });

            return res.status(201).json({success: true, chat: newChat, message: "New chat created"});
        }

        return res.status(200).json({success: true, chat, message: "Chat found"});

    } catch(error){
        console.log("Error fetching chat ID:", error);
        return res.status(500).json({error: "Internal Server Error"})
    }
}