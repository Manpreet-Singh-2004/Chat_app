import axios from "axios";
import { useAuth } from "@clerk/nextjs";

export default function useAuthApi(){
    const {getToken} = useAuth();

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    })
    api.interceptors.request.use(async(config) => {
        const token = await getToken()

        if(token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    })

    return api;
}