import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dto/category/create-category.dto';
import { Observable } from 'rxjs';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://dev:devpass@localhost:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('category')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get('category')
  consultCategories(@Query('categoryId') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consult-categories', _id ? _id : '');
  }
}
