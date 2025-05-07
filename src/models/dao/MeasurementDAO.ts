import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("measurement")
export class MeasurementDAO {
  @PrimaryGeneratedColumn("increment") // DA VERIFICARE
  id: number;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  isOutlier: boolean;
}
