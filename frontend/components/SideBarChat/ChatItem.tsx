"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import type {User} from "@/app/types/user";
import { UserRound  } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatItemProps{
    user: User;
}

export default function ChatItem({ user }: ChatItemProps) {
  const router = useRouter();

  function openChat(){
    router.push(`/chat/${user.id}`)
  }

  return (
  <div
    onClick={openChat}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
      "bg-white dark:bg-slate-900",           
      "hover:bg-slate-100 dark:hover:bg-slate-800"  
    )}
  >
        {user.imageUrl ? (
        <Image
            src={user.imageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            width={40}
            height={40}
            className="rounded-full object-cover"
        />
        ) : (
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                <UserRound className="h-5 w-5 text-slate-300" />
            </div>
        )}


      <div className="min-w-0">
        <p className="font-medium truncate">{user.username}</p>
        <p className="text-sm text-slate-400 truncate">
          {user.firstName} { user.lastName }
        </p>
      </div>
    </div>
  );
}
