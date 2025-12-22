import { IProfile, CreateProfileDto } from 'shared';

export interface IProfileServiceInterface {
  create(dto: CreateProfileDto): Promise<IProfile>;
  findOneByUserIdAndCompanyId(
    userId: string,
    companyId: string,
  ): Promise<IProfile | null>;
  findById(id: string): Promise<IProfile | null>;
}
