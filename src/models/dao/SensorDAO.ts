import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";
import { MeasurementDAO } from "./MeasurementDAO";

@Entity("sensor")
export class SensorDAO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  macAddress: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  variable: string;

  @Column({ nullable: true })
  unit: string;

  @ManyToOne(() => GatewayDAO, (gateway) => gateway.sensors, { nullable: false, onDelete: "CASCADE" })
  gateway: GatewayDAO;

  @OneToMany(() => MeasurementDAO, (measurement) => measurement.sensor, { cascade: true })
  measurement: MeasurementDAO[];
}
