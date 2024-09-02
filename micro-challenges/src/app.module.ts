import { Module } from '@nestjs/common';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { MatchService } from './match/match.service';
import { MatchModule } from './match/match.module';
import { ChallengeService } from './challenge/challenge.service';
import { ChallengeModule } from './challenge/challenge.module';
@Module({
  imports: [ProxyrmqModule, MatchModule, ChallengeModule],
  controllers: [],
  providers: [MatchService, ChallengeService],
})
export class AppModule {}
