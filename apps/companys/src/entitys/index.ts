export * from './company.entity';
export * from './employee.entity';

import { Companys } from './company.entity';
import { Employee } from './employee.entity';

export const entities = [Companys, Employee];
