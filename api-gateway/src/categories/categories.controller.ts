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
import { CreateCategoryDto } from './dto/create-category.dto';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('api/v1/category')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  // constructor() {
  //   this.clientAdminBackend = ClientProxyFactory.create({
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://dev:devpass@localhost:5672/smartranking'],
  //       queue: 'admin-backend',
  //     },
  //   });
  // }

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackEndInstance();

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
