import { Injectable, Inject } from '@nestjs/common';
import { Server } from '@tus/server';

@Injectable()
export class TusService {
  constructor(@Inject('TUS_SERVER') private server: Server) {}

  handleUpload(req, res) {
    console.log('handleUpload');
    this.server.handle(req, res);
  }
}
