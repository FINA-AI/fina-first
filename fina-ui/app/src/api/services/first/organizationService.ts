/**
 * Organization/Individual API Service
 */
import firstAxios from './axios';
import {
  ApiResponse,
  OrganizationIndividual,
  LicenseCertificate,
  OrganizationFilters,
  PaginationParams,
} from '../../../types/first';

const PREFIX = 'organizationIndividual';

// ===========================
// Organization/Individual
// ===========================

export const loadOrganizationIndividuals = (
  page: number,
  limit: number,
  filters?: OrganizationFilters
) => {
  return firstAxios.get<ApiResponse<OrganizationIndividual>>(`${PREFIX}`, {
    params: { page, limit, ...filters },
  });
};

export const loadOrganizationIndividualById = (id: string) => {
  return firstAxios.get<OrganizationIndividual>(`${PREFIX}/${id}`);
};

export const createOrganizationIndividual = (
  entity: Partial<OrganizationIndividual>
) => {
  return firstAxios.post<OrganizationIndividual>(`${PREFIX}`, entity);
};

export const updateOrganizationIndividual = (
  id: string,
  entity: Partial<OrganizationIndividual>
) => {
  return firstAxios.put<OrganizationIndividual>(`${PREFIX}/${id}`, entity);
};

export const deleteOrganizationIndividual = (id: string) => {
  return firstAxios.delete(`${PREFIX}/${id}`);
};

export const exportOrganizationIndividuals = (locale: string) => {
  return firstAxios.get(`${PREFIX}/export/${locale}`, {
    responseType: 'blob',
  });
};

// ===========================
// Licenses/Certificates
// ===========================

export const loadLicenseCertificates = (orgIndividualId: string) => {
  return firstAxios.get<ApiResponse<LicenseCertificate>>(
    `${PREFIX}/${orgIndividualId}/licenses`
  );
};

export const createLicenseCertificate = (
  orgIndividualId: string,
  license: Partial<LicenseCertificate>
) => {
  return firstAxios.post<LicenseCertificate>(
    `${PREFIX}/${orgIndividualId}/licenses`,
    license
  );
};

export const updateLicenseCertificate = (
  orgIndividualId: string,
  licenseId: string,
  license: Partial<LicenseCertificate>
) => {
  return firstAxios.put<LicenseCertificate>(
    `${PREFIX}/${orgIndividualId}/licenses/${licenseId}`,
    license
  );
};

export const deleteLicenseCertificate = (
  orgIndividualId: string,
  licenseId: string
) => {
  return firstAxios.delete(`${PREFIX}/${orgIndividualId}/licenses/${licenseId}`);
};
