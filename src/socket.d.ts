import { RemoteSocket as Socket } from "socket.io";

declare global {
  interface RemoteSocket extends Socket<EmitEvents, any> {
    user: { id: string };
  }
}
