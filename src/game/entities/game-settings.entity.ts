import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { Game } from "./game.entity";

@Entity({ name: "game_settings" })
export class GameSettings {
  @PrimaryColumn("text")
  gameId: string;

  @Column({ type: "numeric" })
  min: string;

  @Column({ type: "numeric" })
  max: string;

  @OneToOne(() => Game, (g) => g.id)
  @JoinColumn({ name: "game_id" })
  game: Game;
}
