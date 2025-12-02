/**
 * Mock data for FIRST module development and testing
 * Used when API calls fail or during development
 */

import {
  FiRegistry,
  FiType,
  BranchType,
  OrganizationIndividual,
  Task,
  Questionnaire,
  QuestionnaireGroup,
} from '../../../types/first';

// ===========================
// FI TYPES
// ===========================

export const MOCK_FI_TYPES: FiType[] = [
  {
    id: '1',
    code: 'LE',
    description: 'Loan Exchange',
    registrationWorkflowKey: 'fiRegistration',
    changeWorkflowKey: 'fiChange',
    disableWorkflowKey: 'fiDisable',
    branchChangeWorkflowKey: 'fiBranchChange',
    branchEditWorkflowKey: 'fiBranchEdit',
    documentWithdrawalWorkflowKey: 'fiDocumentWithdrawal',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'MFO',
    description: 'Microfinance Organization',
    registrationWorkflowKey: 'fiRegistration',
    changeWorkflowKey: 'fiChange',
    disableWorkflowKey: 'fiDisable',
    branchChangeWorkflowKey: 'fiBranchChange',
    branchEditWorkflowKey: 'fiBranchEdit',
    documentWithdrawalWorkflowKey: 'fiDocumentWithdrawal',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    code: 'FEX',
    description: 'Foreign Exchange',
    registrationWorkflowKey: 'fiRegistration',
    changeWorkflowKey: 'fiChange',
    disableWorkflowKey: 'fiDisable',
    branchChangeWorkflowKey: 'fiBranchChange',
    branchEditWorkflowKey: 'fiBranchEdit',
    documentWithdrawalWorkflowKey: 'fiDocumentWithdrawal',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    code: 'CRU',
    description: 'Credit Union',
    registrationWorkflowKey: 'fiRegistration',
    changeWorkflowKey: 'fiChange',
    disableWorkflowKey: 'fiDisable',
    branchChangeWorkflowKey: 'fiBranchChange',
    branchEditWorkflowKey: 'fiBranchEdit',
    documentWithdrawalWorkflowKey: 'fiDocumentWithdrawal',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// ===========================
// LEGAL FORMS
// ===========================

export const MOCK_LEGAL_FORMS = [
  { value: 'ltd', label: 'Limited Liability Company' },
  { value: 'joinsStockCompany', label: 'Joint Stock Company' },
  { value: 'solidaritySociety', label: 'Solidarity Society' },
  { value: 'commandantSociety', label: 'Commandant Society' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'individualEntrepreneur', label: 'Individual Entrepreneur' },
];

// ===========================
// REGIONAL STRUCTURE
// ===========================

export const MOCK_REGIONS = [
  { id: '1', name: 'Tbilisi', code: 'TB' },
  { id: '2', name: 'Adjara', code: 'AJ' },
  { id: '3', name: 'Guria', code: 'GU' },
  { id: '4', name: 'Imereti', code: 'IM' },
  { id: '5', name: 'Kakheti', code: 'KA' },
  { id: '6', name: 'Kvemo Kartli', code: 'KK' },
  { id: '7', name: 'Mtskheta-Mtianeti', code: 'MM' },
  { id: '8', name: 'Racha-Lechkhumi', code: 'RL' },
  { id: '9', name: 'Samegrelo-Zemo Svaneti', code: 'SZ' },
  { id: '10', name: 'Samtskhe-Javakheti', code: 'SJ' },
  { id: '11', name: 'Shida Kartli', code: 'SK' },
];

export const MOCK_CITIES_BY_REGION: Record<string, Array<{ id: string; name: string }>> = {
  '1': [
    { id: 'TB-1', name: 'Tbilisi' },
  ],
  '2': [
    { id: 'AJ-1', name: 'Batumi' },
    { id: 'AJ-2', name: 'Kobuleti' },
    { id: 'AJ-3', name: 'Khelvachauri' },
  ],
  '3': [
    { id: 'GU-1', name: 'Ozurgeti' },
    { id: 'GU-2', name: 'Lanchkhuti' },
  ],
  '4': [
    { id: 'IM-1', name: 'Kutaisi' },
    { id: 'IM-2', name: 'Zestaponi' },
    { id: 'IM-3', name: 'Chiatura' },
  ],
};

// ===========================
// FI REGISTRY (Sample Data)
// ===========================

export const MOCK_FI_REGISTRY: FiRegistry[] = [
  {
    id: '1',
    code: 'FI-001',
    name: 'Example Microfinance Organization',
    fiTypeCode: 'MFO',
    actionType: 'REGISTRATION',
    status: 'ACCEPTED',
    licenseStatus: 'ACTIVE',
    author: 'admin',
    createdAt: '2024-01-15T10:30:00Z',
    lastActionDate: '2024-01-15T10:30:00Z',
    isHistoricData: false,
  },
  {
    id: '2',
    code: 'FI-002',
    name: 'Test Credit Union',
    fiTypeCode: 'CRU',
    actionType: 'REGISTRATION',
    status: 'IN_PROGRESS',
    licenseStatus: 'ACTIVE',
    author: 'admin',
    createdAt: '2024-02-10T14:20:00Z',
    lastActionDate: '2024-02-10T14:20:00Z',
    isHistoricData: false,
  },
];

// ===========================
// QUESTIONNAIRES
// ===========================

export const MOCK_QUESTIONNAIRE_GROUPS: QuestionnaireGroup[] = [
  {
    id: '1',
    name: 'General Information',
    description: 'Basic FI information questions',
    sequence: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Financial Information',
    description: 'Financial status and reporting',
    sequence: 2,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_QUESTIONNAIRES: Questionnaire[] = [
  {
    id: '1',
    groupId: '1',
    groupName: 'General Information',
    fiTypeCode: 'MFO',
    question: 'Does the organization have a valid business license?',
    code: 'Q001',
    obligatory: true,
    sequence: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    groupId: '1',
    groupName: 'General Information',
    fiTypeCode: 'MFO',
    question: 'Is the organization registered with tax authorities?',
    code: 'Q002',
    obligatory: true,
    sequence: 2,
    createdAt: new Date().toISOString(),
  },
];

// ===========================
// BRANCH TYPES
// ===========================

export const MOCK_BRANCH_TYPES: BranchType[] = [
  {
    id: '1',
    code: 'HEAD_OFFICE',
    name: 'Head Office',
    description: 'Main headquarters',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'SUBDIVISION',
    name: 'Subdivision',
    description: 'Branch subdivision',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    code: 'STOCKROOM',
    name: 'Stockroom',
    description: 'Storage facility',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    code: 'ELECTRONIC_DEVICE',
    name: 'Electronic Device',
    description: 'ATM or electronic service point',
    createdAt: new Date().toISOString(),
  },
];

// ===========================
// TASKS (Sample)
// ===========================

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    processId: 'proc-1',
    processDefinitionId: 'fiRegistration:1',
    processDefinitionKey: 'fiRegistration',
    name: 'Review FI Registration',
    description: 'Review and approve FI registration application',
    assignee: 'controller1',
    state: 'ACTIVE',
    priority: 5,
    startedAt: '2024-03-01T09:00:00Z',
    dueAt: '2024-03-10T17:00:00Z',
    createdAt: '2024-03-01T09:00:00Z',
  },
];

// ===========================
// ORGANIZATIONS (Sample)
// ===========================

export const MOCK_ORGANIZATIONS: OrganizationIndividual[] = [
  {
    id: '1',
    type: 'ORGANIZATION',
    taxId: '123456789',
    name: 'Test Organization LLC',
    address: '123 Main Street',
    city: 'Tbilisi',
    region: 'Tbilisi',
    organizationalForm: 'LLC',
    phone: '+995 32 123 4567',
    email: 'info@testorg.ge',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// ===========================
// YES/NO OPTIONS
// ===========================

export const MOCK_YES_NO_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

// ===========================
// VALIDATION CONSTANTS
// ===========================

export const IDENTITY_REGEX = /^(?=(?:.{9}|.{11})$)[a-zA-Z0-9]*$/;
export const IDENTITY_LENGTH_ORG = 9;
export const IDENTITY_LENGTH_INDIVIDUAL = 11;
