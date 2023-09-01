import { Injectable } from '@nestjs/common';
import { Upload } from 'tus-js-client';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

import * as uuid from 'uuid';

@Injectable()
export class TusUploadService {
  static filesToUpload: string[] = fs.readdirSync('D:\\Projects\\CDN\\files\\');
  static nodes: string[] = ['http://localhost:1080/files'];

  async uploadFiles(): Promise<void> {
    const fileNames = TusUploadService.filesToUpload;
    const uploadPromises = [];

    for (const fileName of fileNames) {
      const filePath = path.join('D:\\Projects\\CDN\\files\\', fileName);
      const fileId = uuid.v4(); // Generate a unique fileId for each file

      const uploadPromise = this.uploadFileToNodes(
        filePath,
        TusUploadService.nodes,
        fileId,
      );
      uploadPromises.push(uploadPromise);
    }
    console.log(uploadPromises);
    await Promise.all(uploadPromises);
    console.log(uploadPromises);
  }

  private async uploadFileToNodes(
    filePath: string,
    nodes: string[],
    fileId: string,
  ): Promise<void> {
    const uploadPromises = nodes.map(async (node) => {
      try {
        const response = await axios.post(node, null, {
          headers: {
            'Tus-Resumable': '1.0.0',
            'Upload-Length': fs.statSync(filePath).size.toString(),
            'Upload-Metadata': `filename ${Buffer.from('cat.jpg').toString(
              'base64',
            )}`,
          },
        });
        console.log(response)

        const fileStream = fs.createReadStream(filePath);
        console.log(node + '/' + fileId);
        const upload = new Upload(fileStream, {
          endpoint: `${node}/${fileId}`,
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
