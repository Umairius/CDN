import { Controller, Post } from '@nestjs/common';
import { TusUploadService } from './tus-service';

@Controller('init')
export class TusUploadController {
  constructor(private readonly uploadService: TusUploadService) {}

  @Post()
  async uploadFile(): Promise<void> {
    await this.uploadService.uploadFiles();
  }
}
