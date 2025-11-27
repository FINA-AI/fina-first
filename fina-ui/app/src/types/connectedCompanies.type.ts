import { Edge } from "react-flow-renderer";
import { LegalPersonDataType } from "./legalPerson.type";

export interface Dependency {
  legalPerson: LegalPersonDataType;
  dependencyType: string;
}

export interface FullConnectionStructureType {
  source: LegalPersonDataType;
  dependencies: Dependency[];
}

export type GraphEdgeType = Edge<{
  id: string;
  source: string;
  target: string;
  label: string;
  type: string | boolean;
  animated: boolean;
  markerEnd: {
    type: string;
    color: string;
    strokeWidth: number;
  };
  style: {
    stroke: string;
    strokeWidth: number;
  };
  connectionType: string;
  sections?: {
    id: string;
    startPoint: {
      x: number;
      y: number;
    };
    endPoint: {
      x: number;
      y: number;
    };
    incomingShape: string;
    outgoingShape: string;
  }[];
  container?: string;
  selected?: boolean;
}>;

export interface ConnectedCompaniesDataType {
  source: LegalPersonDataType;
  legalPerson: LegalPersonDataType;
  dependencyType: string;
  businessActivity?: any;
  connectionType?: string;
  destination?: any;
  destinationsConnectedCompanies?: FullConnectionStructureType[];
  id?: number;
  sourceConnectedCompanies?: FullConnectionStructureType[];
  strategicPlan?: any;
  dependencies?: Dependency[];
}
