import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Category } from './interfaces/categories/category.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern(`create-category`)
  async createCategory(@Payload() category: Category) {
    this.logger.log(`category: ${JSON.stringify(category)}`);

    await this.appService.createCategory(category);
  }

  @MessagePattern('consult-categories')
  async consultCategories(@Payload() _id: string) {
    if (_id) {
      return await this.appService.consultCategoryById(_id);
    } else {
      return await this.appService.consultCategories();
    }
  }
}
