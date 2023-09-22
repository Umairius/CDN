import { Module } from '@nestjs/common';
import { TusUploadController } from './tus-controller';
import { TusUploadService } from './tus-service';
import { NodeService } from 'src/nodes/nodes.service';
import { FileStoreService } from 'src/filestore/filestore.service';
import { NodeFileService } from 'src/node-file/node-file.service';

@Module({
  imports: [],
  controllers: [TusUploadController],
  providers: [TusUploadService, NodeService, FileStoreService, NodeFileService],
  exports: [TusUploadService],
})
export class TusClientModule {}
