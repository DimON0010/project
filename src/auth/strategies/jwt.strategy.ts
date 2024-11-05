import { Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { passportJwtSecret } from "jwks-rsa";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (socket) =>
        socket.handshake.auth.token || socket.handshake.headers.authorization,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
      }),
      issuer: process.env.AUTH_ISSUER,
      algorithms: ["RS256"],
    });
  }

  validate(payload: unknown, done: VerifiedCallback) {
    return done(null, payload);
  }
}
