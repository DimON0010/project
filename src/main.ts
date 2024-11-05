import { NestFactory } from "@nestjs/core";
import { RedisIoAdapter } from "./middleware/redis.adapter";
import { SocketModule } from "./socket.module";

async function bootstrap() {
  const app = await NestFactory.create(SocketModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  const port = Number(process.env.SOCKET_PORT) || 3000;

  await app.listen(port);
}
bootstrap();
