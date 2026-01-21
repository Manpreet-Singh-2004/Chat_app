"use client"

import { useState, useEffect, use } from "react"
import ChatHeader from "@/components/ChatItems/ChatHeader"
import useAuthApi from "@/app/api/Auth";
import InviteActions from "@/components/ChatItems/InviteActions";
import ChatMessages from "@/components/ChatItems/ChatMessages";
import ChatHeaderSkeleton from "@/components/ChatItems/ChatHeaderSkeleton";
import { Chat } from "@/app/types/chats";

export default function ChatPage({params} : {params: Promise<{id: string}>}){
    const {id: otherUserId} = use(params);
    const api = useAuthApi();

    const [chat, setChat] = useState<Chat | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChat(){
            try{
                const res = await api.get(`api/chats/dm/${otherUserId}`)
                setChat(res.data)
            } catch(error){
                setChat({
                  id: "placeholder", 
                  status: "NONE",
                  chatType: "DM",
                  createdAt: new Date().toISOString()
              } as Chat);
            } finally{
                setLoading(false);
            }
        }
        if(otherUserId){
          loadChat()
        }
    }, [otherUserId])

    if(loading) {
      return (
        <div className="p-4">
          <ChatHeaderSkeleton />
        </div>
    );
    }
    if(!chat) return null;

    return (
    <div className="flex flex-col h-full">
      <ChatHeader otherUserId={otherUserId} />

      {chat.status === "ACTIVE" ? (
        <ChatMessages id={chat.id!} />
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