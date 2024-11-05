import { resolve } from "path";
import { readFileSync } from "fs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { GameModule } from "./game/game.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      logging: Boolean(process.env.DB_LOGGING) || ["error", "warn"],
      maxQueryExecutionTime: 5000,
      applicationName: "socket",
      namingStrategy: new SnakeNamingStrategy(),
      ssl: process.env.DB_SSL_CA && {
        ca: readFileSync(resolve(__dirname, process.env.DB_SSL_CA), "utf-8"),
      },
      cache: process.env.REDIS_CACHE_URL && {
        type: "ioredis",
        options: process.env.REDIS_CACHE_URL,
      },
    }),
    AuthModule,
    GameModule,
  ],
})
export class SocketModule {}
