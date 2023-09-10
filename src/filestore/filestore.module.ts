import { Module } from '@nestjs/common';
import { FileStoreService } from './filestore.service';

@Module({
    providers: [FileStoreService],
    exports: [FileStoreService],
})
export class FilestoreModule {}
