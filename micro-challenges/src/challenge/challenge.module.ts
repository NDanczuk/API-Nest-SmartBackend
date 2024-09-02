import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
  ],
  providers: [ChallengeService],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
