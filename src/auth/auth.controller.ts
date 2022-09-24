import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthRequest } from './requests'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() req: AuthRequest) {
    return this.authService.signup(req)
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() req: AuthRequest) {
    return this.authService.signin(req)
  }
}
