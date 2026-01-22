import axios from "axios";
import { atom } from "jotai";
import { activeChatAtom, chatLoadingAtom, chatErrorAtom } from './chats.atoms';
import { Chat } from "@/app/types/chats";

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
    async(_get, set, {api, chatId, content}: {api: ReturnType<typeof axios.create>; chatId: string; content: string}) => {
        try{
            const res = await api.post(`/api/chats/${chatId}/messages`, {content})
            return res.data
        } catch(error){
            console.log(`Error sending the message | chat controller store: ${error}`)
            throw error
        }
    }
)