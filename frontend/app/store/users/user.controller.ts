import axios from "axios";
import {atom} from "jotai";
import { usersAtom, userLoadingAtom, userErrorAtom, currentUserAtom } from "./users.atoms";

export const fetchUserAtom = atom(
    null,
    async(_get, set, api: ReturnType<typeof axios.create>) => {
        set(userLoadingAtom, true);
        set(userErrorAtom, null);

        try{
            const res = await api.get("/api/users");
            const users = Array.isArray(res.data)
                ? res.data
                : res.data?.users || [];

            set(usersAtom, users);
        } catch(error: unknown){
            if(axios.isAxiosError(error)){
                set(userErrorAtom, error.response?.data?.message || error.message)
            } else if(error instanceof Error){
                set(userErrorAtom, error.message);
            } else{
                set(userErrorAtom, "Something went wrong")
            }
        } finally{
            set(userLoadingAtom, false);

        }
    }
)

export const fetchProfileAtom = atom(
    null,
    async(_get, set, api: ReturnType<typeof axios.create>) => {
        set(userLoadingAtom, true);
        try{
            const res = await api.get("api/user/profile")
            set(currentUserAtom, res.data.user)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                set(userErrorAtom, error.response?.data?.message || error.message)
            } else if(error instanceof Error){
                set(userErrorAtom, error.message);
            } else{
                set(userErrorAtom, "Something went wrong with currentUser Atom | User Controller atom")
            }
        } finally{
            set(userLoadingAtom, false)
        }
    }
)