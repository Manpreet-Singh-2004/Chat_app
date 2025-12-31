import {Server} from 'socket.io'
import express from 'express'
import {createServer} from 'node:http'

const app = express();
const server = createServer(app);
const io = new Server(server)

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log(`A user is connected: ${socket}`)
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});