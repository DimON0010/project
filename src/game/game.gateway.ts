import { UseGuards, UsePipes } from "@nestjs/common";
import { Server } from "socket.io";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { WsAuthGuard } from "../auth/guards/jwt.guard";
import { KenoBetDto } from "./dto/game.dto";
import { WsValidationPipe } from "../middleware/validation.pipe";
import { GameService } from "./game.service";

@UseGuards(WsAuthGuard)
@UsePipes(WsValidationPipe)
@WebSocketGateway({ cors: true, transports: ["websocket"] })
export class GameGateway {
  @WebSocketServer()
  io: Server;

  constructor(private gameService: GameService) {}

  @SubscribeMessage("games:join")
  join(socket: RemoteSocket) {
    const roomName = `lobby:${socket.user.id}`;

    this.io.in(roomName).emit("shutdown");
    this.io.in(roomName).disconnectSockets(true);
    this.io.in(socket.id).socketsJoin(roomName);

    return true;
  }

  @SubscribeMessage("games:leave")
  leave(socket: RemoteSocket) {
    const roomName = `lobby:${socket.user.id}`;
    this.io.in(socket.id).socketsLeave(roomName);

    return true;
  }

  @SubscribeMessage("games:keno:bet")
  kenoBet(socket: RemoteSocket, data: KenoBetDto) {
    const roomName = `lobby:${socket.user.id}`;

    if (!socket.rooms.has(roomName)) {
      socket.disconnect(true);
      return;
    }

    return this.gameService.kenoBet(socket.user.id, data);
  }
}
