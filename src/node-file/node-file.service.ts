import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { exit } from 'process';
import { FileStoreService } from 'src/filestore/filestore.service';
import { NodeService } from 'src/nodes/nodes.service';

@Injectable()
export class NodeFileService {
  constructor(
    private readonly fileStoreService: FileStoreService,
    private readonly nodeService: NodeService,
  ) {

  }

  async probeNodeForFiles(ip: string) {
    const files = this.fileStoreService.getFilesToUpload();
    console.log('files:', files);

    try {
      const res = await axios.post(ip + '/filestore', {
        files: files,
      });

      console.log('Result:', res.data);
    } catch (error) {
      // Handle the error here
      console.error('Error while probing node for files:', error.message);
    }
  }
}
