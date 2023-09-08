import { Module } from '@nestjs/common';
import { TusUploadController } from './tus-controller';
import { TusUploadService } from './tus-service';
import { NodeService } from 'src/nodes/nodes.service';

@Module({
  imports: [],
  controllers: [TusUploadController],
  providers: [TusUploadService, NodeService],
  exports: [TusUploadService],
})
export class TusClientModule {}
