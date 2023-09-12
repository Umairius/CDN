import { Injectable } from '@nestjs/common';
// import chokidar from 'chokidar';
const chokidar = require('chokidar');

@Injectable()
export class FileStoreService {
  private directoryPath: string = '../files';
  private filesToUpload: string[] = [];

  constructor() {
    this.initializeFileWatcher();
  }

  private initializeFileWatcher() {
    console.log(chokidar);
    const watcher = chokidar.watch(this.directoryPath);

    watcher.on('add', (filePath) => {
      console.log(`New file detected: ${filePath}`);
      this.filesToUpload.push(filePath);
    });

    watcher.on('change', (filePath) => {
      console.log(`File modified: ${filePath}`);
    });

    watcher.on('unlink', (filePath) => {
      console.log(`File deleted: ${filePath}`);
    });
  }

  getFilesToUpload(): string[] {
    return this.filesToUpload;
  }
}
