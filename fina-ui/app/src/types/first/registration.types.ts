/**
 * Registration module types
 */
import {
  ActionType,
  AuditFields,
  FiStatus,
  LicenseStatus,
  UserRef,
} from './common.types';

// Main FI Registry model
export interface FiRegistry extends AuditFields {
  id: string;
  code: string;
  name: string;
  fiTypeCode: string;
  actionType: ActionType;
  status: FiStatus;
  licenseStatus: LicenseStatus;
  author: string;
  binder?: string;
  progress?: number;
  lastProcessId?: string;
  lastActionId?: string;
  lastActionDate?: string;
  lastLegalActDate?: string;
  lastLegalActNumber?: string;
  directorFullName?: string;
  isHistoricData: boolean;
  archivedGapTaskCount?: number;
}

// FI Registration Action
export interface FiRegistrationAction extends AuditFields {
  id: string;
  registryId: string;
  actionType: ActionType;
  status: FiStatus;
  processId?: string;
  processInstanceId?: string;
  taskId?: string;
  startedAt: string;
  completedAt?: string;
  assignee?: UserRef;
}

// FI Profile (extended registry with additional details)
export interface FiProfile extends FiRegistry {
  description?: string;
  address?: string;
  city?: string;
  region?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  registrationDate?: string;
  legalForm?: string;
  economicEntityType?: string;
  equityForm?: string;
  managementForm?: string;
  licenseNumber?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
}

// FI Gap (deficiency/issue)
export interface FiGap extends AuditFields {
  id: string;
  registryId: string;
  actionId: string;
  gapText: string;
  gapType: 'DOCUMENT' | 'INFORMATION' | 'LEGAL' | 'OTHER';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

// Questionnaire response
export interface FiQuestionnaireResponse extends AuditFields {
  id: string;
  registryId: string;
  actionId: string;
  questionnaireId: string;
  question: string;
  answer: string;
  groupName?: string;
}

// Complex structure (branches, beneficiaries, etc.)
export interface FiComplexStructure extends AuditFields {
  id: string;
  registryId: string;
  structureType: 'BRANCH' | 'BENEFICIARY' | 'AUTHORIZED_PERSON' | 'MANAGEMENT';
  name: string;
  details: Record<string, any>;
}

// Branch
export interface FiBranch extends AuditFields {
  id: string;
  registryId: string;
  branchTypeCode: string;
  code: string;
  name: string;
  address: string;
  city?: string;
  region?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  status: 'ACTIVE' | 'CLOSED';
  openDate: string;
  closeDate?: string;
}

// Beneficiary
export interface FiBeneficiary extends AuditFields {
  id: string;
  registryId: string;
  personType: 'INDIVIDUAL' | 'ORGANIZATION';
  taxId?: string;
  personalId?: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  sharePercent: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// Authorized person
export interface FiAuthorizedPerson extends AuditFields {
  id: string;
  registryId: string;
  personalId: string;
  firstName: string;
  lastName: string;
  position: string;
  phone?: string;
  email?: string;
  authorityStartDate: string;
  authorityEndDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Management structure
export interface FiManagement extends AuditFields {
  id: string;
  registryId: string;
  managementTypeCode: string;
  personType: 'INDIVIDUAL' | 'ORGANIZATION';
  taxId?: string;
  personalId?: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  position: string;
  appointmentDate: string;
  dismissalDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Correspondence
export interface FiCorrespondence extends AuditFields {
  id: string;
  registryId: string;
  subject: string;
  body: string;
  direction: 'INCOMING' | 'OUTGOING';
  correspondent: string;
  correspondenceDate: string;
  registrationNumber?: string;
  attachments?: string[];
}

// Sanctioned people checklist item
export interface SanctionedPeopleChecklistItem extends AuditFields {
  id: string;
  registryId: string;
  actionId: string;
  personName: string;
  personalId?: string;
  taxId?: string;
  checkStatus: 'CLEAN' | 'MATCH_FOUND' | 'UNDER_REVIEW';
  matchDetails?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// Process history item
export interface FiProcessHistoryItem extends AuditFields {
  id: string;
  registryId: string;
  actionType: ActionType;
  processId: string;
  taskId?: string;
  taskName?: string;
  assignee?: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  outcome?: string;
  comments?: string;
}

// Registration filters
export interface RegistrationFilters {
  fiTypeCode?: string;
  status?: FiStatus[];
  licenseStatus?: LicenseStatus[];
  actionType?: ActionType[];
  dateFrom?: string;
  dateTo?: string;
  code?: string;
  name?: string;
  author?: string;
  binder?: string;
  excludeDisabledFis?: boolean;
}
