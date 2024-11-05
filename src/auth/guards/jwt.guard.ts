import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WsAuthGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient();
  }

  // Override the base method to throw `WsException` instead of `Unauthorized`
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new WsException("Unauthorized");
    }

    return user;
  }
}
