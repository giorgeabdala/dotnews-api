import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import {PolkadotDigestController} from "./digest.controller";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PolkadotDigestController],
  providers: [AppService],
})
export class AppModule {}
