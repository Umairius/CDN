import { Module, Global } from '@nestjs/common';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { TusServerController } from './tus-controller';
import { TusService } from './tus-service';

@Global()
@Module({
  providers: [
    {
      provide: 'TUS_SERVER',
      useFactory: () => {
        const server = new Server({
          path: '/uploadedfiles',
          datastore: new FileStore({ directory: '../uploadedfiles' }),
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
