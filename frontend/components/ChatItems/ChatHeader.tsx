"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import useAuthApi from "@/app/api/Auth";
import { useEffect, useState } from "react";
import type { User } from "@/app/types/user";
import ChatHeaderSkeleton from "./ChatHeaderSkeleton";

interface ChatHeaderProps {
  otherUserId: string;
}

export default function ChatHeader({ otherUserId }: ChatHeaderProps) {
  const api = useAuthApi();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!otherUserId) return;

    async function loadUser() {
      const res = await api.get(`/api/user/${otherUserId}`);
      setUser(res.data.user);
    }

    loadUser();
  }, [otherUserId]);

  if (!user) {
    console.log("Loading user for ChatHeader:", user, otherUserId);
    return (
      <div className="h-16 flex items-center px-4 border-b">
        < ChatHeaderSkeleton />
      </div>
    );
  }

  return (
    <div className="h-16 flex items-center gap-3 px-4 border-b bg-white dark:bg-slate-900">
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
        <p className="font-medium truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-slate-400 truncate">
          {user.email}
        </p>
      </div>
    </div>
  );
}
