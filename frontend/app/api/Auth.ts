import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";


export default function useAuthApi(){
    const {getToken} = useAuth();

    const api = useMemo(() => {
        const axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        })

        axiosInstance.interceptors.request.use(async(config) => {
            const token = await getToken()

            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            } 
            return config;
        });
        return axiosInstance;
    }, [getToken])

    console.log(`New instance of api: ${api} created`)

    return api;
}