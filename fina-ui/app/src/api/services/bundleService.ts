import axios from "axios";
import { BASE_URL } from "../../util/appUtil";

const PREFIX = `${BASE_URL}/rest/ui/v1/locales`;

export const loadBundles = () => {
  return axios.get(`${PREFIX}/all`);
};

export const updateBundles = (
  data: { key: string; langCode: string; value: string }[]
) => {
  return axios.put(`${PREFIX}`, data);
};
