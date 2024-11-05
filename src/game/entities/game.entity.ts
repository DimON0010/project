import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";

import { GameSettings } from "./game-settings.entity";

@Entity({ name: "games" })
export class Game {
  @PrimaryColumn("text")
  id: string;

  @Column()
  name: string;

  @OneToOne(() => GameSettings, (gs) => gs.game)
  settings: GameSettings;
}
