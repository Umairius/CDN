import { Module } from '@nestjs/common';
import { FileStoreService } from './filestore.service';
import { FileStoreController } from './filestore.controller';

@Module({
  controllers: [FileStoreController],
  providers: [FileStoreService],
  exports: [FileStoreService],
})
export class FilestoreModule {}
