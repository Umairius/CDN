import { Module } from '@nestjs/common';
import { NodeFileService } from './node-file.service';
import { FilestoreModule } from 'src/filestore/filestore.module';
import { NodesModule } from 'src/nodes/nodes.module';
import { NodeService } from 'src/nodes/nodes.service';
import { FileStoreService } from 'src/filestore/filestore.service';

@Module({
  imports: [FilestoreModule, NodesModule],
  exports: [NodeFileService],
  providers: [NodeService, FileStoreService, NodeFileService],
})
export class NodeFileModule {}
