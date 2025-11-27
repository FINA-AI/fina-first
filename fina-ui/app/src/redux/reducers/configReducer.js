import {
  LOAD_CONFIG,
  LOAD_CONFIG_ERROR,
  LOAD_CONFIG_SUCCESS,
} from "../constants/configConstants";
import { PERMISSIONS } from "../../api/permissions";
import { setLocalStorageValue } from "../../api/ui/localStorageHelper";
import { getLanguage } from "../../util/appUtil";

const initialState = {
  config: {
    menuItems: [],
    userName: "NONAME",
    userNameDescriptions: "NONAME",
  },
  isLoading: true,
  error: null,
};

const langCode = getLanguage();
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_CONFIG:
      return {
        ...state,
        isLoading: true,
      };
    case LOAD_CONFIG_SUCCESS:
      setLocalStorageValue(
        "fina_translations_version",
        action.payload["i18nTranslationVersion"]
      );

      action.payload["isInternalUser"] = action.payload["permissions"].includes(
        PERMISSIONS.INTERNAL_USER
      );
      return {
        ...state,
        config: {
          ...action.payload,
          userNameDescriptions: action.payload.userNameDescriptions,
          userName: action.payload.userNameDescriptions[langCode],
          menuItems: action.payload.menu.children,
        },
        error: null,
        isLoading: false,
      };
    case LOAD_CONFIG_ERROR:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
      };
    default:
      return state;
  }
}
