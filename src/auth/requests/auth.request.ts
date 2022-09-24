import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
