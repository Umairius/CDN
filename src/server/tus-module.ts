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


            //let us overthink how the files will be synchronized over nodes
            // right now it is just sending all of the files
            // there should be a probe request first which should send its available files as a list
            // and recieve the nodes files as a list
            // Only the difference will be sent to each node
            // This is the hardest part of the hardest project I have ever done
            // Deadline, 2 days
            // Spirits: high
            // Sanity: low
            // Sleep: none

            const extractedFilename = Buffer.from(metadataHeader.toString()).toString('utf-8')
            
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
