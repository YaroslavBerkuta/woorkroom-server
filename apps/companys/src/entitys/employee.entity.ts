import { EntityAbstract, IEmployee } from 'shared';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Companys } from './company.entity';

@Entity()
export class Employee extends EntityAbstract implements IEmployee {
  @Column('uuid')
  companyId: string;

  @Column('uuid')
  profileId: string;

  @ManyToOne(() => Companys, (company) => company.employees, {
    onDelete: 'CASCADE',
  })
  company: Companys;
}
