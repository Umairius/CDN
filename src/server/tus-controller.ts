import { Controller, Post, Req, Res } from '@nestjs/common';
import { TusService } from './tus-service';

@Controller('files')
export class TusServerController {
  constructor(private tusService: TusService) {}

  @Post()
  uploadFile(@Req() req, @Res() res) {
    this.tusService.handleUpload(req, res);
  }
}
