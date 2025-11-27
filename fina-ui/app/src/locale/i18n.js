import i18n from "i18next";
import axios from "../api/axios";
import ChainedBackend from "i18next-chained-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../api/ui/localStorageHelper";
import { contextPath } from "../util/appUtil";
import { loadLanguages } from "../api/services/anonymousService";

const LANGUAGE_CODES_KEY = "fina_lang_codes";
const EN_US = "en_US";
export const DEFAULT_LANGUAGE = EN_US;
const parseLanguageCodesFromLocalStorage = () => {
  const languageCodes = getLocalStorageValue(LANGUAGE_CODES_KEY);
  if (languageCodes) {
    return languageCodes.split(",");
  }

  return [];
};
const languageCodes = parseLanguageCodesFromLocalStorage();

const initI18n = (supportedLanguages) => {
  const isDevMode =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  const getTranslationVersion = () => {
    return getLocalStorageValue("fina_translations_version", "1.0");
  };

  const HASH = getTranslationVersion();
  i18n
    .use(ChainedBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: supportedLanguages,
      debug: false,
      whitelist: supportedLanguages,
      react: {
        useSuspense: false,
      },

      backend: {
        backends: [LocalStorageBackend, HttpApi],
        backendOptions: [
          {
            expirationTime: 30 * 24 * 60 * 60 * 1000, // 30 days
            defaultVersion: "v" + HASH,
          },
          {
            loadPath: `/${contextPath}/rest/ui/v1/locales/{{lng}}`,
          },
        ],
      },
      nsSeparator: false,
    })
    .then(() => {
      console.info("i18n initialized!");
      if (isDevMode) {
        i18n.languages.forEach((lang) =>
          console.warn(i18n.getDataByLanguage(lang))
        );
      }
    });

  i18n.on("languageChanged", (lang) => {
    document.cookie = `locale=${lang};path=/${contextPath}`;

    axios.defaults.headers.common["Accept-Language"] = lang;
  });
};

if (languageCodes.length > 0) {
  // ignore language loading from server
  initI18n(languageCodes);
} else {
  //load languages from server
  loadLanguages().then((resp) => {
    if (resp.data && resp.data?.length > 0) {
      const supportedLanguages = resp.data.map((l) => l.code.trim());
      setLocalStorageValue(LANGUAGE_CODES_KEY, supportedLanguages);
      initI18n(supportedLanguages);
    } else {
      initI18n([DEFAULT_LANGUAGE]);
    }
  });
}

export default i18n;
