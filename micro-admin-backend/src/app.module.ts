import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersController } from './players/players.controller';
import { PlayersService } from './players/players.service';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    CategoriesModule,
    PlayersModule,
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class AppModule {}
