import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { Bet } from "./entities/bet.entity";
import { User } from "../user/entities/user.entity";
import { Game } from "./entities/game.entity";
import { GameSettings } from "./entities/game-settings.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Bet, User, Game, GameSettings])],
  providers: [GameService, GameGateway],
})
export class GameModule {}
