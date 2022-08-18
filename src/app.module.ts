import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PolkadotDigestController} from "./digest.controller";
import {FeedsDigestService} from "./feeds.digest.service";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PolkadotDigestController],
  providers: [AppService, FeedsDigestService],
})
export class AppModule {}
