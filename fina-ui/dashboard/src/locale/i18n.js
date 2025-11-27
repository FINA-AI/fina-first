import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en_US from "./en_US";
import ka_GE from "./ka_GE";

const resources = {
  en_US,
  ka_GE,
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguageFromCookie(),
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

function getLanguageFromCookie() {
  let localeArray = document.cookie
    .split(";")
    .filter((d) => d.split("=")[0].trim() === "locale");
  return localeArray && localeArray.length !== 0
    ? localeArray[0].split("=")[1]
    : "en_US";
}

export default i18n;
