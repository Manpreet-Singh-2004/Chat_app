"use client"

import { useState, useEffect } from "react"
import ChatHeader from "@/components/ChatItems/ChatHeader"
import useAuthApi from "@/app/api/Auth";
import InviteActions from "@/components/ChatItems/InviteActions";
import ChatMessages from "@/components/ChatItems/ChatMessages";

type ChatStatus = "NONE" | "INVITED" | "ACTIVE" | "DECLINED";

interface ChatMeta{
    chatId?: string;
    status: ChatStatus;
    invitedByUserId?: string;
}

export default function ChatPage({params} : {params: {userId: string}}){
    const otherUserId = params.userId;
    const api = useAuthApi();

    const [chat, setChat] = useState<ChatMeta | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChat(){
            try{
                const res = await api.get(`/chats/dm/${otherUserId}`)
                setChat(res.data)
            } catch(error){
                setChat({status: "NONE"})
            } finally{
                setLoading(false);
            }
        }
        loadChat()
    }, [otherUserId])

    if(loading) return <div className="p-4">Loading…</div>;
    if(!chat) return null;

    return (
    <div className="flex flex-col h-full">
      <ChatHeader userId={otherUserId} />

      {chat.status === "ACTIVE" ? (
        <ChatMessages chatId={chat.chatId!} />
      ) : (
        <InviteActions
          chat={chat}
          otherUserId={otherUserId}
          setChat={setChat}
        />
      )}
    </div>
  );
}