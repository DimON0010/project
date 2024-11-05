import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { User } from "src/user/entities/user.entity";

@Entity({ name: "user_balances" })
export class Balance {
  @PrimaryColumn()
  userId: string;

  @Column({ default: "0", type: "numeric" })
  balance: string;

  @OneToOne(() => User, (user) => user)
  @JoinColumn({ name: "user_id" })
  user: User;
}
