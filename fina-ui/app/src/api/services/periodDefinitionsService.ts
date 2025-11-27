import axiosInstance from "../axios";
import { FilterType } from "../../types/common.type";
import { PeriodSubmitDataType } from "../../types/period.type";

const PREFIX = "/period";

export const getPeriodDefinitions = (
  page?: number,
  limit?: number,
  filter: FilterType = {},
  sortField?: string,
  sortDir?: string
) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      sortField: sortField,
      sortDir: sortDir,
      ...filter,
    },
  });
};
export const getFilteredPeriods = (filter: FilterType = {}) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      ...filter,
    },
  });
};

export const deletePeriodDefinition = (periodId: number) => {
  return axiosInstance.delete(`${PREFIX}/${periodId}`);
};

export const deletePeriodsDefinitions = (data: number[]) => {
  return axiosInstance.delete(`${PREFIX}`, { data });
};

export const savePeriodDefinition = (
  periodDefinition: PeriodSubmitDataType,
  daysBetweenPeriod: number,
  daysInPeriods: number
) => {
  return axiosInstance.post(
    `${PREFIX}/${periodDefinition["startPeriodNumber"]}/${periodDefinition["periodNumber"]}/${daysBetweenPeriod}/${daysInPeriods}/`,
    periodDefinition
  );
};

