import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";

@Entity("network")
export class NetworkDAO {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => GatewayDAO, (gateway) => gateway.network, { eager: true, cascade: true })
  gateways: GatewayDAO[];
}
