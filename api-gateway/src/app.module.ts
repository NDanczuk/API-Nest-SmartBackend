import { Module } from '@nestjs/common';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [PlayersModule, CategoriesModule, ProxyRMQModule, AwsModule],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
