import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { Send, Plus } from 'lucide-react'; 

export default function ChatFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center gap-2 p-3 max-w-4xl mx-auto">
        
        <Button variant="ghost" size="icon">
          <Plus />
        </Button>

        <Input
          placeholder="Type a message..."
          className="flex-1"
        />

        <Button size="icon" type='submit'>
          <Send />
        </Button>
      </div>
    </div>
  )
}
