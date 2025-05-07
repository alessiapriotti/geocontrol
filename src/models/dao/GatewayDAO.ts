import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { SensorDAO } from "./SensorDAO";
import { NetworkDAO } from "./NetworkDAO";

@Entity("gateway")
export class GatewayDAO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  macAddress: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => SensorDAO, (sensor) => sensor.gateway, { cascade: true })
  sensors: SensorDAO[];

  @ManyToOne(() => NetworkDAO, (network) => network.gateways, { nullable: false, onDelete: "CASCADE" })
  network: NetworkDAO;
}
