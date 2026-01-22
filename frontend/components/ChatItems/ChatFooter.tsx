import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { Send, Plus } from 'lucide-react';
import {sendMessageAtom} from '@/app/store/chats/chat.controller'
import { useAtomValue, useSetAtom } from 'jotai';
import {activeChatAtom} from '@/app/store/chats/chats.atoms'
import { useState } from 'react';
import useAuthApi from '@/app/api/Auth'

export default function ChatFooter() {

  const [message, setMessage] = useState("")
  const activeChat = useAtomValue(activeChatAtom);
  const sendMessage = useSetAtom(sendMessageAtom)

  const api = useAuthApi()

  const handleSend = async () =>{
    if(!message.trim() || !activeChat?.id) return;

    try{
      await sendMessage({api, chatId: activeChat.id, content: message});
      setMessage("")
      // console.log("Message sent")
    } catch(error){
      console.log(`Error saving the message | ChatFooter: ${error}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) =>{
    if(e.key === "Enter"){
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center gap-2 p-3 max-w-4xl mx-auto">
        
        <Button variant="ghost" size="icon">
          <Plus />
        </Button>

        <Input
          placeholder="Type a message..."
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!activeChat?.id || activeChat.status === "DECLINED"}
        />

        <Button size="icon" onClick={handleSend} disabled={!message.trim() || !activeChat?.id}>
          <Send />
        </Button>
      </div>
    </div>
  )
}
