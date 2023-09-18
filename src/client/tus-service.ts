import { Injectable, Module } from '@nestjs/common';
import { Upload } from 'tus-js-client';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { NodeService, NodeInfo } from 'src/nodes/nodes.service';
import { ulid } from 'ulid';
import { FileStoreService } from 'src/filestore/filestore.service';
import { FilestoreModule } from 'src/filestore/filestore.module';
import { exit } from 'process';

@Module({
  imports: [FilestoreModule],
})
@Injectable()
export class TusUploadService {
  constructor(
    private readonly nodesService: NodeService,
    private readonly fileStoreService: FileStoreService,
  ) {}

  async uploadFiles(): Promise<void> {
  
    //a queue should be implemented over here.

    const filesToUpload = this.fileStoreService.getFilesToUpload();

    const nodes = this.nodesService.listNodes();

    const fileNames = filesToUpload;
    const uploadPromises = [];

    for (const fileName of fileNames) {
      const filePath = path.join(process.cwd(), '../files', fileName);
      const fileId = ulid();
      
      console.log(`Uploading file ${filePath} ${fileId} to nodes:`, nodes);
      const uploadPromise = this.uploadFileToNodes(filePath, nodes,fileName);
      uploadPromises.push(uploadPromise);
    }

    await Promise.all(uploadPromises);
  }

  private async uploadFileToNodes(
    filePath: string,
    nodes: NodeInfo[],
    filename: string,
  ): Promise<void> {
    const urls: string[] = nodes.map(
      (node) => `http://${node.ip}:${node.port}/uploadedfiles`, // Specify the "uploadedfiles" endpoint
    );

    const uploadPromises = urls.map(async (node) => {
      try {
        const response = await axios.post(node, null, {
          headers: {
            'Tus-Resumable': '1.0.0',
            'Upload-Length':   fs.statSync(filePath).size.toString(),
            'Upload-Metadata': `${Buffer.from(filename.split('\\')[2])}`,
            'Content-Type': 'image/jpeg'
            
  
          },
        });

        const fileId = response.headers.location.split('/')[4]
        // exit(0);
        // We can also map each of the filenames to the uuid that is being generated

        const fileStream = fs.createReadStream(filePath);
        const upload = new Upload(fileStream, {
          endpoint: `${node}/${fileId}`, // Set the endpoint to "uploadedfiles"
          retryDelays: [0, 1000, 3000, 5000],
          onError: function (error) {
            console.log('Failed because: ' + error);
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
    });

    await Promise.all(uploadPromises);
  }
}
