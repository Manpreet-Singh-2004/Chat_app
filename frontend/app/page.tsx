"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function Home() {
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setSocketId(socket.id ?? null);
      console.log("Connected:", socket.id);
    };

    const onDisconnect = () => {
      setSocketId(null);
      console.log("Disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <h1>Chat App</h1>
      <h2>Socket ID: {socketId ?? "Not connected"}</h2>
      {/* <button onClick={}>Disconnect</button> */}
    </div>
  );
}
