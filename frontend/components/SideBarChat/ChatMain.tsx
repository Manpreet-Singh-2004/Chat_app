"use client";

import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatItem from "./ChatItem";
import { Input } from "@/components/ui/input";
import useAuthApi from "@/app/api/Auth";
import ChatItemSkeleton from "./ChatItemSkeleton";
import { usersAtom, userLoadingAtom, userErrorAtom } from "@/app/store/users/users.atoms";
import {fetchUserAtom} from "@/app/store/users/user.controller";
import { useAtom, useSetAtom  } from "jotai";


export default function ChatSidebar() {
  const api = useAuthApi();

  const [users] = useAtom(usersAtom);
  const [loading] = useAtom(userLoadingAtom);
  const [error] = useAtom(userErrorAtom);
  const fetchUsers = useSetAtom(fetchUserAtom);

  useEffect(() => {
    fetchUsers(api);
  }, []);

  return (
    <aside className="w-90 h-screen flex flex-col rounded-xl border border-slate-800">
      <ChatHeader />

      {/* Search */}
      <div className="p-3">
        <Input
          placeholder="Search or start a new chat"
          className=" focus-visible:ring-slate-700"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {loading &&
        Array.from({ length: 6 }).map((_, i) => (
            <ChatItemSkeleton key={i} />
        ))}

        {error && <p className="text-sm text-red-500 px-2">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="text-sm text-slate-400 px-2">No users found</p>
        )}
        {!loading &&
          !error &&
          users.map((user) => <ChatItem key={user.id} user={user} />)}
      </div>
    </aside>
  );
}
