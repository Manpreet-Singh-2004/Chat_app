"use client"

import {useState, useEffect} from "react"
import useAuthApi from "@/app/api/Auth"

type User = {
    id: string;
    email: string;
    username: string | null;
}

export default function UserProfile(){
    const api = useAuthApi();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>{
            const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setUser(res.data.user);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    }, [api])

    if (loading) return <p>Loading…</p>;
    if (error) return <p>{error}</p>;

  return(
        <div>
      <h1>User Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {user?.username ?? "No username"}</p>
    </div>
  )
}