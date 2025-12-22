export class CreateUserDto {
  email: string;
  password: string;
  phoneNumber: string;
}

export class UpdateUserDto {
  id: string;
  email?: string;
  phoneNumber?: string;
}
