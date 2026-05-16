import { EntityAbstract, ICompany } from 'shared';
import { Column, Entity } from 'typeorm';

@Entity()
export class Companys extends EntityAbstract implements ICompany {
  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true, length: 255 })
  service?: string;

  @Column({ nullable: true, length: 255 })
  describes?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true, length: 255 })
  direction?: string;

  @Column({ default: 1 })
  peopleCountStart: number;

  @Column({ default: 1 })
  peopleCountEnd: number;
}
