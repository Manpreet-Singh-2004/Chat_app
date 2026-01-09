"use client"

import { useState, useEffect } from "react"
import useAuthApi from "@/app/api/Auth"
import { Skeleton } from "@/components/ui/skeleton"

type User = {
  id: string
  email: string
  username: string | null
}

export default function UserProfile() {
  const api = useAuthApi()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/profile")
        setUser(res.data.user)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [api])

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold">User Profile</h1>
          <p>Email: {user!.email}</p>
          <p>Username: {user!.username ?? "No username"}</p>
        </>
      )}
    </div>
  )
}
