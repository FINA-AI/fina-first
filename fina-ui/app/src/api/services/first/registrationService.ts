/**
 * Registration API Service
 * Handles FI registration CRUD and related operations
 */
import firstAxios from './axios';
import {
  ApiResponse,
  FiRegistry,
  FiProfile,
  FiGap,
  FiQuestionnaireResponse,
  FiBranch,
  FiBeneficiary,
  FiAuthorizedPerson,
  FiManagement,
  FiCorrespondence,
  SanctionedPeopleChecklistItem,
  FiProcessHistoryItem,
  RegistrationFilters,
  PaginationParams,
} from '../../../types/first';

const PREFIX = 'ecm/fi';

// ===========================
// FI Registry Operations
// ===========================

export const loadFiRegistry = (
  page: number,
  limit: number,
  filters?: RegistrationFilters
) => {
  return firstAxios.get<ApiResponse<FiRegistry>>(`${PREFIX}`, {
    params: {
      page,
      limit,
      ...filters,
    },
  });
};

export const loadFiById = (fiId: string) => {
  return firstAxios.get<FiProfile>(`${PREFIX}/load/${fiId}`);
};

export const createFi = (fi: Partial<FiProfile>, removeFiPermissions = false) => {
  return firstAxios.post<FiProfile>(`${PREFIX}`, fi, {
    params: {
      removeFiPermissions,
    },
  });
};

export const updateFi = (fiId: string, fi: Partial<FiProfile>) => {
  return firstAxios.put<FiProfile>(`${PREFIX}/${fiId}`, fi);
};

export const deleteFi = (fiId: string) => {
  return firstAxios.delete(`${PREFIX}/${fiId}`);
};

export const deleteFis = (fiIds: string[]) => {
  return firstAxios.post(`${PREFIX}/delete/fis`, fiIds);
};

export const exportFiRegistry = (locale: string) => {
  return firstAxios.get(`${PREFIX}/export/${locale}`, {
    responseType: 'blob',
  });
};

export const importFiRegistry = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return firstAxios.post(`${PREFIX}/import`, formData, {
    timeout: 600_000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ===========================
// FI History
// ===========================

export const loadFiHistory = (fiId: string, page: number, limit: number) => {
  return firstAxios.get<ApiResponse<FiProcessHistoryItem>>(
    `${PREFIX}/history/${fiId}`,
    {
      params: { page, limit },
    }
  );
};

// ===========================
// FI Permissions
// ===========================

export const loadPermittedUsers = (fiId: string) => {
  return firstAxios.get(`${PREFIX}/permittedusers/${fiId}`);
};

export const loadResponsibleUsers = (fiId: string) => {
  return firstAxios.get(`${PREFIX}/${fiId}/users`);
};

export const updateFiPermittedUsers = (fi: Partial<FiProfile>) => {
  return firstAxios.post(`${PREFIX}/${fi.id}/permitted/users/`, fi);
};

// ===========================
// Gaps Management
// ===========================

export const loadFiGaps = (fiId: string, actionId: string) => {
  return firstAxios.get<ApiResponse<FiGap>>(`${PREFIX}/${fiId}/gaps`, {
    params: { actionId },
  });
};

export const createFiGap = (fiId: string, gap: Partial<FiGap>) => {
  return firstAxios.post<FiGap>(`${PREFIX}/${fiId}/gaps`, gap);
};

export const updateFiGap = (fiId: string, gapId: string, gap: Partial<FiGap>) => {
  return firstAxios.put<FiGap>(`${PREFIX}/${fiId}/gaps/${gapId}`, gap);
};

export const deleteFiGap = (fiId: string, gapId: string) => {
  return firstAxios.delete(`${PREFIX}/${fiId}/gaps/${gapId}`);
};

// ===========================
// Questionnaire Responses
// ===========================

export const loadQuestionnaireResponses = (fiId: string, actionId: string) => {
  return firstAxios.get<ApiResponse<FiQuestionnaireResponse>>(
    `${PREFIX}/${fiId}/questionnaires`,
    {
      params: { actionId },
    }
  );
};

export const saveQuestionnaireResponses = (
  fiId: string,
  responses: FiQuestionnaireResponse[]
) => {
  return firstAxios.post(`${PREFIX}/${fiId}/questionnaires`, responses);
};

// ===========================
// Branches
// ===========================

export const loadFiBranches = (fiId: string, params?: PaginationParams) => {
  return firstAxios.get<ApiResponse<FiBranch>>(`${PREFIX}/${fiId}/branches`, {
    params,
  });
};

export const createFiBranch = (fiId: string, branch: Partial<FiBranch>) => {
  return firstAxios.post<FiBranch>(`${PREFIX}/${fiId}/branches`, branch);
};

export const updateFiBranch = (
  fiId: string,
  branchId: string,
  branch: Partial<FiBranch>
) => {
  return firstAxios.put<FiBranch>(
    `${PREFIX}/${fiId}/branches/${branchId}`,
    branch
  );
};

export const deleteFiBranch = (fiId: string, branchId: string) => {
  return firstAxios.delete(`${PREFIX}/${fiId}/branches/${branchId}`);
};

// ===========================
// Beneficiaries
// ===========================

export const loadFiBeneficiaries = (fiId: string, params?: PaginationParams) => {
  return firstAxios.get<ApiResponse<FiBeneficiary>>(
    `${PREFIX}/${fiId}/beneficiaries`,
    {
      params,
    }
  );
};

export const createFiBeneficiary = (
  fiId: string,
  beneficiary: Partial<FiBeneficiary>
) => {
  return firstAxios.post<FiBeneficiary>(
    `${PREFIX}/${fiId}/beneficiaries`,
    beneficiary
  );
};

export const updateFiBeneficiary = (
  fiId: string,
  beneficiaryId: string,
  beneficiary: Partial<FiBeneficiary>
) => {
  return firstAxios.put<FiBeneficiary>(
    `${PREFIX}/${fiId}/beneficiaries/${beneficiaryId}`,
    beneficiary
  );
};

export const deleteFiBeneficiary = (fiId: string, beneficiaryId: string) => {
  return firstAxios.delete(`${PREFIX}/${fiId}/beneficiaries/${beneficiaryId}`);
};

// ===========================
// Authorized Persons
// ===========================

export const loadFiAuthorizedPersons = (
  fiId: string,
  params?: PaginationParams
) => {
  return firstAxios.get<ApiResponse<FiAuthorizedPerson>>(
    `${PREFIX}/${fiId}/authorized-persons`,
    {
      params,
    }
  );
};

export const createFiAuthorizedPerson = (
  fiId: string,
  person: Partial<FiAuthorizedPerson>
) => {
  return firstAxios.post<FiAuthorizedPerson>(
    `${PREFIX}/${fiId}/authorized-persons`,
    person
  );
};

export const updateFiAuthorizedPerson = (
  fiId: string,
  personId: string,
  person: Partial<FiAuthorizedPerson>
) => {
  return firstAxios.put<FiAuthorizedPerson>(
    `${PREFIX}/${fiId}/authorized-persons/${personId}`,
    person
  );
};

export const deleteFiAuthorizedPerson = (fiId: string, personId: string) => {
  return firstAxios.delete(`${PREFIX}/${fiId}/authorized-persons/${personId}`);
};

// ===========================
// Management
// ===========================

export const loadFiManagement = (fiId: string, params?: PaginationParams) => {
  return firstAxios.get<ApiResponse<FiManagement>>(
    `${PREFIX}/${fiId}/management`,
    {
      params,
    }
  );
};

export const createFiManagement = (
  fiId: string,
  management: Partial<FiManagement>
) => {
  return firstAxios.post<FiManagement>(
    `${PREFIX}/${fiId}/management`,
    management
  );
};

export const updateFiManagement = (
  fiId: string,
  managementId: string,
  management: Partial<FiManagement>
) => {
  return firstAxios.put<FiManagement>(
    `${PREFIX}/${fiId}/management/${managementId}`,
    management
  );
};

export const deleteFiManagement = (fiId: string, managementId: string) => {
  return firstAxios.delete(`${PREFIX}/${fiId}/management/${managementId}`);
};

// ===========================
// Correspondence
// ===========================

export const loadFiCorrespondence = (
  fiId: string,
  params?: PaginationParams
) => {
  return firstAxios.get<ApiResponse<FiCorrespondence>>(
    `${PREFIX}/${fiId}/correspondence`,
    {
      params,
    }
  );
};

export const createFiCorrespondence = (
  fiId: string,
  correspondence: Partial<FiCorrespondence>
) => {
  return firstAxios.post<FiCorrespondence>(
    `${PREFIX}/${fiId}/correspondence`,
    correspondence
  );
};

export const updateFiCorrespondence = (
  fiId: string,
  correspondenceId: string,
  correspondence: Partial<FiCorrespondence>
) => {
  return firstAxios.put<FiCorrespondence>(
    `${PREFIX}/${fiId}/correspondence/${correspondenceId}`,
    correspondence
  );
};

export const deleteFiCorrespondence = (fiId: string, correspondenceId: string) => {
  return firstAxios.delete(
    `${PREFIX}/${fiId}/correspondence/${correspondenceId}`
  );
};

// ===========================
// Sanctioned People Checklist
// ===========================

export const loadSanctionedPeopleChecklist = (
  fiId: string,
  actionId: string
) => {
  return firstAxios.get<ApiResponse<SanctionedPeopleChecklistItem>>(
    `${PREFIX}/${fiId}/sanctioned-people`,
    {
      params: { actionId },
    }
  );
};

export const checkSanctionedPeople = (
  fiId: string,
  actionId: string,
  people: Array<{ name: string; personalId?: string; taxId?: string }>
) => {
  return firstAxios.post<ApiResponse<SanctionedPeopleChecklistItem>>(
    `${PREFIX}/${fiId}/sanctioned-people/check`,
    people,
    {
      params: { actionId },
    }
  );
};

// ===========================
// Reports & Templates
// ===========================

export const loadReportTemplates = () => {
  return firstAxios.get<Array<{ id: string; name: string; type: string }>>(
    `${PREFIX}/report/templates`
  );
};

export const generateFiReport = (
  fiId: string,
  templateId: string,
  format: 'PDF' | 'DOCX'
) => {
  return firstAxios.get(`${PREFIX}/${fiId}/report/${templateId}`, {
    params: { format },
    responseType: 'blob',
  });
};

// ===========================
// Task Reassignment
// ===========================

export const reassignTask = (
  taskId: string,
  newAssignee: string,
  reason?: string
) => {
  return firstAxios.post(`${PREFIX}/task/${taskId}/reassign`, {
    newAssignee,
    reason,
  });
};

export const changeInspector = (
  fiId: string,
  newInspector: string,
  reason?: string
) => {
  return firstAxios.post(`${PREFIX}/${fiId}/change-inspector`, {
    newInspector,
    reason,
  });
};
