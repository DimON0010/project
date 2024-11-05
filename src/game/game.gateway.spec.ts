import { Test, TestingModule } from "@nestjs/testing";

import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

describe("GameGateway", () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: GameService, useClass: jest.fn() }, GameGateway],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
