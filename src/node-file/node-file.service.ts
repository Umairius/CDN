import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { exit } from 'process';
import { FileStoreService } from 'src/filestore/filestore.service';
import { buildUrl } from 'src/helper-functions/build-url';
import { NodeService } from 'src/nodes/nodes.service';

@Injectable()
export class NodeFileService {
  static readonly filesForNode: Map<string, string[]> = new Map();

  constructor(
    private readonly fileStoreService: FileStoreService,
    private readonly nodeService: NodeService,
  ) {}

  async probeNodeForFiles(): Promise<void> {
    const files = this.fileStoreService.getFilesToUpload();
    //Get own files and send the list as a payload to other node.
    const nodes = this.nodeService.listNodes();

    try {
      const requests = nodes.map(async (node) => {
        console.log('Probing node:', +node + '/filestore');

        const res = await axios.post(
          buildUrl(node.ip, node.appPort) + '/filestore',
          {
            files: files,
          },
        );

        NodeFileService.filesForNode.set(
          buildUrl(node.ip, this.nodeService.getTusPort(node.ip, node.appPort)),
          res.data,
        );
        console.log(NodeFileService.filesForNode);
        console.log('Files for node:', node, res.data);
      });

      // Wait for all promises to resolve
      await Promise.all(requests);

      // Proceed with any code that should run after all requests are complete
    } catch (error) {
      // Handle any errors here
      console.error('Error:', error);
    }

    console.log('Files for node:', NodeFileService.filesForNode);
  }
  catch(error) {
    // Handle the error here
    console.error('Error while probing node for files:', error.message);
  }
}
