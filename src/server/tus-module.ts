import { Module, Global } from '@nestjs/common';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { TusServerController } from './tus-controller';
import { TusService } from './tus-service';
import { exit } from 'process';

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

            if (!metadataHeader) {
              console.log('No metadata header');
              // exit(1)
            }
            console.log('metadataHeader: ', metadataHeader);
            return metadataHeader.toString();
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
