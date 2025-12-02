/**
 * Axios instance for FIRST module API calls
 */
import axios from 'axios';
import qs from 'qs';
import { BASE_URL, getLanguage } from '../../../util/appUtil';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// FIRST module uses /fina-app/rest/first/v1 as base URL
const FIRST_BASE_URL = `${BASE_URL}/rest/first/v1`;

const firstAxiosInstance = axios.create({
  baseURL: FIRST_BASE_URL,
  timeout: 60000,
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
  headers: {
    'Accept-Language': getLanguage(),
    'FINA-APP-NAME': 'FIRST',
    'TimeZoneId': timeZone,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Session expiry interceptor (same as main app)
if (!isDevMode) {
  firstAxiosInstance.interceptors.response.use((response) => {
    if (
      response &&
      response.request &&
      response.request.responseURL &&
      response.headers['content-type'] === 'text/html' &&
      response.data.indexOf('j_security_check')
    ) {
      window.location.replace(`${window.location.origin}/fina-app/ui/index.html`);
    }
    if (
      response.headers['content-type'] &&
      response.headers['content-type'].includes('text/html') &&
      !response.config.url.endsWith('.html')
    ) {
      window.location.href = `${window.location.origin}/fina-app/ui/index.html`;
      return Promise.reject(new Error('Session expired'));
    }
    return response;
  });
}

export default firstAxiosInstance;
