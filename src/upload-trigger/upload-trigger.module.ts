import { Module } from '@nestjs/common';
import { UploadTriggerService } from './upload-trigger.service';
import { FileStoreService } from 'src/filestore/filestore.service';

@Module({
  providers: [UploadTriggerService, FileStoreService],
  exports: [UploadTriggerService],
})
export class UploadTriggerModule {}
