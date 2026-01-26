import { atom } from "jotai";
import { Chat, Message } from "@/app/types/chats";

// Current active chat
export const activeChatAtom = atom<Chat | null>(null)

// loading state for chat
export const chatLoadingAtom = atom<boolean>(false)

// Error State
export const chatErrorAtom = atom<string | null>(null)

export const chatMessagesAtom = atom<Message[]>([]);

export const messagesLoadingAtom = atom<boolean>(false)