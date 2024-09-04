import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Match } from './interfaces/match.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge } from 'src/challenge/interfaces/challenge.interface';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(MatchService.name);

  private clientChallenge =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  async createMatch(match: Match): Promise<Match> {
    try {
      const createdMatch = new this.matchModel(match);
      this.logger.log(`createdMatch: ${JSON.stringify(createdMatch)}`);

      const result = await createdMatch.save();
      this.logger.log(`result: ${JSON.stringify(result)}`);
      const matchId = result._id;

      const challenge: Challenge = await lastValueFrom(
        this.clientChallenge.send('consult-challenges', {
          idPlayer: '',
          _id: match.challenge,
        }),
      );

      return await lastValueFrom(
        this.clientChallenge.emit('update-challenge-match', {
          matchId: matchId,
          challenge: challenge,
        }),
      );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
