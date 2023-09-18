import { Injectable } from '@nestjs/common';
import { FileStoreService } from 'src/filestore/filestore.service';
import EventEmitter from 'events';
import axios from 'axios';

@Injectable()
export class UploadTriggerService {
    constructor(private readonly fileStoreService: FileStoreService) {
        this.listenForAddEvent();
      }
      private eventEmitter = this.fileStoreService.eventEmitter;


      private listenForAddEvent() {
        this.eventEmitter.on('add', async (filePath) => {
          console.log("listening for file addition")
          console.log(`New file added: ${filePath}`);

          await axios.post('http://localhost:3000')
          // You can put your logic to process the added file here.
        });
      }

}
