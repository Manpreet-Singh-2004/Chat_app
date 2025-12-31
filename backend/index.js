import {Server} from 'socket.io'
import express from 'express'
import {createServer} from 'node:http'

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
})

io.on('connection', (socket) => {
  console.log("A new user is connected: ", socket.id)

  socket.on("message", msg => {
    io.emit("message", msg)
  });

  socket.on("disconnect", () =>{
    console.log("User disconnected: ", socket.id)
  })
})

app.get("/api/health", (req, res) =>{
  res.json({ok: true})
})

server.listen(3000, () => {
  console.log("Backend running on http://localhost:3000")
})