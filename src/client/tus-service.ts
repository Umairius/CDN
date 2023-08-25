import { Injectable } from '@nestjs/common';
import { Upload } from 'tus-js-client';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class TusUploadService {
  async uploadFile(): Promise<void> {
    const filePath = path.join('D:\\Projects\\CDN\\cdn\\', 'leaf.CR2'); // Update the file path

    const tusServerURL = 'http://localhost:1080/files'; // Tus server URL

    // Step 1: Initiate upload session
    const response = await axios.post(tusServerURL, null, {
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Length': fs.statSync(filePath).size.toString(),
        'Upload-Metadata':
          'filename ' + Buffer.from('cat.jpg').toString('base64'),
      },
      maxRedirects: 0, // Prevent automatic redirection
    });

    const locationHeader = response.headers.location;
    const fileId = locationHeader.substring(
      locationHeader.lastIndexOf('/') + 1,
    );

    const endpointWithFileId = `${tusServerURL}/${fileId}`;

    console.log('File ID:', fileId);
    console.log('Endpoint with File ID:', endpointWithFileId);

    // Step 2: Upload chunks
    const fileStream = fs.createReadStream(filePath);

    const upload = new Upload(fileStream, {
      endpoint: endpointWithFileId,
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
  }
}
