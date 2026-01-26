"use client"

import useAuthApi from "@/app/api/Auth"
import { Chat } from "@/app/types/chats"
import { Button } from "../ui/button"
import { currentUserAtom } from "@/app/store/users/users.atoms"
import { useAtomValue } from "jotai"

interface Props{
    chat: Chat;
    otherUserId: string;
    setChat: (chat: Chat) => void;
}

export default function InviteActions({
    chat,
    otherUserId,
    setChat,
}: Props){
    const api = useAuthApi();
    const currentUser = useAtomValue(currentUserAtom);

    const isInviter = chat.invitedByUserId === currentUser?.id;

    async function invite(){
        const res = await api.post("/api/chats/invite", {otherUserId});
        setChat(res.data);
    }
    async function accept(){
        const res = await api.post(`/api/chats/dm/${chat.id}/accept`);
        setChat(res.data)
    }
    async function decline(){
        const res = await api.post(`/api/chats/dm/${chat.id}/decline`);
        setChat(res.data);
    }

    if(chat.status === "NONE"){
        return (
            <div className="p-4">
                <Button className="btn-primary" onClick={invite}>
                Start Chat
                </Button>
            </div>
        );
    }

    if(chat.status === "INVITED"){
        if(isInviter){
            return (
                <div className="p-4 text-slate-400 self-center">
                Invite sent
                </div>
            );
        }
        return(
            <div className="flex gap-3 p-4 center self-center">
                <Button className="btn-primary" onClick={accept}>
                    Accept
                </Button>
                <Button className="btn-danger" onClick={decline}>
                    Decline
                </Button>
            </div>
        )
    }

    if(chat.status === "DECLINED"){
        if(isInviter){
            return (
                <div className="p-4 self-center">
                <Button className="btn-primary" onClick={invite}>
                    Re-invite
                </Button>
                </div>
            );
        }
        return (
            <div className="p-4 text-slate-400 self-center">
                You declined this invite
            </div>
        );
    }
    return null;
}