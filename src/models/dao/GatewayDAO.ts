import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import type { Sensor } from "../dto/Sensor";

@Entity("gateway")
export class GatewayDAO {
  @PrimaryGeneratedColumn("increment") // DA VERIFICARE
  id: number;

  @Column({ nullable: false })
  macAddress: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  sensors: Array<Sensor>;
}
