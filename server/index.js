import { createServer } from "http"
import { Server } from "socket.io"


const httpServer = createServer() //cria um server http


// instancia o websocket no server http
const io = new Server(httpServer, {
  cors: {
    /* esse origin, define que apenas quem acessa pelo liveserver vai ter acesso. para acesso sem restrição de qualquer origin use: origin: "*" */
    origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]

  }
})


/* aqui é onde trata a conexão de um novo user, e toda mesagem dele é emitida a todos no "socket" */

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`)

  socket.on('message', data => {
  io.emit('message', {
    id: socket.id, // id do usuario
    text: data // sua mensagem
  });
});
})

httpServer.listen(3500, () => console.log('escutando na porta 3500...'))