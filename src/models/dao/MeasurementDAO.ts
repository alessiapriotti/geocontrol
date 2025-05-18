import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { SensorDAO } from "./SensorDAO";

@Entity("measurement")
export class MeasurementDAO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  value: number;

  @ManyToOne(() => SensorDAO, (sensor) => sensor.measurement, { nullable: false, onDelete: "CASCADE" })
  sensor: SensorDAO;
}
