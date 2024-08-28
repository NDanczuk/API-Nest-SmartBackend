import { Controller, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  logger = new Logger(CategoriesController.name);

  @EventPattern(`create-category`)
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`category: ${JSON.stringify(category)}`);

    try {
      await this.categoriesService.createCategory(category);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      // ackErrors.map(async (ackError) => {
      //   if (error.message.includes(ackError)) {
      //     await channel.ack(originalMsg);
      //   }
      // });

      const filterAckError = ackErrors.filter((ackErrors) =>
        error.message.includes(ackErrors),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consult-categories')
  async consultCategory(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.categoriesService.consultCategoryById(_id);
      } else {
        return await this.categoriesService.consultCategories();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data)}`);
    try {
      const _id: string = data.id;
      const category: Category = data.category;
      await this.categoriesService.updateCategory(_id, category);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }
}
