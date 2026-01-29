import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

// This one kept running

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

    console.log(`New instance of api: ${api} created`)

    return api;
}

// In this the socket is not working

// export default function useAuthApi(){
//     const {getToken} = useAuth();

//     const api = useMemo(() => {
//         const axiosInstance = axios.create({
//             baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//         })

//         axiosInstance.interceptors.request.use(async(config) => {
//             const token = await getToken()

//             if(token){
//                 config.headers.Authorization = `Bearer ${token}`;
//             } 
//             return config;
//         });
//         return axiosInstance;
//     }, [getToken])

//     console.log(`New instance of api: ${api} created`)

//     return api;
// }