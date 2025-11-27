import configReducer from "./reducers/configReducer";
import stateReducer from "./reducers/stateReducer";
import { combineReducers } from "redux-immutable";
import catalogReducer from "./reducers/catalogReducer";
import fiPhysicalPersonReducer from "./reducers/fiPhysicalPersonReducer";
import fiManagementReducer from "./reducers/fiManagementReducer";
import fiLegalPersonReducer from "./reducers/fiLegalPersonReducer";
import fiBeneficiaryReducer from "./reducers/fiBeneficiaryReducer";
import fiLicenseReducer from "./reducers/fiLicenseReducer";
import fiReducer from "./reducers/fiReducer";
import userReducer from "./reducers/userReducer";
import groupReducer from "./reducers/groupReducer";
import messagedReducer from "./reducers/messagesReducer";
import returnCreationScheduleReducer from "./reducers/returnCreationScheduleReducer";
import userFileSpaceReducer from "./reducers/userFileSpaceReducer";
import languageReducer from "./reducers/languageReducer";
import communicatorWebsocketReducer from "./reducers/communicatorWebsocketReducer";
import notificationWebsocketReducer from "./reducers/notificationWebsocketReducer";
import sidebarReducer from "./reducers/sidebarReducer";
import uiReducer from "./reducers/uiReducer";

export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    catalog: catalogReducer,
    ui: uiReducer,
    config: configReducer,
    state: stateReducer,
    fiPhysicalPerson: fiPhysicalPersonReducer,
    fiManagement: fiManagementReducer,
    fiLegalPerson: fiLegalPersonReducer,
    fiBeneficiary: fiBeneficiaryReducer,
    fiLicense: fiLicenseReducer,
    fi: fiReducer,
    user: userReducer,
    group: groupReducer,
    messages: messagedReducer,
    returnCreationSchedule: returnCreationScheduleReducer,
    userFileSpace: userFileSpaceReducer,
    language: languageReducer,
    communicatorWebsocket: communicatorWebsocketReducer,
    notificationWebSocket: notificationWebsocketReducer,
    openSidebar: sidebarReducer,
    ...injectedReducers,
  });
}
