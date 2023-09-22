import { Injectable } from '@nestjs/common';
// import chokidar from 'chokidar';
const chokidar = require('chokidar');
import EventEmitter from 'events';

@Injectable()
export class FileStoreService {
  private directoryPath: string = '../files';
  private filesToUpload: string[] = [];
  public readonly eventEmitter = new EventEmitter();

  constructor() {
    this.initializeFileWatcher();
  }

  private initializeFileWatcher() {
    console.log(chokidar);
    const watcher = chokidar.watch(this.directoryPath);

    watcher.on('add', (filePath) => {
      console.log(`New file detected: ${filePath}`);
      this.filesToUpload.push(filePath);

      this.eventEmitter.emit('add', filePath);
    });

    watcher.on('change', (filePath) => {
      console.log(`File modified: ${filePath}`);
    });

    watcher.on('unlink', (filePath) => {
      console.log(`File deleted: ${filePath}`);
    });
  }

  getFilesToUpload(): string[] {
    const cleanedUpFiles = this.filesToUpload.map((fname) => {
      return fname.replace(/^..\\files\\/, '');
    });

    console.log('cleanedUpFiles:', cleanedUpFiles);
    return cleanedUpFiles;
  }

  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }
}
