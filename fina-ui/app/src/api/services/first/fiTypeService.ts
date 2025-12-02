/**
 * FI Type and Document Request API Service
 */
import firstAxios from './axios';
import {
  ApiResponse,
  FiType,
  BranchType,
  FiDocumentRequest,
  DocumentRequestDocument,
  PaginationParams,
} from '../../../types/first';

const PREFIX_TYPE = 'ecm/fi/types';
const PREFIX_REQUEST = 'ecm/fi/documentRequest';

// ===========================
// FI Types
// ===========================

export const loadFiTypes = (withFiStatistics = false) => {
  return firstAxios.get<ApiResponse<FiType>>(`${PREFIX_TYPE}`, {
    params: { withFiStatistics },
  });
};

export const loadFiTypeByCode = (code: string) => {
  return firstAxios.get<FiType>(`${PREFIX_TYPE}/${code}`);
};

export const createFiType = (fiType: Partial<FiType>) => {
  return firstAxios.post<FiType>(`${PREFIX_TYPE}`, fiType);
};

export const updateFiType = (code: string, fiType: Partial<FiType>) => {
  return firstAxios.put<FiType>(`${PREFIX_TYPE}/${code}`, fiType);
};

export const deleteFiType = (code: string) => {
  return firstAxios.delete(`${PREFIX_TYPE}/${code}`);
};

// ===========================
// Branch Types
// ===========================

export const loadBranchTypes = () => {
  return firstAxios.get<ApiResponse<BranchType>>(`${PREFIX_TYPE}/branches`);
};

export const createBranchType = (branchType: Partial<BranchType>) => {
  return firstAxios.post<BranchType>(`${PREFIX_TYPE}/branches`, branchType);
};

export const updateBranchType = (id: string, branchType: Partial<BranchType>) => {
  return firstAxios.put<BranchType>(`${PREFIX_TYPE}/branches/${id}`, branchType);
};

export const deleteBranchType = (id: string) => {
  return firstAxios.delete(`${PREFIX_TYPE}/branches/${id}`);
};

// ===========================
// Document Requests
// ===========================

export const loadDocumentRequests = (page: number, limit: number, filters?: any) => {
  return firstAxios.get<ApiResponse<FiDocumentRequest>>(`${PREFIX_REQUEST}`, {
    params: { page, limit, ...filters },
  });
};

export const loadDocumentRequestById = (id: string) => {
  return firstAxios.get<FiDocumentRequest>(`${PREFIX_REQUEST}/${id}`);
};

export const createDocumentRequest = (request: Partial<FiDocumentRequest>) => {
  return firstAxios.post<FiDocumentRequest>(`${PREFIX_REQUEST}`, request);
};

export const updateDocumentRequest = (
  id: string,
  request: Partial<FiDocumentRequest>
) => {
  return firstAxios.put<FiDocumentRequest>(`${PREFIX_REQUEST}/${id}`, request);
};

export const deleteDocumentRequest = (id: string) => {
  return firstAxios.delete(`${PREFIX_REQUEST}/${id}`);
};

export const submitDocumentRequest = (id: string) => {
  return firstAxios.post(`${PREFIX_REQUEST}/${id}/submit`);
};

// ===========================
// Document Request Documents
// ===========================

export const loadRequestDocuments = (requestId: string) => {
  return firstAxios.get<ApiResponse<DocumentRequestDocument>>(
    `${PREFIX_REQUEST}/${requestId}/documents`
  );
};

export const attachDocumentToRequest = (
  requestId: string,
  documentId: string,
  nodeId: string
) => {
  return firstAxios.post(`${PREFIX_REQUEST}/${requestId}/documents`, {
    documentId,
    nodeId,
  });
};

export const removeDocumentFromRequest = (requestId: string, documentId: string) => {
  return firstAxios.delete(`${PREFIX_REQUEST}/${requestId}/documents/${documentId}`);
};
