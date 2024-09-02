import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './challenge-status.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  private readonly logger = new Logger(ChallengeService.name);

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    try {
      const createdChallenge = new this.challengeModel(challenge);
      createdChallenge.dateTimeSolicitation = new Date();
      createdChallenge.status = ChallengeStatus.PENDING;
      this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);
      return await createdChallenge.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultAllChallenges(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultOnePlayersChallenges(
    _id: any,
  ): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel.find().where('players').in(_id).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultChallengeById(_id: any): Promise<Challenge> {
    try {
      return await this.challengeModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallenge(_id: string, challenge: Challenge): Promise<void> {
    try {
      challenge.dateTimeAnswer = new Date();
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallengeMatch(
    matchId: string,
    challenge: Challenge,
  ): Promise<void> {
    try {
      challenge.status = ChallengeStatus.DONE;
      challenge.match = matchId;
      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge;
      challenge.status = ChallengeStatus.CANCELED;
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`);
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
