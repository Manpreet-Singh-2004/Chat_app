import { atom } from "jotai";
import { Chat } from "@/app/types/chats";

// Current active chat
export const activeChatAtom = atom<Chat | null>(null)

// loading state for chat
export const chatLoadingAtom = atom<boolean>(false)

// Error State
export const chatErrorAtom = atom<string | null>(null)