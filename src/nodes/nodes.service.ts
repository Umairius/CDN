// src/node/node.service.ts

import { Injectable } from '@nestjs/common';

export interface NodeInfo {
  ip: string;
  port: number;
  privelleged: boolean;
  // Add other relevant properties here
}

@Injectable()
export class NodeService {
  private nodes: NodeInfo[] = [
    { ip: 'localhost', port: 1080, privelleged: true },
    // { ip: 'localhost', port: 1081, privelleged: false },
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

  getNode(ipAddress: string) {
    return this.nodes.find((node) => node.ip === ipAddress);
  }
}
