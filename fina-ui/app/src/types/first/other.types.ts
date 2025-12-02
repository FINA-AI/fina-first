/**
 * Other module types (Questionnaire, FI Type, Dashboard, etc.)
 */
import { AuditFields, LicenseType } from './common.types';

// ====================
// QUESTIONNAIRE
// ====================

export interface Questionnaire extends AuditFields {
  id: string;
  groupId: string;
  groupName?: string;
  fiTypeCode: string;
  question: string;
  code?: string;
  obligatory: boolean;
  defaultValue?: string;
  sequence?: number;
}

export interface QuestionnaireGroup extends AuditFields {
  id: string;
  name: string;
  description?: string;
  sequence?: number;
}

// ====================
// FI TYPE
// ====================

export interface FiType extends AuditFields {
  id: string;
  code: string;
  description: string;
  registrationWorkflowKey?: string;
  changeWorkflowKey?: string;
  disableWorkflowKey?: string;
  branchChangeWorkflowKey?: string;
  branchEditWorkflowKey?: string;
  documentWithdrawalWorkflowKey?: string;
  branchTypes?: BranchType[];
  isActive: boolean;
}

export interface BranchType extends AuditFields {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface FiDocumentRequest extends AuditFields {
  id: string;
  name: string;
  description?: string;
  dueDate: string;
  assigneeFiCode: string;
  assigneeFiName: string;
  submitted: boolean;
  submissionDate?: string;
  documents?: DocumentRequestDocument[];
}

export interface DocumentRequestDocument extends AuditFields {
  id: string;
  requestId: string;
  name: string;
  description?: string;
  required: boolean;
  submitted: boolean;
  nodeId?: string;
  submittedAt?: string;
}

// ====================
// DASHBOARD
// ====================

export interface DashboardWidget {
  id: string;
  type: 'CHART' | 'STAT' | 'TABLE' | 'MAP';
  title: string;
  config: Record<string, any>;
}

export interface FiStatistic {
  fiTypeCode: string;
  fiTypeName: string;
  totalCount: number;
  activeCount: number;
  canceledCount: number;
  inProgressCount: number;
}

export interface RegionalStatistic {
  region: string;
  regionCode: string;
  headOfficeCount: number;
  branchCount: number;
  totalCount: number;
}

export interface YearlyStatistic {
  year: number;
  month?: number;
  registrationCount: number;
  cancellationCount: number;
  changeCount: number;
}

// ====================
// BLACKLIST
// ====================

export interface Blacklist extends AuditFields {
  id: string;
  type: 'ORGANIZATION' | 'INDIVIDUAL';
  taxId?: string;
  personalId?: string;
  name: string;
  reason: string;
  addedDate: string;
  removedDate?: string;
  isActive: boolean;
  documents?: string[];
}

// ====================
// ATTESTATION
// ====================

export interface Attestation extends AuditFields {
  id: string;
  organizationIndividualId: string;
  candidateName: string;
  candidateType: 'ORGANIZATION' | 'INDIVIDUAL';
  attestationDate: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  decision?: string;
  committee?: string;
  documents?: string[];
}

// ====================
// LICENSE TYPE
// ====================

export interface LicenseTypeConfig extends AuditFields {
  id: string;
  type: LicenseType;
  name: string;
  identifier: string;
  documentNumber?: string;
  registrationDate?: string;
  description?: string;
  isActive: boolean;
}

// ====================
// SEARCH
// ====================

export interface SearchResult {
  id: string;
  nodeId?: string;
  type: 'DOCUMENT' | 'REGISTRY' | 'BRANCH' | 'BENEFICIARY' | 'QUESTIONNAIRE' | 'AUTHORIZED_PERSON';
  name: string;
  description?: string;
  path?: string;
  breadcrumb?: string[];
  score: number;
  highlightedFields?: Record<string, string>;
  properties?: Record<string, any>;
}

export interface SearchFilters {
  query: string;
  types?: string[];
  dateFrom?: string;
  dateTo?: string;
  properties?: Record<string, any>;
}

// ====================
// TEMPLATE
// ====================

export interface DocumentTemplate extends AuditFields {
  id: string;
  name: string;
  description?: string;
  templateType: 'HTML' | 'DOCX' | 'PDF';
  content: string;
  status: 'ACTIVE' | 'PASSIVE';
  variables?: string[];
}

// ====================
// PROPERTY
// ====================

export interface ConfigProperty extends AuditFields {
  id: string;
  key: string;
  value: string;
  description?: string;
  propertyType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
}
