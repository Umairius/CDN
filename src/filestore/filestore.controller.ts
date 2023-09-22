
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { FileStoreService } from './filestore.service';

@Controller('filestore')
export class FileStoreController {
  constructor(private readonly filestoreService: FileStoreService) {}

  @Post()
  FileList() {
    
    return this.filestoreService.getFilesToUpload();
    

  }
}
