/* External dependencies */
import { Server } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'

class SocketIO {
  _io: SocketServer | null

  constructor() {
    this._io = null
  }

  get io(): SocketServer {
    return this._io as SocketServer
  }

  init(server: Server) {
    this._io = new SocketServer(server, {
      cors: {
        origin: 'https://localhost:3000',
      }
    })
    this.connect()
  }

  connect() {
    this.io.on('connection', (socket: Socket) => {
      this.createRoom(socket)
      this.joinRoom(socket)
    })
  }

  createRoom(socket: Socket) {
    socket.on('createRoom', (room: string) => {
      const isRoomExist = socket.rooms.has(room)

      if (isRoomExist) {
        return this.io.to(socket.id).emit('error', `Room id "${room}" is already exists`)
      }

      socket.join(room)
      this.io.to(socket.id).emit('created', 'created')
    })
  }

  joinRoom(socket: Socket) {
    socket.on('joinRoom', (room: string) => {
      const isRoomExist = socket.rooms.has(room)

      if (!isRoomExist) {
        return this.io.to(socket.id).emit('error', `Room id "${room}" doesn't exist`)
      }
      socket.join(room)
      this.io.to(socket.id).emit('joined')
    })
  }
}

export default new SocketIO()
