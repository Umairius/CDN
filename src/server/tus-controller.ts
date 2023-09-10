import { Controller, Post, Req, Res } from '@nestjs/common';
import { TusService } from './tus-service';

@Controller('uploadedfiles')
export class TusServerController {
  constructor(private tusService: TusService) {}

  @Post()
  uploadFile(@Req() req, @Res() res) {
    console.log('uploadedfiles endpoint called');
    this.tusService.handleUpload(req, res);
  }
}
