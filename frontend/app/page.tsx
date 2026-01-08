"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { Skeleton } from "@/components/ui/skeleton"
import { useAtom } from "jotai";
import { loadingAtom } from "./store/loadingAtom";
import UserProfile from "@/components/Profile/UserProfile";
import { User } from "lucide-react";

export default function Home() {

  const [isLoading, setIsLoading] = useAtom(loadingAtom);

  return (
    <div>
      <h1>Welcome home</h1>

      <div className="justify-center">
        <Skeleton className="h-[50px] w-[400px] rounded-full" />    
      </div>
      <UserProfile />
      </div>
  );
}
