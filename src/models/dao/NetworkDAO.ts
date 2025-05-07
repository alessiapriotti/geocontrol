import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";

@Entity("network")
export class NetworkDAO {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => GatewayDAO, (gateway) => gateway.network, { cascade: true })
  gateways: GatewayDAO[];
}
