import { ValidationPipe } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

export const WsValidationPipe = new ValidationPipe({
  exceptionFactory: (errors) => {
    const formatted = errors.map(({ property, constraints }) => ({
      property,
      constraints: Object.values(constraints),
    }));

    return new WsException(formatted);
  },
});
