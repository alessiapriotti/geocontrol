import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("token")
export class TokenDAO { 
  @PrimaryGeneratedColumn("increment") // DA VERIFICARE
  id: number;

  @Column({ nullable: false })
  token: string;
}
