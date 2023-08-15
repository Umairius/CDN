import { Module } from "@nestjs/common";
import { TusUploadController } from "./tus-controller";
import { TusUploadService } from "./tus-service";


@Module({
    imports: [],
    controllers: [TusUploadController],
    providers: [TusUploadService],
    exports: [TusUploadService]

})

export class TusClientModule { }