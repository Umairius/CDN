import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TusServerModule } from './server/tus-module';
import { TusClientModule } from './client/tus-module';
import { NodesModule } from './nodes/nodes.module';

@Module({
  imports: [TusServerModule, TusClientModule, NodesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
