/**
 * Enhanced Registration API Service with Mock Data Support
 * Additional endpoints for registration creation and regional structure
 */
import firstAxios from './axios';
import { MOCK_REGIONS, MOCK_CITIES_BY_REGION, MOCK_FI_REGISTRY } from './mockData';

const PREFIX = 'ecm/fi';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || true; // Default to true for development

// ===========================
// Regional Structure
// ===========================

export interface Region {
  id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  name: string;
}

export const loadRegions = async (): Promise<{ data: Region[] }> => {
  try {
    const response = await firstAxios.get<Region[]>(`${PREFIX}/regionalStructure/regions`);
    return { data: response.data };
  } catch (error) {
    console.warn('API failed for regions, using mock data');
    return { data: MOCK_REGIONS };
  }
};

export const loadCitiesByRegion = async (regionId: string): Promise<{ data: City[] }> => {
  try {
    const response = await firstAxios.get<City[]>(`${PREFIX}/regionalStructure/region/${regionId}/cities`);
    return { data: response.data };
  } catch (error) {
    console.warn(`API failed for cities in region ${regionId}, using mock data`);
    return { data: MOCK_CITIES_BY_REGION[regionId] || [] };
  }
};

// ===========================
// FI Search by Identity
// ===========================

export const searchFiByIdentity = async (identity: string) => {
  try {
    const response = await firstAxios.get(`${PREFIX}/search`, {
      params: { identity },
    });
    return response;
  } catch (error) {
    console.warn('API failed for FI search, using mock data');
    const mockResult = MOCK_FI_REGISTRY.find(fi => fi.code === identity);
    return {
      data: mockResult ? { list: [mockResult], totalResults: 1 } : { list: [], totalResults: 0 }
    };
  }
};

// ===========================
// Workflow Creation
// ===========================

export interface WorkflowVariable {
  name: string;
  value: any;
  type?: string;
}

export interface WorkflowCreateRequest {
  variables: Record<string, any>;
  businessKey?: string;
}

export const createWorkflow = async (
  processDefinitionKey: string,
  request: WorkflowCreateRequest
) => {
  try {
    const response = await firstAxios.post(
      `ecm/workflow/create/${processDefinitionKey}`,
      request
    );
    return response;
  } catch (error) {
    console.warn('API failed for workflow creation, returning mock response');
    return {
      data: {
        id: 'mock-process-' + Date.now(),
        processDefinitionId: processDefinitionKey + ':1',
        processDefinitionKey,
        businessKey: request.businessKey,
        variables: request.variables,
        startedAt: new Date().toISOString(),
      }
    };
  }
};

// ===========================
// Legal Forms
// ===========================

export interface LegalForm {
  value: string;
  label: string;
}

export const loadLegalForms = async (identityLength: number): Promise<{ data: LegalForm[] }> => {
  const allForms: LegalForm[] = [
    { value: 'ltd', label: 'Limited Liability Company' },
    { value: 'joinsStockCompany', label: 'Joint Stock Company' },
    { value: 'solidaritySociety', label: 'Solidarity Society' },
    { value: 'commandantSociety', label: 'Commandant Society' },
    { value: 'cooperative', label: 'Cooperative' },
    { value: 'individualEntrepreneur', label: 'Individual Entrepreneur' },
  ];

  // If 11-digit identity, only individual entrepreneur
  if (identityLength === 11) {
    return { data: allForms.filter(f => f.value === 'individualEntrepreneur') };
  }

  // If 9-digit identity, exclude individual entrepreneur
  return { data: allForms.filter(f => f.value !== 'individualEntrepreneur') };
};

// ===========================
// FI Type Validation
// ===========================

export interface FiTypeValidation {
  allowedTypes: string[];
  restrictions: string[];
  canRegister: boolean;
}

export const validateFiTypeForIdentity = async (
  identity: string,
  selectedFiType: string
): Promise<{ data: FiTypeValidation }> => {
  try {
    const response = await firstAxios.get<FiTypeValidation>(
      `${PREFIX}/validate/fiType`,
      {
        params: { identity, fiType: selectedFiType },
      }
    );
    return { data: response.data };
  } catch (error) {
    console.warn('API failed for FI type validation, using mock validation');

    // Mock validation logic based on Ext JS rules
    const existingFi = MOCK_FI_REGISTRY.find(fi => fi.code === identity);

    if (!existingFi) {
      return {
        data: {
          allowedTypes: ['LE', 'MFO', 'FEX', 'CRU'],
          restrictions: [],
          canRegister: true,
        }
      };
    }

    // Business rules from Ext JS
    const restrictions: string[] = [];
    let allowedTypes: string[] = [];

    if (existingFi.fiTypeCode === 'MFO' || existingFi.fiTypeCode === 'CRU') {
      restrictions.push('MFO or CRU cannot have additional FI registrations');
      allowedTypes = [];
    } else if (existingFi.fiTypeCode === 'LE' && existingFi.status === 'ACCEPTED') {
      restrictions.push('Active LE cannot register MFO or CRU');
      allowedTypes = ['FEX'];
    } else if (existingFi.fiTypeCode === 'FEX' && existingFi.status === 'ACCEPTED') {
      restrictions.push('Active FEX cannot register MFO or CRU');
      allowedTypes = ['LE'];
    }

    return {
      data: {
        allowedTypes,
        restrictions,
        canRegister: allowedTypes.length > 0,
      }
    };
  }
};

// ===========================
// Copy Data from Existing FI
// ===========================

export const copyDataFromExistingFi = async (fiId: string) => {
  try {
    const response = await firstAxios.get(`${PREFIX}/${fiId}/copy-data`);
    return response;
  } catch (error) {
    console.warn('API failed for copy FI data, using mock data');
    const existingFi = MOCK_FI_REGISTRY.find(fi => fi.id === fiId);

    if (existingFi) {
      return {
        data: {
          legalFormType: 'ltd',
          name: existingFi.name,
          legalAddressRegion: '1',
          legalAddressCity: 'TB-1',
          legalAddress: '123 Main Street, Tbilisi',
        }
      };
    }

    return { data: null };
  }
};
