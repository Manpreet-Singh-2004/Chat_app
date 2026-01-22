"use client"

import { useState, useEffect, use } from "react"
import ChatHeader from "@/components/ChatItems/ChatHeader"
import useAuthApi from "@/app/api/Auth";
import InviteActions from "@/components/ChatItems/InviteActions";
import ChatMessages from "@/components/ChatItems/ChatMessages";
import ChatHeaderSkeleton from "@/components/ChatItems/ChatHeaderSkeleton";
import ChatFooter from "@/components/ChatItems/ChatFooter";
import { useAtom, useSetAtom } from "jotai";

import { activeChatAtom, chatLoadingAtom } from "@/app/store/chats/chats.atoms";
import { fetchDMBetweenUsersAtom } from "@/app/store/chats/chat.controller";

export default function ChatPage({params} : {params: Promise<{id: string}>}){
    const {id: otherUserId} = use(params);
    const api = useAuthApi();

    const [chat, setChat] = useAtom(activeChatAtom)
    const [loading] = useAtom(chatLoadingAtom)

    const fetchChat = useSetAtom(fetchDMBetweenUsersAtom)

    useEffect(() => {
      if(otherUserId){
        fetchChat({api, otherUserId})
      }
      console.log(`Chat fetched | useEffect in Chat/[id]/page.tsx: ${fetchChat}`)
    }, [otherUserId, fetchChat])

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

      <ChatFooter />
    </div>
  );
}