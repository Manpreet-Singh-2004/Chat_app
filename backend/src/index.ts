import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import 'dotenv/config'
import handleWebhook from "./controllers/webhooks/clerkWebhook.js";
// import {clerkMiddleware} from "@clerk/express"



const app = express();
const PORT = 3000
const server = createServer(app);

// app.use(clerkMiddleware())


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

app.get("/", (req, res) =>{
  res.json({ok: true, message: `Welcome to the home page, Port: ${PORT}`})
})

app.post(
  "api/webhooks/clerk",
  express.raw({type: "application/json"}),
  handleWebhook
)

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
