"use client"

import useAuthApi from "@/app/api/Auth"
import { useAuth } from "@clerk/nextjs"

interface Props{
    chat: any;
    otherUserId: string;
    setChat: (chat: any) => void;
}

export default function InviteActions({
    chat,
    otherUserId,
    setChat,
}: Props){
    const api = useAuthApi();
    const {userId} = useAuth();

    const isInviter = chat.invitedByUserId === userId;

    async function invite(){
        const res = await api.post("/api/chats/invite", {otherUserId});
        setChat(res.data);
    }
    async function accept(){
        const res = await api.post(`/api/chats/dm/${chat.chatId}/accept`);
        setChat(res.data)
    }
    async function decline(){
        const res = await api.post(`/api/chats/dm/${chat.chatId}/decline`);
        setChat(res.data);
    }

    if(chat.status === "NONE"){
        return (
            <div className="p-4">
                <button className="btn-primary" onClick={invite}>
                Start Chat
                </button>
            </div>
        );
    }

    if(chat.status === "INVITED"){
        if(isInviter){
            return (
                <div className="p-4 text-slate-400">
                Invite sent
                </div>
            );
        }
        return(
            <div className="flex gap-3 p-4">
                <button className="btn-primary" onClick={accept}>
                    Accept
                </button>
                <button className="btn-danger" onClick={decline}>
                    Decline
                </button>
            </div>
        )
    }

    if(chat.status === "DECLINED"){
        if(isInviter){
            return (
                <div className="p-4">
                <button className="btn-primary" onClick={invite}>
                    Re-invite
                </button>
                </div>
            );
        }
        return (
            <div className="p-4 text-slate-400">
                You declined this invite
            </div>
        );
    }
    return null;
}