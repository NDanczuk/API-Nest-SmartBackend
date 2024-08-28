import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Observable } from 'rxjs';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ParamsValidationPipe } from 'src/common/pipes/params-validation.pipe';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackEndInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createplayerDto: CreatePlayerDto) {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createplayerDto)}`);

    const category = await this.clientAdminBackend
      .send('consult-category', createplayerDto.category)
      .toPromise();

    if (category) {
      await this.clientAdminBackend.emit('create-player', createplayerDto);
    } else {
      throw new BadRequestException(`Category does not exist!`);
    }
  }

  @Get()
  consultPlayers(@Query('playerId') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consult-players', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ParamsValidationPipe) _id: string,
  ) {
    const category = await this.clientAdminBackend
      .send('consult-category', updatePlayerDto.category)
      .toPromise();

    if (category) {
      await this.clientAdminBackend.emit('update-player', {
        id: _id,
        player: updatePlayerDto,
      });
    } else {
      throw new BadRequestException(`Category does not exist!`);
    }
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', ParamsValidationPipe) _id: string) {
    await this.clientAdminBackend.emit('delete-player', { _id });
  }
}
