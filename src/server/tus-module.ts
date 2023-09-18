import { Module, Global } from '@nestjs/common';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { TusServerController } from './tus-controller';
import { TusService } from './tus-service';
import { exit } from 'process';
import { v4 as uuid } from 'uuid';

@Global()
@Module({
  providers: [
    {
      provide: 'TUS_SERVER',
      useFactory: () => {
        const server = new Server({
          path: '/uploadedfiles',
          datastore: new FileStore({ directory: '../uploadedfiles' }),


          namingFunction(req) {
            const metadataHeader = req.headers['upload-metadata'];
            const filenameHeader = req.headers['upload-address'];

            if (filenameHeader) {    
              return filenameHeader.toString();

            }

            const extractedFilename = Buffer.from(metadataHeader.toString()).toString('utf-8')
            // console.log('Extracted filename', extractedFilename)
            
            return extractedFilename
          },
        });
        return server;
      },
    },
    TusService,
  ],
  controllers: [TusServerController],

  exports: ['TUS_SERVER', TusService],
})
export class TusServerModule {}
