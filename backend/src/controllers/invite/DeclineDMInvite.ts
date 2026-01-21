import type { Request, Response } from "express";
import {prisma} from '../../db/prisma.js'

export async function declineDMInvite(req: Request, res: Response){
    const userId = (req as any).user.id;
    const {chatId} = req.params;

    if(!chatId){
        return res.status(400).json({error: "chatId parameter is required"});
    }

    try{

        const chat = await prisma.chat.findUnique({
            where: {id: chatId},
            include: {chatUsers: true},
        });

        if(!chat){
            return res.status(400).json({error:"Chat not found"});
        }

        if(chat.chatType !== "DM"){
            return res.status(403).json({error: "This is not a DM Chat"});
        }

        if(chat.status !== "INVITED"){
            return res.status(400).json({error: "Invite is not pending"});
        }

        if(chat.invitedByUserId === userId){
            return res.status(400).json({error: "You cannot decline an invite you sent"});
        }

        const chatUser = chat.chatUsers.find(cu => cu.userId === userId);

        if(!chatUser){
            return res.status(403).json({error: "Not a member of this chat"});
        }

        if(chatUser.status !== "PENDING"){
            return res.status(400).json({error: "Invite is already handled"});
        }

        await prisma.$transaction([
            prisma.chatUser.update({
                where: {id: chatUser.id},
                data: {status: "DECLINED"},
            }),
            prisma.chat.update({
                where: {id: chatId},
                data:{ status: "DECLINED"}
            })
        ]);

        return res.status(200).json({success: true, chatId, status: "DECLINED", message: "DM invite declined"});

    } catch(error){
        console.error("Decline DM Invite Controller | Error declining DM invite:", error);
        return res.status(500).json({error: "Decline DM Invite Controller | Internal server error"});
    }
}