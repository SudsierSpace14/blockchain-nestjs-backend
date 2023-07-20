import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BlockchainModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
