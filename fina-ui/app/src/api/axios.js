import axios from "axios";
import qs from "qs";
import { BASE_REST_URL, BASE_URL, getLanguage } from "../util/appUtil";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isDevMode =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

axios.defaults.headers.common["Accept-Language"] = getLanguage();
axios.defaults.headers.common["FINA-APP-NAME"] = "FINA";
axios.defaults.headers.common["TimeZoneId"] = timeZone;
axios.defaults.headers.common["Cache-Control"] = "no-cache";
axios.defaults.headers.common["Pragma"] = "no-cache";
axios.defaults.headers.common["Expires"] = "0";

const instance = axios.create({
  baseURL: `${BASE_REST_URL}`,
  timeout: 60000,
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

export const emsInstance = axios.create({
  baseURL: `${BASE_URL}/rest/ems/v1`,
  timeout: 60000,
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

if (!isDevMode) {
  instance.interceptors.response.use((response) => {
    if (
      response &&
      response.request &&
      response.request.responseURL &&
      response.headers["content-type"] === "text/html" &&
      response.data.indexOf("j_security_check")
    ) {
      window.location.replace(
        `${window.location.origin}/fina-app/ui/index.html`
      );
    }
    if (
      response.headers["content-type"] &&
      response.headers["content-type"].includes("text/html") &&
      !response.config.url.endsWith(".html")
    ) {
      window.location.href = `${window.location.origin}/fina-app/ui/index.html`;
      return Promise.reject(new Error("Session expired"));
    }
    return response;
  });

  emsInstance.interceptors.response.use((response) => {
    if (
      response &&
      response.request &&
      response.request.responseURL &&
      response.headers["content-type"] === "text/html" &&
      response.data.indexOf("j_security_check")
    ) {
      window.location.replace(
        `${window.location.origin}/fina-app/ui/index.html`
      );
    }
    if (
      response.headers["content-type"] &&
      response.headers["content-type"].includes("text/html") &&
      !response.config.url.endsWith(".html")
    ) {
      window.location.href = `${window.location.origin}/fina-app/ui/index.html`;
      return Promise.reject(new Error("Session expired"));
    }

    return response;
  });
}

export default instance;
