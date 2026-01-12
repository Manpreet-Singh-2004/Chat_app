"use client";

import { useAtom } from "jotai";
import { loadingAtom } from "./store/loadingAtom";
import UserProfile from "@/components/Profile/UserProfile";
import ChatMain from "@/components/SideBarChat/ChatMain";

export default function Home() {

  const [isLoading, setIsLoading] = useAtom(loadingAtom);

  return (
    <div>
      <h1>Welcome home</h1>

      <UserProfile />
      <div className="flex items-center justify-center h-screen">
        <ChatMain />
      </div>
      </div>
  );
}
