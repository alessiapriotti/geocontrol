import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("stats")
export class StatsDAO {
  @PrimaryGeneratedColumn("increment") // DA VERIFICARE
  id: number;
  
  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: false })
  endDate: Date;

  @Column({ nullable: false })
  mean: number;

  @Column({ nullable: false })
  variance: number;

  @Column({ nullable: false })
  upperThreshold: number;

  @Column({ nullable: false })
  lowerThreshold: number;
}
