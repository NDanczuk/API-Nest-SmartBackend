import { Module } from '@nestjs/common';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CategoriesModule, ProxyRMQModule],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
