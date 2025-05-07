import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("sensor")
export class SensorDAO {
  @PrimaryGeneratedColumn("increment") // DA VERIFICARE
  id: number;

  @Column({ nullable: false })
  macAddress: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  variable: string;

  @Column({ nullable: false })
  unit: string;
}
