import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './interfaces/player.schema';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
  ],
  providers: [PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
