import { Module } from '@nestjs/common';
import {PolkadotDigestController} from "./digestController";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PolkadotDigestController],
})
export class AppModule {}
