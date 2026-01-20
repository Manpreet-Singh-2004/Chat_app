import type {Request, Response } from 'express';
import {prisma} from '../../db/prisma.js'

export async function acceptDMInvite(req: Request, res: Response){
    const userId = (req as any).user.id;
    const {chatId} = req.params

    if(!chatId){
        return res.status(400).json({error: "chatId parameter is required"});
    }

    const chat = await prisma.chat.findUnique({
        where: {id: chatId},
        include: {chatUsers: true},
    })

    if(!chat){
        return res.status(404).json({error: "Chat is not found"});
    }
    if(chat.chatType !== "DM"){
        return res.status(403).json({error: "This is not a DM Chat"});
    }
    if(chat.status !== "INVITED"){
        return res.status(400).json({error: "Invite is not pending"})
    }
    if(chat.invitedByUserId === userId){
        return res.status(400).json({error: "You cannot accept an invite you sent"});
    }

    const chatUser = chat.chatUsers.find(cu => cu.userId === userId);

    if(!chatUser){
        return res.status(403).json({error: "Not a member of this chat"});
    }
    if(chatUser.status !== "PENDING"){
        return res.status(400).json({error: "Invite already handled"});
    }

    await prisma.$transaction([
        prisma.chatUser.update({
            where: {
                userId_chatId: {
                    userId,
                    chatId,
                },
            },
            data:{status: "ACCEPTED"},
        }),
        prisma.chat.update({
            where: {id: chatId},
            data: {status: "ACTIVE"}
        }),
    ]);

    return res.status(200).json({success: true, chatId, status: "ACTIVE", message: "DM invite accepted"})
}