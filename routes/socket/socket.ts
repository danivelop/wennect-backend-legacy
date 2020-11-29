/* External dependencies */
import { Server } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'

/* Internal dependencies */
import SocketEvent from 'constants/SocketEvent'

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
        origin: '*',
      }
    })
    this.connect()
  }

  connect() {
    this.io.on('connection', (socket: Socket) => {
      this.enterGround(socket)
      this.leaveGround(socket)
      this.iceCandidate(socket)
    })
  }

  enterGround(socket: Socket) {
    socket.on(SocketEvent.EnterGround, (roomId: string) => {
      socket.join(roomId)
      socket.to(roomId).emit(SocketEvent.Join, socket.id)
    })
  }

  leaveGround(socket: Socket) {
    socket.on(SocketEvent.LeaveGround, (roomId: string) => {
      socket.leave(roomId)
    })
  }

  iceCandidate(socket: Socket) {
    socket.on(SocketEvent.IceCandidate, ({ remoteId, ...payload }) => {
      this.io.to(remoteId).emit(SocketEvent.IceCandidate, {
        remoteId: socket.id,
        ...payload
      })
    })
  }
}

export default new SocketIO()
