"use client";

import { Plus } from "lucide-react"; 

export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 ">
      <h2 className="text-lg font-semibold">Chats</h2>
      <button
        className="p-2 rounded-full hover:bg-slate-900 transition-colors"
        aria-label="New Chat"
      >
        <Plus className=" w-5 h-5" />
      </button>
    </div>
  );
}
