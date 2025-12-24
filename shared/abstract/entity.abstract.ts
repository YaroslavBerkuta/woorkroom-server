import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';

export abstract class EntityAbstract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor() {
    this.id = v4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
