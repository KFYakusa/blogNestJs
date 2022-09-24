import { ConfigService } from '@nestjs/config/dist'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthRequest } from './requests'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(req: AuthRequest) {
    try {
      //generate password hash
      const hash = await argon.hash(req.password)
      // save user in db
      const user = await this.prisma.user.create({
        data: {
          email: req.email,
          hash,
        },
      })
      // return sved user
      return this.signToken(user.id, user.email)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credenntials Taken')
        }
      }
      throw error
    }
  }

  async signin(req: AuthRequest) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: req.email,
      },
    })
    if (!user) throw new ForbiddenException('Credentials Incorrect')

    const passwordMatches = await argon.verify(user.hash, req.password)

    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect')

    return this.signToken(user.id, user.email)
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    }

    const secret = this.config.get('JWT_SECRET')
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    })
    return {
      access_token: token,
    }
  }
  logout() {}
}
