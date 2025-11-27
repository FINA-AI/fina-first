import axiosInstance from "../axios";

const PREFIX = "/overduereturns";

export const loadOverdueReturns = (page, limit, columnFilter) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      ...columnFilter,
    },
  });
};

export const exportOverdueReturns = (columnFilter) => {
    return axiosInstance.get(`${PREFIX}/export`, {
        params: {
            ...columnFilter
          },
    })
}