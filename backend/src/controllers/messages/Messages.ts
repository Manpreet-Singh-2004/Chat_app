import type {Request, Response} from "express"
import {prisma} from "../../db/prisma.js"

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

export async function getMessage(req: Request, res: Response){
    const userId = (req as any).user.id;
    const {chatId} = req.params;

    if(!chatId){
        console.log('Chat id is not present')
        return res.status(400).json({success: false, message: "Chat id is not fount"})
    }

    try{
        const membership = await prisma.chatUser.findUnique({
            where: {
                userId_chatId: {
                    userId: userId,
                    chatId: chatId
                }
            }
        });

        if(!membership){
            console.log(`You are not a member of this chat`)
            return res.status(403).json({success: false, message: "You are not a member of this chat"})
        }

        const messages = await prisma.message.findMany({
            where: {chatId},
            orderBy: {createdAt: "asc"}, // Oldest message first
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true
                    },
                },
            },
        });

        return res.status(200).json({success: true, data: messages, message: "Found messages"})

    } catch(error){
        console.log('Encountered internal server error:', error)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}