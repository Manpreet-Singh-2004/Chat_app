import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import 'dotenv/config'
import {clerkMiddleware} from "@clerk/express"
import router from "./routes/routes.js";
import cors from "cors";
import handleWebhook from "./controllers/webhooks/clerkWebhook.js";
import { socketAuth } from "./middleware/socketAuth.js";


const app = express();
const httpServer = createServer(app)

const PORT = 3000

const io = new Server(httpServer, {
  cors:{
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }
})

io.use(socketAuth)

app.set("io", io)

app.use(
  cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
)

app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(clerkMiddleware())

app.use(express.json())

app.use("/api",router)

app.get("/", (req, res) =>{
  res.json({ok: true, message: `Welcome to the home page, Port: ${PORT}`})
})


io.on("connection", (socket) => {
  const userId = (socket as any).userId;
  console.log("User connected to socket: ", userId)

  socket.on("join_chat", (chatId: string) => {
    if(!chatId) return;
    socket.join(chatId);
    console.log('User ', userId, ' Joined the room: ', chatId)
  })

  socket.on("disconnect", () => {
    console.log('User disconnected: ', userId)
  })
})


httpServer.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
