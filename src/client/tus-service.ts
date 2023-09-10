import { Injectable } from '@nestjs/common';
import { Upload } from 'tus-js-client';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { NodeService, NodeInfo } from 'src/nodes/nodes.service';
import * as uuid from 'uuid';

@Injectable()
export class TusUploadService {
  static filesToUpload: string[] = fs.readdirSync('../files');

  constructor(private readonly nodesService: NodeService) {}

  async uploadFiles(): Promise<void> {
    const nodes = this.nodesService.listNodes();
    const fileNames = TusUploadService.filesToUpload;
    const uploadPromises = [];

    for (const fileName of fileNames) {
      const filePath = path.join(process.cwd(), '../files', fileName);
      const fileId = uuid.v4();

      const uploadPromise = this.uploadFileToNodes(filePath, nodes, fileId);
      uploadPromises.push(uploadPromise);
    }

    await Promise.all(uploadPromises);
  }

  private async uploadFileToNodes(
    filePath: string,
    nodes: NodeInfo[],
    fileId: string,
  ): Promise<void> {
    const urls: string[] = nodes.map(
      (node) => `http://${node.ip}:${node.port}/uploadedfiles`, // Specify the "uploadedfiles" endpoint
    );

    const uploadPromises = urls.map(async (node) => {
      try {
        await axios.post(node, null, {
          headers: {
            'Tus-Resumable': '1.0.0',
            'Upload-Length': fs.statSync(filePath).size.toString(),
            'Upload-Metadata': `filename ${Buffer.from(filePath).toString(
              'base64',
            )}`,
          },
        });

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
