import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Game } from "./game.entity";

@Entity({ name: "bets" })
export class Bet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Game, (game) => game.id)
  @JoinColumn({ name: "game_id" })
  game: Game;

  @Column({ type: "numeric" })
  amount: string;

  @Column()
  isAuto: boolean;

  @Column({ type: "numeric" })
  multiplier: string | number;

  @Column({ type: "numeric" })
  payout: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  /* Virtual */

  @Column()
  userId: string;

  @Column()
  gameId: string;
}
