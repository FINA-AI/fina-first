import axiosInstance from "../axios";

const PREFIX = "security/config";
export const loadConfigurationService = () => {
  return axiosInstance.get(`${PREFIX}/app`);
};

export const loadProperties = () => {
  return axiosInstance.get(`${PREFIX}/properties`);
};

export const saveProperties = (prps) => {
  return axiosInstance.post(`${PREFIX}/properties`, prps);
};


export const ping = () => {
  return axiosInstance.get(`${PREFIX}/ping`);
}

