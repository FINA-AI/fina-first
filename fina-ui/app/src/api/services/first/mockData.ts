/**
 * Comprehensive mock data for FIRST module development and testing
 * Used when API calls fail or during development
 */

import {
  FiRegistry,
  FiProfile,
  FiBranch,
  FiBeneficiary,
  FiAuthorizedPerson,
  FiManagement,
  FiGap,
  FiCorrespondence,
  FiProcessHistoryItem,
  FiQuestionnaireResponse,
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
  '1': [{ id: 'TB-1', name: 'Tbilisi' }],
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
  '5': [
    { id: 'KA-1', name: 'Telavi' },
    { id: 'KA-2', name: 'Gurjaani' },
    { id: 'KA-3', name: 'Sighnaghi' },
  ],
  '6': [
    { id: 'KK-1', name: 'Rustavi' },
    { id: 'KK-2', name: 'Marneuli' },
  ],
  '7': [
    { id: 'MM-1', name: 'Mtskheta' },
    { id: 'MM-2', name: 'Dusheti' },
  ],
  '8': [{ id: 'RL-1', name: 'Ambrolauri' }],
  '9': [
    { id: 'SZ-1', name: 'Zugdidi' },
    { id: 'SZ-2', name: 'Poti' },
  ],
  '10': [
    { id: 'SJ-1', name: 'Akhaltsikhe' },
    { id: 'SJ-2', name: 'Borjomi' },
  ],
  '11': [
    { id: 'SK-1', name: 'Gori' },
    { id: 'SK-2', name: 'Kaspi' },
  ],
};

// ===========================
// FI REGISTRY (Sample Data)
// ===========================

export const MOCK_FI_REGISTRY: FiRegistry[] = [
  {
    id: '1',
    code: 'MFO-2024-001',
    name: 'Georgian Microfinance LLC',
    fiTypeCode: 'MFO',
    actionType: 'REGISTRATION',
    status: 'ACCEPTED',
    licenseStatus: 'ACTIVE',
    author: 'admin',
    directorFullName: 'Giorgi Beridze',
    lastActionDate: '2024-01-15T10:30:00Z',
    lastLegalActDate: '2024-01-20T00:00:00Z',
    lastLegalActNumber: 'LA-2024-001',
    progress: 100,
    isHistoricData: false,
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin',
  },
  {
    id: '2',
    code: 'CRU-2024-002',
    name: 'Tbilisi Credit Union',
    fiTypeCode: 'CRU',
    actionType: 'REGISTRATION',
    status: 'IN_PROGRESS',
    licenseStatus: 'ACTIVE',
    author: 'supervisor1',
    directorFullName: 'Nino Maisuradze',
    lastActionDate: '2024-02-10T14:20:00Z',
    progress: 65,
    isHistoricData: false,
    createdAt: '2024-02-10T14:20:00Z',
    createdBy: 'supervisor1',
  },
  {
    id: '3',
    code: 'FEX-2024-003',
    name: 'Capital Exchange Group',
    fiTypeCode: 'FEX',
    actionType: 'REGISTRATION',
    status: 'GAP',
    licenseStatus: 'ACTIVE',
    author: 'controller2',
    directorFullName: 'Levan Kapanadze',
    lastActionDate: '2024-03-05T09:15:00Z',
    progress: 40,
    archivedGapTaskCount: 2,
    isHistoricData: false,
    createdAt: '2024-03-05T09:15:00Z',
    createdBy: 'controller2',
  },
  {
    id: '4',
    code: 'LE-2024-004',
    name: 'Quick Loan Express',
    fiTypeCode: 'LE',
    actionType: 'REGISTRATION',
    status: 'ACCEPTED',
    licenseStatus: 'ACTIVE',
    author: 'admin',
    directorFullName: 'Tamta Chikovani',
    lastActionDate: '2024-01-28T11:00:00Z',
    lastLegalActDate: '2024-02-01T00:00:00Z',
    lastLegalActNumber: 'LA-2024-002',
    progress: 100,
    isHistoricData: false,
    createdAt: '2024-01-28T11:00:00Z',
    createdBy: 'admin',
  },
  {
    id: '5',
    code: 'MFO-2024-005',
    name: 'Rural Development Microfinance',
    fiTypeCode: 'MFO',
    actionType: 'CHANGE',
    status: 'IN_PROGRESS',
    licenseStatus: 'ACTIVE',
    author: 'supervisor2',
    directorFullName: 'Mikheil Lomidze',
    lastActionDate: '2024-03-12T16:45:00Z',
    progress: 50,
    isHistoricData: false,
    createdAt: '2023-06-10T10:00:00Z',
    createdBy: 'admin',
  },
  {
    id: '6',
    code: 'CRU-2023-015',
    name: 'Community Credit Cooperative',
    fiTypeCode: 'CRU',
    actionType: 'REGISTRATION',
    status: 'DECLINED',
    licenseStatus: 'EXPIRED',
    author: 'controller1',
    directorFullName: 'Ana Goglichidze',
    lastActionDate: '2023-11-20T13:30:00Z',
    lastLegalActDate: '2023-11-25T00:00:00Z',
    lastLegalActNumber: 'LA-2023-098',
    progress: 100,
    isHistoricData: false,
    createdAt: '2023-11-20T13:30:00Z',
    createdBy: 'controller1',
  },
  {
    id: '7',
    code: 'FEX-2024-006',
    name: 'Western Georgia Exchange',
    fiTypeCode: 'FEX',
    actionType: 'BRANCHES_CHANGE',
    status: 'ACCEPTED',
    licenseStatus: 'ACTIVE',
    author: 'supervisor1',
    directorFullName: 'Zurab Meladze',
    lastActionDate: '2024-02-18T10:00:00Z',
    lastLegalActDate: '2024-02-20T00:00:00Z',
    lastLegalActNumber: 'LA-2024-012',
    progress: 100,
    isHistoricData: false,
    createdAt: '2023-03-15T09:00:00Z',
    createdBy: 'admin',
  },
  {
    id: '8',
    code: 'LE-2024-007',
    name: 'Fast Money Solutions',
    fiTypeCode: 'LE',
    actionType: 'REGISTRATION',
    status: 'CANCELED',
    licenseStatus: 'REVOKED',
    author: 'controller2',
    directorFullName: 'Salome Janelidze',
    lastActionDate: '2024-01-10T14:00:00Z',
    progress: 30,
    isHistoricData: false,
    createdAt: '2024-01-10T14:00:00Z',
    createdBy: 'controller2',
  },
  {
    id: '9',
    code: 'MFO-2023-089',
    name: 'Mountain Region Finance',
    fiTypeCode: 'MFO',
    actionType: 'REGISTRATION',
    status: 'ACCEPTED',
    licenseStatus: 'SUSPENDED',
    author: 'admin',
    directorFullName: 'David Gvritishvili',
    lastActionDate: '2023-09-12T11:30:00Z',
    lastLegalActDate: '2023-09-15T00:00:00Z',
    lastLegalActNumber: 'LA-2023-067',
    progress: 100,
    isHistoricData: false,
    createdAt: '2023-09-12T11:30:00Z',
    createdBy: 'admin',
  },
  {
    id: '10',
    code: 'CRU-2024-008',
    name: 'Agricultural Credit Union',
    fiTypeCode: 'CRU',
    actionType: 'REGISTRATION',
    status: 'IN_PROGRESS',
    licenseStatus: 'ACTIVE',
    author: 'supervisor2',
    directorFullName: 'Ketevan Tsereteli',
    lastActionDate: '2024-03-18T15:20:00Z',
    progress: 75,
    isHistoricData: false,
    createdAt: '2024-03-18T15:20:00Z',
    createdBy: 'supervisor2',
  },
];

// ===========================
// FI PROFILES (Detailed)
// ===========================

export const MOCK_FI_PROFILES: Record<string, FiProfile> = {
  '1': {
    ...MOCK_FI_REGISTRY[0],
    description: 'Leading microfinance organization providing financial services to rural communities',
    address: '45 Rustaveli Avenue, Building 12',
    city: 'Tbilisi',
    region: 'Tbilisi',
    phone: '+995 32 298 7654',
    email: 'info@georgianmicro.ge',
    website: 'www.georgianmicro.ge',
    taxId: '204567890',
    registrationNumber: 'REG-2024-001',
    registrationDate: '2024-01-20T00:00:00Z',
    legalForm: 'ltd',
    licenseNumber: 'LIC-MFO-2024-001',
    licenseIssueDate: '2024-01-20T00:00:00Z',
    licenseExpiryDate: '2029-01-20T00:00:00Z',
  },
  '2': {
    ...MOCK_FI_REGISTRY[1],
    description: 'Community-based credit union serving Tbilisi residents',
    address: '78 Pekini Street, Floor 3',
    city: 'Tbilisi',
    region: 'Tbilisi',
    phone: '+995 32 277 3456',
    email: 'contact@tbilisicru.ge',
    website: 'www.tbilisicru.ge',
    taxId: '205678901',
    registrationNumber: 'REG-2024-002',
    registrationDate: '2024-02-15T00:00:00Z',
    legalForm: 'cooperative',
    licenseNumber: 'LIC-CRU-2024-001',
    licenseIssueDate: '2024-02-15T00:00:00Z',
  },
  '3': {
    ...MOCK_FI_REGISTRY[2],
    description: 'Foreign exchange services provider',
    address: '15 Chavchavadze Avenue',
    city: 'Tbilisi',
    region: 'Tbilisi',
    phone: '+995 32 291 2345',
    email: 'info@capitalexchange.ge',
    website: 'www.capitalexchange.ge',
    taxId: '206789012',
    registrationNumber: 'REG-2024-003',
    legalForm: 'ltd',
  },
  '4': {
    ...MOCK_FI_REGISTRY[3],
    description: 'Quick loan services for individuals and businesses',
    address: '92 Agmashenebeli Avenue',
    city: 'Tbilisi',
    region: 'Tbilisi',
    phone: '+995 32 255 8899',
    email: 'loans@quickloan.ge',
    website: 'www.quickloanexpress.ge',
    taxId: '207890123',
    registrationNumber: 'REG-2024-004',
    registrationDate: '2024-02-01T00:00:00Z',
    legalForm: 'ltd',
    licenseNumber: 'LIC-LE-2024-001',
    licenseIssueDate: '2024-02-01T00:00:00Z',
    licenseExpiryDate: '2029-02-01T00:00:00Z',
  },
  '5': {
    ...MOCK_FI_REGISTRY[4],
    description: 'Specialized in rural and agricultural financing',
    address: '23 Kakheti Highway',
    city: 'Telavi',
    region: 'Kakheti',
    phone: '+995 350 27 1122',
    email: 'info@ruralmicro.ge',
    taxId: '208901234',
    registrationNumber: 'REG-2023-045',
    registrationDate: '2023-06-15T00:00:00Z',
    legalForm: 'ltd',
    licenseNumber: 'LIC-MFO-2023-015',
    licenseIssueDate: '2023-06-15T00:00:00Z',
    licenseExpiryDate: '2028-06-15T00:00:00Z',
  },
};

// ===========================
// BRANCHES
// ===========================

export const MOCK_BRANCHES: Record<string, FiBranch[]> = {
  '1': [
    {
      id: 'BR-1-1',
      registryId: '1',
      branchTypeCode: 'HEAD_OFFICE',
      code: 'HQ-001',
      name: 'Head Office',
      address: '45 Rustaveli Avenue, Building 12',
      city: 'Tbilisi',
      region: 'Tbilisi',
      phone: '+995 32 298 7654',
      email: 'hq@georgianmicro.ge',
      managerName: 'Giorgi Beridze',
      status: 'ACTIVE',
      openDate: '2024-01-20T00:00:00Z',
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'BR-1-2',
      registryId: '1',
      branchTypeCode: 'SUBDIVISION',
      code: 'BR-001',
      name: 'Vake Branch',
      address: '120 Chavchavadze Avenue',
      city: 'Tbilisi',
      region: 'Tbilisi',
      phone: '+995 32 221 3456',
      email: 'vake@georgianmicro.ge',
      managerName: 'Marina Kiknadze',
      status: 'ACTIVE',
      openDate: '2024-02-01T00:00:00Z',
      createdAt: '2024-02-01T09:00:00Z',
    },
    {
      id: 'BR-1-3',
      registryId: '1',
      branchTypeCode: 'SUBDIVISION',
      code: 'BR-002',
      name: 'Saburtalo Branch',
      address: '45 Vazha-Pshavela Avenue',
      city: 'Tbilisi',
      region: 'Tbilisi',
      phone: '+995 32 233 7890',
      email: 'saburtalo@georgianmicro.ge',
      managerName: 'Lasha Kobakhidze',
      status: 'ACTIVE',
      openDate: '2024-02-15T00:00:00Z',
      createdAt: '2024-02-15T10:30:00Z',
    },
  ],
  '2': [
    {
      id: 'BR-2-1',
      registryId: '2',
      branchTypeCode: 'HEAD_OFFICE',
      code: 'HQ-002',
      name: 'Head Office',
      address: '78 Pekini Street, Floor 3',
      city: 'Tbilisi',
      region: 'Tbilisi',
      phone: '+995 32 277 3456',
      email: 'hq@tbilisicru.ge',
      managerName: 'Nino Maisuradze',
      status: 'ACTIVE',
      openDate: '2024-02-15T00:00:00Z',
      createdAt: '2024-02-15T11:00:00Z',
    },
  ],
  '4': [
    {
      id: 'BR-4-1',
      registryId: '4',
      branchTypeCode: 'HEAD_OFFICE',
      code: 'HQ-004',
      name: 'Head Office',
      address: '92 Agmashenebeli Avenue',
      city: 'Tbilisi',
      region: 'Tbilisi',
      phone: '+995 32 255 8899',
      email: 'hq@quickloan.ge',
      managerName: 'Tamta Chikovani',
      status: 'ACTIVE',
      openDate: '2024-02-01T00:00:00Z',
      createdAt: '2024-02-01T12:00:00Z',
    },
    {
      id: 'BR-4-2',
      registryId: '4',
      branchTypeCode: 'ELECTRONIC_DEVICE',
      code: 'ATM-001',
      name: 'ATM Station Plaza',
      address: 'Station Square',
      city: 'Tbilisi',
      region: 'Tbilisi',
      status: 'ACTIVE',
      openDate: '2024-02-10T00:00:00Z',
      createdAt: '2024-02-10T14:00:00Z',
    },
  ],
};

// ===========================
// BENEFICIARIES
// ===========================

export const MOCK_BENEFICIARIES: Record<string, FiBeneficiary[]> = {
  '1': [
    {
      id: 'BEN-1-1',
      registryId: '1',
      personType: 'INDIVIDUAL',
      personalId: '01025056789',
      firstName: 'Giorgi',
      lastName: 'Beridze',
      sharePercent: 45.5,
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'BEN-1-2',
      registryId: '1',
      personType: 'INDIVIDUAL',
      personalId: '01034078901',
      firstName: 'Marina',
      lastName: 'Gelashvili',
      sharePercent: 30.0,
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'BEN-1-3',
      registryId: '1',
      personType: 'ORGANIZATION',
      taxId: '400123456',
      organizationName: 'Investment Holdings LLC',
      sharePercent: 24.5,
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
  ],
  '2': [
    {
      id: 'BEN-2-1',
      registryId: '2',
      personType: 'INDIVIDUAL',
      personalId: '01045089012',
      firstName: 'Nino',
      lastName: 'Maisuradze',
      sharePercent: 35.0,
      status: 'ACTIVE',
      createdAt: '2024-02-15T11:00:00Z',
    },
    {
      id: 'BEN-2-2',
      registryId: '2',
      personType: 'INDIVIDUAL',
      personalId: '01056090123',
      firstName: 'Levan',
      lastName: 'Abashidze',
      sharePercent: 35.0,
      status: 'ACTIVE',
      createdAt: '2024-02-15T11:00:00Z',
    },
    {
      id: 'BEN-2-3',
      registryId: '2',
      personType: 'INDIVIDUAL',
      personalId: '01067001234',
      firstName: 'Tamta',
      lastName: 'Japaridze',
      sharePercent: 30.0,
      status: 'ACTIVE',
      createdAt: '2024-02-15T11:00:00Z',
    },
  ],
  '4': [
    {
      id: 'BEN-4-1',
      registryId: '4',
      personType: 'INDIVIDUAL',
      personalId: '01078012345',
      firstName: 'Tamta',
      lastName: 'Chikovani',
      sharePercent: 60.0,
      status: 'ACTIVE',
      createdAt: '2024-02-01T12:00:00Z',
    },
    {
      id: 'BEN-4-2',
      registryId: '4',
      personType: 'INDIVIDUAL',
      personalId: '01089023456',
      firstName: 'Zurab',
      lastName: 'Tsiklauri',
      sharePercent: 40.0,
      status: 'ACTIVE',
      createdAt: '2024-02-01T12:00:00Z',
    },
  ],
};

// ===========================
// AUTHORIZED PERSONS
// ===========================

export const MOCK_AUTHORIZED_PERSONS: Record<string, FiAuthorizedPerson[]> = {
  '1': [
    {
      id: 'AUTH-1-1',
      registryId: '1',
      personalId: '01025056789',
      firstName: 'Giorgi',
      lastName: 'Beridze',
      position: 'CEO',
      phone: '+995 599 123 456',
      email: 'g.beridze@georgianmicro.ge',
      authorityStartDate: '2024-01-20T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'AUTH-1-2',
      registryId: '1',
      personalId: '01034078902',
      firstName: 'Lasha',
      lastName: 'Kobakhidze',
      position: 'CFO',
      phone: '+995 577 234 567',
      email: 'l.kobakhidze@georgianmicro.ge',
      authorityStartDate: '2024-01-20T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
  ],
  '2': [
    {
      id: 'AUTH-2-1',
      registryId: '2',
      personalId: '01045089012',
      firstName: 'Nino',
      lastName: 'Maisuradze',
      position: 'Director',
      phone: '+995 595 345 678',
      email: 'n.maisuradze@tbilisicru.ge',
      authorityStartDate: '2024-02-15T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-02-15T11:00:00Z',
    },
  ],
  '4': [
    {
      id: 'AUTH-4-1',
      registryId: '4',
      personalId: '01078012345',
      firstName: 'Tamta',
      lastName: 'Chikovani',
      position: 'CEO',
      phone: '+995 598 456 789',
      email: 't.chikovani@quickloan.ge',
      authorityStartDate: '2024-02-01T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-02-01T12:00:00Z',
    },
  ],
};

// ===========================
// MANAGEMENT
// ===========================

export const MOCK_MANAGEMENT: Record<string, FiManagement[]> = {
  '1': [
    {
      id: 'MGT-1-1',
      registryId: '1',
      managementTypeCode: 'BOARD_MEMBER',
      personType: 'INDIVIDUAL',
      personalId: '01025056789',
      firstName: 'Giorgi',
      lastName: 'Beridze',
      position: 'Chairman of the Board',
      appointmentDate: '2024-01-20T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'MGT-1-2',
      registryId: '1',
      managementTypeCode: 'BOARD_MEMBER',
      personType: 'INDIVIDUAL',
      personalId: '01034078901',
      firstName: 'Marina',
      lastName: 'Gelashvili',
      position: 'Board Member',
      appointmentDate: '2024-01-20T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'MGT-1-3',
      registryId: '1',
      managementTypeCode: 'EXECUTIVE',
      personType: 'INDIVIDUAL',
      personalId: '01034078902',
      firstName: 'Lasha',
      lastName: 'Kobakhidze',
      position: 'CFO',
      appointmentDate: '2024-01-20T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-01-20T10:00:00Z',
    },
  ],
  '2': [
    {
      id: 'MGT-2-1',
      registryId: '2',
      managementTypeCode: 'DIRECTOR',
      personType: 'INDIVIDUAL',
      personalId: '01045089012',
      firstName: 'Nino',
      lastName: 'Maisuradze',
      position: 'Director',
      appointmentDate: '2024-02-15T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-02-15T11:00:00Z',
    },
    {
      id: 'MGT-2-2',
      registryId: '2',
      managementTypeCode: 'BOARD_MEMBER',
      personType: 'INDIVIDUAL',
      personalId: '01056090123',
      firstName: 'Levan',
      lastName: 'Abashidze',
      position: 'Board Member',
      appointmentDate: '2024-02-15T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-02-15T11:00:00Z',
    },
  ],
};

// ===========================
// GAPS/DEFICIENCIES
// ===========================

export const MOCK_GAPS: Record<string, FiGap[]> = {
  '3': [
    {
      id: 'GAP-3-1',
      registryId: '3',
      actionId: 'ACT-3-1',
      gapText: 'Missing audited financial statements for the last fiscal year',
      gapType: 'DOCUMENT',
      status: 'OPEN',
      createdAt: '2024-03-06T10:00:00Z',
    },
    {
      id: 'GAP-3-2',
      registryId: '3',
      actionId: 'ACT-3-1',
      gapText: 'Incomplete information about beneficial owners',
      gapType: 'INFORMATION',
      status: 'IN_PROGRESS',
      createdAt: '2024-03-06T10:15:00Z',
    },
  ],
  '5': [
    {
      id: 'GAP-5-1',
      registryId: '5',
      actionId: 'ACT-5-2',
      gapText: 'Updated business plan required for branch expansion',
      gapType: 'DOCUMENT',
      status: 'RESOLVED',
      resolvedAt: '2024-03-15T14:30:00Z',
      resolvedBy: 'supervisor2',
      resolutionNote: 'Business plan submitted and approved',
      createdAt: '2024-03-12T17:00:00Z',
    },
  ],
};

// ===========================
// QUESTIONNAIRE RESPONSES
// ===========================

export const MOCK_QUESTIONNAIRE_RESPONSES: Record<string, FiQuestionnaireResponse[]> = {
  '1': [
    {
      id: 'QR-1-1',
      registryId: '1',
      actionId: 'ACT-1-1',
      questionnaireId: '1',
      question: 'Does the organization have a valid business license?',
      answer: 'Yes',
      groupName: 'General Information',
      createdAt: '2024-01-15T11:00:00Z',
    },
    {
      id: 'QR-1-2',
      registryId: '1',
      actionId: 'ACT-1-1',
      questionnaireId: '2',
      question: 'Is the organization registered with tax authorities?',
      answer: 'Yes',
      groupName: 'General Information',
      createdAt: '2024-01-15T11:00:00Z',
    },
  ],
  '2': [
    {
      id: 'QR-2-1',
      registryId: '2',
      actionId: 'ACT-2-1',
      questionnaireId: '1',
      question: 'Does the organization have a valid business license?',
      answer: 'Yes',
      groupName: 'General Information',
      createdAt: '2024-02-10T14:30:00Z',
    },
  ],
};

// ===========================
// PROCESS HISTORY
// ===========================

export const MOCK_PROCESS_HISTORY: Record<string, FiProcessHistoryItem[]> = {
  '1': [
    {
      id: 'HIST-1-1',
      registryId: '1',
      actionType: 'REGISTRATION',
      processId: 'PROC-1-1',
      taskName: 'Initial Review',
      assignee: 'controller1',
      status: 'COMPLETED',
      startedAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-16T15:00:00Z',
      outcome: 'APPROVED',
      comments: 'All documentation is in order',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'HIST-1-2',
      registryId: '1',
      actionType: 'REGISTRATION',
      processId: 'PROC-1-1',
      taskId: 'TASK-1-2',
      taskName: 'Legal Review',
      assignee: 'legal1',
      status: 'COMPLETED',
      startedAt: '2024-01-16T15:00:00Z',
      completedAt: '2024-01-18T11:00:00Z',
      outcome: 'APPROVED',
      comments: 'Legal compliance confirmed',
      createdAt: '2024-01-16T15:00:00Z',
    },
    {
      id: 'HIST-1-3',
      registryId: '1',
      actionType: 'REGISTRATION',
      processId: 'PROC-1-1',
      taskId: 'TASK-1-3',
      taskName: 'Final Approval',
      assignee: 'admin',
      status: 'COMPLETED',
      startedAt: '2024-01-18T11:00:00Z',
      completedAt: '2024-01-20T10:00:00Z',
      outcome: 'APPROVED',
      comments: 'Registration approved and license issued',
      createdAt: '2024-01-18T11:00:00Z',
    },
  ],
  '2': [
    {
      id: 'HIST-2-1',
      registryId: '2',
      actionType: 'REGISTRATION',
      processId: 'PROC-2-1',
      taskId: 'TASK-2-1',
      taskName: 'Initial Review',
      assignee: 'controller2',
      status: 'COMPLETED',
      startedAt: '2024-02-10T14:20:00Z',
      completedAt: '2024-02-12T16:00:00Z',
      outcome: 'APPROVED',
      comments: 'Preliminary review completed',
      createdAt: '2024-02-10T14:20:00Z',
    },
    {
      id: 'HIST-2-2',
      registryId: '2',
      actionType: 'REGISTRATION',
      processId: 'PROC-2-1',
      taskId: 'TASK-2-2',
      taskName: 'Financial Review',
      assignee: 'financial1',
      status: 'IN_PROGRESS',
      startedAt: '2024-02-12T16:00:00Z',
      comments: 'Under financial assessment',
      createdAt: '2024-02-12T16:00:00Z',
    },
  ],
};

// ===========================
// CORRESPONDENCE
// ===========================

export const MOCK_CORRESPONDENCE: Record<string, FiCorrespondence[]> = {
  '1': [
    {
      id: 'CORR-1-1',
      registryId: '1',
      subject: 'Registration Application Received',
      body: 'Your registration application has been received and is under review.',
      direction: 'OUTGOING',
      correspondent: 'Georgian Microfinance LLC',
      correspondenceDate: '2024-01-15T10:35:00Z',
      registrationNumber: 'OUT-2024-001',
      createdAt: '2024-01-15T10:35:00Z',
    },
    {
      id: 'CORR-1-2',
      registryId: '1',
      subject: 'Additional Information Request',
      body: 'Please provide clarification on the organizational structure.',
      direction: 'INCOMING',
      correspondent: 'Georgian Microfinance LLC',
      correspondenceDate: '2024-01-17T09:00:00Z',
      registrationNumber: 'IN-2024-003',
      createdAt: '2024-01-17T09:00:00Z',
    },
    {
      id: 'CORR-1-3',
      registryId: '1',
      subject: 'Registration Approved',
      body: 'Your registration has been approved. License number: LIC-MFO-2024-001',
      direction: 'OUTGOING',
      correspondent: 'Georgian Microfinance LLC',
      correspondenceDate: '2024-01-20T10:05:00Z',
      registrationNumber: 'OUT-2024-008',
      createdAt: '2024-01-20T10:05:00Z',
    },
  ],
  '3': [
    {
      id: 'CORR-3-1',
      registryId: '3',
      subject: 'Gap Notification',
      body: 'Your application requires additional documentation. Please see attached list.',
      direction: 'OUTGOING',
      correspondent: 'Capital Exchange Group',
      correspondenceDate: '2024-03-06T10:30:00Z',
      registrationNumber: 'OUT-2024-025',
      createdAt: '2024-03-06T10:30:00Z',
    },
  ],
};

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
  {
    id: '3',
    name: 'Operational Information',
    description: 'Operational capacity and structure',
    sequence: 3,
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
  {
    id: '3',
    groupId: '2',
    groupName: 'Financial Information',
    fiTypeCode: 'MFO',
    question: 'What is the minimum authorized capital?',
    code: 'Q003',
    obligatory: true,
    sequence: 1,
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
    processId: 'PROC-2-1',
    processDefinitionId: 'fiRegistration:1',
    processDefinitionKey: 'fiRegistration',
    name: 'Review FI Registration - Tbilisi Credit Union',
    description: 'Review and approve FI registration application for Tbilisi Credit Union',
    assignee: 'financial1',
    state: 'ACTIVE',
    priority: 5,
    startedAt: '2024-02-12T16:00:00Z',
    dueAt: '2024-03-12T17:00:00Z',
    createdAt: '2024-02-12T16:00:00Z',
  },
  {
    id: 'task-2',
    processId: 'PROC-3-1',
    processDefinitionId: 'fiRegistration:1',
    processDefinitionKey: 'fiRegistration',
    name: 'Review Gap Response - Capital Exchange Group',
    description: 'Review submitted documentation for identified gaps',
    assignee: 'controller2',
    state: 'ACTIVE',
    priority: 8,
    startedAt: '2024-03-06T10:30:00Z',
    dueAt: '2024-03-20T17:00:00Z',
    createdAt: '2024-03-06T10:30:00Z',
  },
  {
    id: 'task-3',
    processId: 'PROC-10-1',
    processDefinitionId: 'fiRegistration:1',
    processDefinitionKey: 'fiRegistration',
    name: 'Initial Review - Agricultural Credit Union',
    description: 'Perform initial review of registration application',
    assignee: 'controller1',
    state: 'ACTIVE',
    priority: 5,
    startedAt: '2024-03-18T15:20:00Z',
    dueAt: '2024-04-01T17:00:00Z',
    createdAt: '2024-03-18T15:20:00Z',
  },
];

// ===========================
// ORGANIZATIONS (Sample)
// ===========================

export const MOCK_ORGANIZATIONS: OrganizationIndividual[] = [
  {
    id: '1',
    type: 'ORGANIZATION',
    taxId: '400123456',
    name: 'Investment Holdings LLC',
    address: '88 Kostava Street',
    city: 'Tbilisi',
    region: 'Tbilisi',
    organizationalForm: 'LLC',
    phone: '+995 32 244 5566',
    email: 'info@investholdings.ge',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'INDIVIDUAL',
    taxId: '01025056789',
    name: 'Giorgi Beridze',
    address: '12 Barnovi Street',
    city: 'Tbilisi',
    region: 'Tbilisi',
    phone: '+995 599 123 456',
    email: 'g.beridze@gmail.com',
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
