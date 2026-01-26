import type { Request, Response } from 'express';
import {prisma} from '../../db/prisma.js'

export async function inviteToDM(req: Request, res: Response){
    const userId = (req as any).user.id;
    const {otherUserId} = req.body;

    if(!otherUserId || typeof otherUserId !== 'string'){
        return res.status(400).json({error: "otherUserId is required and must be a string"});
    }

    if(otherUserId === userId){
        return res.status(400).json({error: "You cannot invite yourself to a DM"});
    }

    const otherUserExists = await prisma.user.findUnique({
        where: {id: otherUserId},
        select: {id: true},
    })

    if(!otherUserExists){
        return res.status(404).json({error: "The user you are trying to invite does not exist."});
    }

    const dmKey = [userId, otherUserId].sort().join(":");

    try{
        const existingChat = await prisma.chat.findUnique({
            where: {dmKey},
            include:{
                chatUsers: true
            },
        })

        // Chat dose not exists - Create new invite

        if(!existingChat){
            const chat = await prisma.chat.create({
                data:{
                    chatType: "DM",
                    status: "INVITED",
                    dmKey,
                    invitedByUserId: userId,
                    chatUsers:{
                        create:[
                            {
                                userId,
                                status: "ACCEPTED", // Inviter automatically accepts
                            },
                            {
                                userId: otherUserId,
                                status: "PENDING", // Invitee is pending because it is sent to them
                            },
                        ],
                    },
                },
                // Only send back the the id and the status
                select:{ 
                    id: true,
                    status: true,
                },
            })

            return res.status(201).json({
                success: true,
                id: chat.id,
                status: chat.status,
                invitedByUserId: userId,
                message: "Invite Sent"
            })
        }
        //  Chat already exists

        if(existingChat.status === "ACTIVE"){
            return res.status(200).json({
                success: true,
                chatId: existingChat.id,
                status: existingChat.status,
                message: "DM already active"
            })
        }

//  when in Invite state

        if(existingChat.status === "INVITED"){
            
            //  If invite sent by same inviter
            if(existingChat.invitedByUserId === userId){
                return res.status(200).json({
                success: true,
                chatId: existingChat.id,
                status: "INVITED",
                message: "Invite already sent"
            })
            }
        
        
        const chatUser = existingChat.chatUsers.find(
            (cu) => cu.userId === userId
        )

        if(!chatUser || chatUser.status !== "PENDING"){
            return res.status(403).json({error: "Not allowed"})
        }

        await prisma.$transaction([
            prisma.chatUser.update({
                where: {
                    userId_chatId: {
                        userId,
                        chatId: existingChat.id,
                    },
                },
                data: {status: "ACCEPTED"},
            }),
            prisma.chat.update({
                where: {id: existingChat.id},
                data: {status: "ACTIVE"},
            })
        ]);

        return res.status(200).json({
            success: true,
            chatId: existingChat.id,
            status: "ACTIVE",
            message: "Invite accepted, DM is now active"
        })
    }
    
// -- Invite by same invitee and inviter END


        if(existingChat?.status === "DECLINED"){
            const chat = await prisma.chat.update({
                where: {id: existingChat.id},
                data:{
                    status: "INVITED",
                    invitedByUserId: userId,
                    chatUsers:{
                        updateMany:[
                            {
                                where: {userId},
                                data: {status: "ACCEPTED"},
                            },
                            {
                                where: {userId: otherUserId},
                                data: {status: "PENDING"},
                            },
                        ],
                    },
                },
                select:{
                    id: true,
                    status: true
                },
            });

            return res.status(200).json({
                success: true,
                id: chat.id,
                invitedByUserId: userId,
                status: chat.status,
                message: "Invite Re-Sent"
            });
        }

        return res.status(500).json({error: "Invalid Chat State"})

    } catch (error) {
        console.error("Error inviting to DM:", error);
        return res.status(500).json({error: "Internal server error"});
    }

}