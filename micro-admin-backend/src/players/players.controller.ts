import { Controller, Logger } from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class PlayersController {
  logger = new Logger(PlayersController.name);
  constructor(private readonly playersService: PlayersService) {}

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`player: ${JSON.stringify(player)}`);
      await this.playersService.createPlayer(player);
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

  @MessagePattern('consult-players')
  async consultPlayers(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.playersService.consultPlayerById(_id);
      } else {
        return await this.playersService.consultAllPlayers();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-player')
  async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      console.log(`data: ${JSON.stringify(data)}`);
      const _id: string = data.id;
      const player: Player = data.player;
      await this.playersService.updatePlayer(_id, player);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('delete-player')
  async deletePlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.playersService.deletePlayer(_id);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
