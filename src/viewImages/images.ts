import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('images')
export class ImageController {
  @Get(':filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join('./files', filename); // Adjust the path as needed
    const imageStream = fs.createReadStream(filePath);

    // Set the appropriate Content-Type header
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type based on the image type

    imageStream.pipe(res);
  }
}
