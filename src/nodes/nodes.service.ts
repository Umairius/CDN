// src/node/node.service.ts

import { Injectable } from '@nestjs/common';

export interface NodeInfo {
  ip: string;
  appPort: number;
  tusPort: number;
  privelleged: boolean;
  // Add other relevant properties here
}

@Injectable()
export class NodeService {
  private nodes: NodeInfo[] = [
    { ip: 'localhost', tusPort: 1080, appPort: 3000, privelleged: true },
    { ip: 'localhost', tusPort: 1081, appPort: 3001, privelleged: true },
  ];

  addNode(nodeInfo: NodeInfo) {
    this.nodes.push(nodeInfo);
  }

  removeNode(ipAddress: string) {
    this.nodes = this.nodes.filter((node) => node.ip !== ipAddress);
  }

  listNodes() {
    return this.nodes;
  }

  getTusPort(ip: string, port: number) {
    const node = this.nodes.find(
      (node) => node.ip === ip && node.appPort === port,
    );
    return node.tusPort;
  }
}
