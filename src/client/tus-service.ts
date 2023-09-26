import { Injectable, Module } from '@nestjs/common';
import { Upload } from 'tus-js-client';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { NodeService, NodeInfo } from 'src/nodes/nodes.service';
import { ulid } from 'ulid';
import { FileStoreService } from 'src/filestore/filestore.service';
import { NodeFileService } from 'src/node-file/node-file.service';
import { FilestoreModule } from 'src/filestore/filestore.module';
import { NodeFileModule } from 'src/node-file/node-file.module';
import { exit } from 'process';

@Module({
  imports: [FilestoreModule, NodeFileModule],
})
@Injectable()
export class TusUploadService {
  constructor(
    private readonly nodesService: NodeService,
    private readonly fileStoreService: FileStoreService,
    private readonly nodeFileService: NodeFileService,
  ) {}

  async uploadFiles(): Promise<void> {
    await this.nodeFileService.probeNodeForFiles();

    NodeFileService.filesForNode.forEach((files, node) => {
      files.forEach(async (file) => {
        await this.uploadFileToNodes(node, file);
        console.log('Uploading file:', file, 'to node:', node);
      });
    });
  }

  private async uploadFileToNodes(
    node: string,
    filename: string,
  ): Promise<void> {
    const url: string = node;

    console.log('Uploading files:', filename, 'to node:', node);

    const filePath = path.join(process.cwd(), '../files', filename);
    console.log('Filename: ', filename);

    console.log('FilePathss: ', filePath);

    try {
      const response = await axios.post(url, null, {
        headers: {
          'Tus-Resumable': '1.0.0',
          'Upload-Length': fs.statSync(filePath).size.toString(),
          'Upload-Metadata': `${filename}`,
          'Content-Type': 'image/jpeg',
        },
      });

      const fileId = response.headers.location.split('/')[4];

      const fileStream = fs.createReadStream(filePath);
      const upload = new Upload(fileStream, {
        headers: {
          'Upload-Address': fileId,
        },
        endpoint: `${node}`, // Set the endpoint to "uploadedfiles"
        retryDelays: [0, 1000, 3000, 5000],
        onError: function (error) {
          console.log('Failed because: ' + error.stack);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(bytesUploaded, bytesTotal, percentage + '%');
        },
        onSuccess: function () {
          console.log('Upload completed');
        },
      });

      // Start the upload
      upload.start();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}
