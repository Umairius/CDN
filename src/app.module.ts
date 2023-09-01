import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { UploadController } from './upload/upload.controller';
import { TusServerModule } from './server/tus-module';
import { TusClientModule } from './client/tus-module';

@Module({
  imports: [UploadModule, TusServerModule, TusClientModule],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
