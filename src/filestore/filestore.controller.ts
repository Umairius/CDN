import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { FileStoreService } from './filestore.service';

@Controller('filestore')
export class FileStoreController {
  constructor(private readonly filestoreService: FileStoreService) {}

  @Post()
  FileList(@Body('files') filesToCompare: string[]) {


    const files = this.filestoreService.getFilesToUpload()
    console.log("files to compare: ",filesToCompare);
    console.log("files of this node: ",files);
    
    const filesToUpload = filesToCompare.filter((file) => !files.includes(file));
    console.log("files to upload: ",filesToUpload);
    return filesToUpload;
    
  }
}
