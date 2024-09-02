import { Controller, Logger } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000'];

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @EventPattern('create-challenge')
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`);
      await this.challengeService.createChallenge(challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consult-challenges')
  async consultChallenges(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ): Promise<
}
