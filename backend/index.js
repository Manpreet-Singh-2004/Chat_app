import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

/**
 * DO NOT overthink CORS for WebSockets in dev.
 * Let Socket.IO handle it.
 */
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("📨 Message:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ User disconnected:", socket.id, reason);
  });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "WebSocket backend alive" });
});

server.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
