/**
 * Common types used across FIRST module
 */

// API Response wrapper
export interface ApiResponse<T> {
  list: T[];
  totalResults: number;
}

// Pagination params
export interface PaginationParams {
  page: number;
  limit: number;
}

// Filter params
export interface FilterParams {
  [key: string]: any;
}

// Date range filter
export interface DateRangeFilter {
  startDate?: string | Date;
  endDate?: string | Date;
}

// Sort params
export interface SortParams {
  property: string;
  direction: 'ASC' | 'DESC';
}

// Status types
export type FiStatus =
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELED'
  | 'GAP'
  | 'IN_PROGRESS'
  | 'LIQUIDATION';

export type LicenseStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REVOKED'
  | 'EXPIRED';

export type ActionType =
  | 'REGISTRATION'
  | 'CHANGE'
  | 'BRANCHES_CHANGE'
  | 'BRANCHES_EDIT'
  | 'DOCUMENT_WITHDRAWAL'
  | 'CANCELLATION';

export type AttestationStatus =
  | 'underReview'
  | 'declined'
  | 'recognized'
  | 'inQueue'
  | 'inAttestationList'
  | 'candidateApproved'
  | 'candidateDisapproved';

export type OrganizationIndividualType = 'ORGANIZATION' | 'INDIVIDUAL';

export type IdType = 'nationalPassport' | 'nationalId' | 'other';

export type OrganizationalForm = 'LLC' | 'OJSC' | 'CJSC' | 'IE';

export type LicenseType = 'LICENSE' | 'CERTIFICATE';

export type TaskState = 'ACTIVE' | 'COMPLETED' | 'PENDING';

// Common audit fields
export interface AuditFields {
  createdAt: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
}

// User reference
export interface UserRef {
  id: string;
  username: string;
  fullName?: string;
}

// Group reference
export interface GroupRef {
  id: string;
  name: string;
  displayName?: string;
}

// Document attachment
export interface DocumentAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  uploadDate: string;
  nodeId?: string;
}

// Permission
export interface Permission {
  id: string;
  authority: string;
  authorityType: 'USER' | 'GROUP';
  role: 'VIEWER' | 'EDITOR' | 'COLLABORATOR' | 'COORDINATOR';
}
