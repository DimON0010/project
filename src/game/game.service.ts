import Big from "big.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

import { KenoBetDto } from "./dto/game.dto";
import { GameSettings } from "./entities/game-settings.entity";
import { Balance } from "../balance/entities/balance.entity";
import { GameKey } from "./game.types";
import { Keno } from "./strategy/keno";
import { Bet } from "./entities/bet.entity";
import { GameOutcome } from "./strategy/types";

@Injectable()
export class GameService {
  constructor(@InjectDataSource() private connection: DataSource) {}

  /* Keno */
  async kenoBet(userId: string, { prediction, wager, auto, risk }: KenoBetDto) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const db = queryRunner.manager;

      const gameSettings = await db
        .createQueryBuilder(GameSettings, "gs")
        .select(["gs.max", "gs.min"])
        .where({ gameId: GameKey.keno })
        .cache(300_000)
        .getOne();

      // Run max/min validations
      if (Big(wager).gt(gameSettings.max)) {
        throw new WsException("Wager is greater than the maximum bet value");
      } else if (Big(wager).lt(gameSettings.min)) {
        throw new WsException("Wager is less than the minimum bet value");
      }

      // Find and apply FOR UPDATE lock on the wallet
      const balance = await db
        .createQueryBuilder(Balance, "ub")
        .select("ub.balance")
        .where({ userId })
        .setLock("pessimistic_write")
        .getOne();

      if (Big(wager).gt(balance.balance)) {
        throw new WsException("TOO LOW BALANCE");
      }

      // Should be moved to fairness state(store in Redis)
      const outcome = Keno.generateUniqueSequence();

      const { multiplier, result } = Keno.getResult(outcome, prediction, risk);

      // Calculate payout based on bet result
      const payout =
        result === GameOutcome.WIN
          ? Big(wager).times(multiplier).toFixed()
          : "0";

      const diff = Big(0).minus(wager).plus(payout).toFixed();

      await db
        .createQueryBuilder()
        .update(Balance)
        .where({ userId })
        .set({
          balance: () => "balance + :diff",
        })
        .setParameter('diff', diff)
        .execute();

      const bet = await db.insert(Bet, {
        userId,
        gameId: GameKey.keno,
        amount: wager,
        isAuto: auto,
        multiplier,
        payout,
      });

      await queryRunner.commitTransaction();

      const betId = bet.raw[0].id;

      return { id: betId, sequence: outcome, payout, multiplier };
    } catch (err) {
      if (!(err instanceof WsException)) {
        console.error("[KENO] Service Error", err);
      }

      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
