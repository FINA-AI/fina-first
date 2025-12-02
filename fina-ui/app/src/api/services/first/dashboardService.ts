/**
 * Dashboard API Service
 */
import firstAxios from './axios';
import { FiStatistic, RegionalStatistic, YearlyStatistic } from '../../../types/first';

const PREFIX = 'ecm/dashboard';

// ===========================
// Dashboard Statistics
// ===========================

export const loadActiveFiCount = (period: 'month' | 'quarter' = 'month') => {
  return firstAxios.get<{ count: number; period: string }>(`${PREFIX}/activeFiCount`, {
    params: { period },
  });
};

export const loadFiStatisticsByType = () => {
  return firstAxios.get<FiStatistic[]>(`${PREFIX}/fiStatisticsByType`);
};

export const loadHeadOfficesRegionCount = (fiTypeCode?: string) => {
  return firstAxios.get<RegionalStatistic[]>(`${PREFIX}/headOfficesRegionCountByType`, {
    params: { fiTypeCode },
  });
};

export const loadBranchesRegionCount = (fiTypeCode?: string) => {
  return firstAxios.get<RegionalStatistic[]>(`${PREFIX}/branchesRegionCountByType`, {
    params: { fiTypeCode },
  });
};

export const loadRegistrationsByYear = (startYear: number, endYear: number) => {
  return firstAxios.get<YearlyStatistic[]>(`${PREFIX}/registrationsByYear`, {
    params: { startYear, endYear },
  });
};

export const loadCancellationsByYear = (startYear: number, endYear: number) => {
  return firstAxios.get<YearlyStatistic[]>(`${PREFIX}/cancellationsByYear`, {
    params: { startYear, endYear },
  });
};
