import { Module } from '@nestjs/common';
import { NodeService } from './nodes.service';

@Module({})
export class NodesModule {
    providers: [NodeService]
    services: [NodeService]
}
