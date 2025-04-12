import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

@InputType()
export class RegisterDto {
  @Field(() => String, { nullable: false })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @Field(() => String, { nullable: false })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password: string;

  @Field(() => String, { nullable: false })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phoneNumber: string;

  @Field(() => String, { nullable: false })
  @MinLength(4, {
    message: 'Verification code must be at least 4 characters long',
  })
  @MaxLength(4, {
    message: 'Verification code must be at most 4 characters long',
  })
  verificationCode: string;
}

@InputType()
export class SendVerificationCode {
  @Field(() => String, { nullable: false })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phoneNumber: string;
}
