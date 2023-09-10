import { Injectable, Inject } from '@nestjs/common';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TusService {
  constructor(@Inject('TUS_SERVER') private server: Server) {
    // Define the directory where uploaded files will be stored
    const uploadDir = path.join(__dirname, '../../', 'uploadedfiles');

    // Ensure the directory exists, create it if necessary
    if (!fs.existsSync(uploadDir)) {
      console.log(`Creating directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Directory created: ${uploadDir}`);
    } else {
      console.log(`Directory already exists: ${uploadDir}`);
    }

    // Configure the Tus server with a file store for storing uploads
    this.server.datastore = new FileStore({
      directory: uploadDir,
    });
  }

  handleUpload(req, res) {
    this.server.handle(req, res);
  }
}
