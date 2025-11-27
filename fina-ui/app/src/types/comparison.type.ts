import { MdtNode } from "./mdt.type";

export interface Comparison {
  id: number;
  nodeId: number;
  condition: string;
  leftEquation: string;
  equation: string;
  numberPattern: string | null;
  messageTemplate: string;
  processStage: string;
  node: MdtNode;
  template: string;
}
