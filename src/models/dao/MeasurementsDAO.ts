import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import type { Measurement } from "../dto/Measurement";
import type { Stats } from "../dto/Stats";

@Entity("measurement")
export class MeasurementDAO {
  @PrimaryGeneratedColumn("increment") // DA VERIFICARE
  id: number;

  @Column({ nullable: false })
  sensorMacAddress: string;

  @Column({ nullable: false })
  stats: Stats;

  @Column({ nullable: false })
  measurements: Array<Measurement>;
}
