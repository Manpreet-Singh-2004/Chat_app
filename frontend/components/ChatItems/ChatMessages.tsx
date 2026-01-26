"use client"
import { useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { chatMessagesAtom, messagesLoadingAtom } from "@/app/store/chats/chats.atoms";
import { fetchMessageAtom } from "@/app/store/chats/chat.controller";
import { currentUserAtom } from "@/app/store/users/users.atoms";
import useAuthApi from "@/app/api/Auth"; 

export default function ChatMessages({ id }: { id: string }) {

  const api = useAuthApi()
  const [messages] = useAtom(chatMessagesAtom);
  const{isLoading} = useAtom(messagesLoadingAtom)
  const currentUser = useAtomValue(currentUserAtom);
  const fetchMessages = useSetAtom(fetchMessageAtom);

  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch messages on mount or when chatId changes
  useEffect(() => {
    if(id){
      fetchMessages({api, chatId: id})
    }
  }, [fetchMessages])

  // Scrolling to the bottom
  useEffect(() =>{
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior: "smooth"})
    }
  }, [messages])

  if(isLoading && messages.length === 0){
    return(
      <div className="flex-1 p-4">
        Loading...
      </div>
    )
  }

  return (
<div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>No messages yet. Say hello! 👋</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isMe = msg.userId === currentUser?.id;

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                {!isMe && (
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">
                        {msg.user.firstName}
                    </p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 w-full text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })
      )}
      {/* Invisible element to scroll to */}
      <div ref={scrollRef} />
    </div>
  );
}