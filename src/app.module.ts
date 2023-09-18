import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TusServerModule } from './server/tus-module';
import { TusClientModule } from './client/tus-module';
import { NodesModule } from './nodes/nodes.module';
import { FilestoreModule } from 'src/filestore/filestore.module';
import { UploadTriggerModule } from './upload-trigger/upload-trigger.module';
// import { UploadTriggerService } from './upload-trigger/upload-trigger.service';

@Module({
  imports: [
    TusServerModule,
    TusClientModule,
    NodesModule,
    FilestoreModule,
    UploadTriggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
