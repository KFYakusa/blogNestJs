import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { env } from 'process'
import { ConfigService } from '@nestjs/config/dist'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    })
  }
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ])
  }
}
