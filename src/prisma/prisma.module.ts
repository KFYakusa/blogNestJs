import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ConfigModule } from '@nestjs/config/dist/config.module'
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
