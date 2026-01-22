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

// Controller for sending a message

export async function sendMessage(req: Request, res: Response){
    const userId = (req as any).user.id
    const {chatId} = req.params;
    const {content} = req.body;

    if(!content || !chatId){
        console.log(`No Content or ChatId found`);
        return res.status(404).json({success: false, message: "No content or chatId found"});
    }
    try{
        const chat = await prisma.chat.findUnique({
            where: {id: chatId},
            include: {chatUsers: true}
        });

        if(!chat){
            console.log(`Chat not found`)
            return res.status(404).json({success: false, message: "Chat not found"})
        }
        const isParticipant = chat.chatUsers.some(member => member.userId === userId)

        if(!isParticipant){
            console.log(`You are not a Participant`)
            return res.status(403).json({success: false, message: "You are not a particapant"})
        }
        if(chat.status === "DECLINED"){
            console.log("Chat has been declined")
            return res.status(403).json({success: false, message: "Chat has been declined"})
        }

        const message = await prisma.message.create({
            data:{
                content,
                userId,
                chatId
            },
            include:{ // including sender details for frontend usage
                user:{
                    select:{
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true
                    }
                }
            }
        });

        return res.status(201).json({success: true, message:"Message sent", data: message})

    } catch(error){
        console.log(`Error while creating message: ${error}`)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}