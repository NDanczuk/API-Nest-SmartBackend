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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { lastValueFrom, Observable } from 'rxjs';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ParamsValidationPipe } from 'src/common/pipes/params-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackEndInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createplayerDto: CreatePlayerDto) {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createplayerDto)}`);

    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        'consult-category',
        createplayerDto.category,
      ),
    );

    if (category) {
      await lastValueFrom(
        this.clientAdminBackend.emit('create-player', createplayerDto),
      );
    } else {
      throw new BadRequestException(`Category does not exist!`);
    }
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file, @Param('_id') _id: string) {
    this.logger.log(file);

    // Check if player exists in DB
    const player = await lastValueFrom(
      this.clientAdminBackend.send('consult-players', _id),
    );

    if (!player) {
      throw new BadRequestException(`Player not found!`);
    }

    // Send archive to S3 and get access URL
    const playerAvatarUrl = await this.awsService.fileUpload(file, _id);

    // Update player entity URL
    const updatePlayerDto: UpdatePlayerDto = {};
    updatePlayerDto.playerAvatarUrl = playerAvatarUrl.url;

    await this.clientAdminBackend.emit('update-player', {
      id: _id,
      player: updatePlayerDto,
    });

    // Return updated player
    return this.clientAdminBackend.send('consult-players', _id);
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
    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        'consult-category',
        updatePlayerDto.category,
      ),
    );

    if (category) {
      await lastValueFrom(
        this.clientAdminBackend.emit('update-player', {
          id: _id,
          player: updatePlayerDto,
        }),
      );
    } else {
      throw new BadRequestException(`Category does not exist!`);
    }
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', ParamsValidationPipe) _id: string) {
    await lastValueFrom(this.clientAdminBackend.emit('delete-player', { _id }));
  }
}
