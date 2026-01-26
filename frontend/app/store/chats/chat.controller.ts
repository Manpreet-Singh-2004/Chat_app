import axios from "axios";
import { atom } from "jotai";
import { activeChatAtom, chatLoadingAtom, chatErrorAtom, chatMessagesAtom, messagesLoadingAtom } from './chats.atoms';
import { Chat, Message } from "@/app/types/chats";
import {currentUserAtom} from "../users/users.atoms"

export const fetchDMBetweenUsersAtom = atom(
    null,
    async(_get, set, {api, otherUserId}: {api: ReturnType<typeof axios.create>; otherUserId: string}) => {
        set(chatLoadingAtom, true);
        set(chatErrorAtom, null);

        set(activeChatAtom, null);

        try{
            const res = await api.get(`/api/chats/dm/${otherUserId}`);
            set(activeChatAtom, res.data)

        } catch(error: unknown){

            if(axios.isAxiosError(error)){
                if(error.response?.status === 404){
                    set(activeChatAtom, {
                        id: "new", // placeholder for now
                        status: "NONE",
                        chatType: "DM",
                        createdAt: new Date().toISOString(),
                    } as Chat)
                } else{
                    set(chatErrorAtom, error.response?.data?.message || error.message)
                }
            } else{
                set(chatErrorAtom, "An unexpected error occured")
            }
        } finally{
            set(chatLoadingAtom, false)
        }
    }
)

export const sendMessageAtom = atom(
    null,
    async(get, set, {api, chatId, content}: {api: ReturnType<typeof axios.create>; chatId: string; content: string}) => {

        const currentUser = get(currentUserAtom)
        if(!currentUser){
            console.log("Cannot send message: User is not logged in")
            return
        }

        const tempId = Math.random().toString(36).substring(7);
        const optimisticMessage: Message = {
            id: tempId,
            content,
            chatId,
            userId: currentUser.id,
            createdAt: new Date().toISOString(),
            user:{
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                username: currentUser.username || "",
                imageUrl: currentUser.imageUrl
            }
        };

        const currentMessages = get(chatMessagesAtom);
        set(chatMessagesAtom, [...currentMessages, optimisticMessage])

        try{
            const res = await api.post(`/api/chats/${chatId}/messages`, {content});
            if(res.data.success){
                const realMessage = res.data.data;
                set(chatMessagesAtom, (prev) => prev.map(m => m.id === tempId ? realMessage : m));
            }
            return res.data
        } catch(error){
            console.log(`Error sending the message | chat controller store: ${error}`)
            throw error
        }
    }
)

export const fetchMessageAtom = atom(
    null,
    async (get, set, {api, chatId}: {api: ReturnType<typeof axios.create>; chatId: string}) => {
        set(messagesLoadingAtom, true);
        try{
            const response = await api.get(`/api/chats/${chatId}/messages`);
            if(response.data.success){
                set(chatMessagesAtom, response.data.data)
            }
        } catch(error){
            console.log("Error loading the messages | fetchMessageAtom")
            set(chatMessagesAtom, [])
            throw error
        } finally{
            set(messagesLoadingAtom, false)
        }
    }
)