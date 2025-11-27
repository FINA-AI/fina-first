import axios from "axios";
import { BASE_URL } from "../../util/appUtil";
import qs from "qs";

const instance = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 30000,
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});
export const loadLanguages = () => {
  return instance.get(`/rest/v1/anonymous/languages`);
};
