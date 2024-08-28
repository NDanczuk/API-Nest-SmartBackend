import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';

@Controller('api/v1/category')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  private clientAdminBackend: ClientProxy;

  // constructor() {
  //   this.clientAdminBackend = ClientProxyFactory.create({
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://dev:devpass@localhost:5672/smartranking'],
  //       queue: 'admin-backend',
  //     },
  //   });
  // }

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get()
  consultCategories(@Query('categoryId') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consult-categories', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      category: updateCategoryDto,
    });
  }
}
