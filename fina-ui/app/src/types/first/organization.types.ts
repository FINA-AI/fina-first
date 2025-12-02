/**
 * Organization/Individual module types
 */
import {
  AttestationStatus,
  AuditFields,
  IdType,
  OrganizationalForm,
  OrganizationIndividualType,
} from './common.types';

// Organization or Individual
export interface OrganizationIndividual extends AuditFields {
  id: string;
  type: OrganizationIndividualType;
  taxId?: string;
  personalId?: string;
  name?: string; // For organizations
  surname?: string; // For individuals
  firstName?: string; // For individuals
  stateRegOrDocNumber?: string;
  stateRegOrBirthDate?: string;
  address?: string;
  city?: string;
  region?: string;
  idType?: IdType;
  organizationalForm?: OrganizationalForm;
  gender?: 'MALE' | 'FEMALE';
  phone?: string;
  email?: string;
  education?: string;
  profession?: string;
  attestationStatus?: AttestationStatus;
  isActive: boolean;
}

// License or Certificate
export interface LicenseCertificate extends AuditFields {
  id: string;
  organizationIndividualId: string;
  licenseTypeId: string;
  licenseTypeName: string;
  number: string;
  issueDate: string;
  expiryDate?: string;
  issuingAuthority?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  attachments?: string[];
}

// Organization filters
export interface OrganizationFilters {
  type?: OrganizationIndividualType;
  taxId?: string;
  personalId?: string;
  name?: string;
  attestationStatus?: AttestationStatus[];
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}
