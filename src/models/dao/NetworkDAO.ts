import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import type { Gateway } from "../dto/Gateway";

@Entity("network")
export class NetworkDAO {
  @PrimaryGeneratedColumn("increment") // DA VERIFICARE
  id: number;
  
  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  gateways: Array<Gateway>;
}
