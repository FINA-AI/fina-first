import { loadConfigurationService } from "../../api/services/configService";
import * as types from "../constants/configConstants";
import { PERMISSIONS } from "../../api/permissions";
import { initCommunicatorWebSocketAction } from "./communicatorWebsocketActions";
import { initNotificationWebSocketAction } from "./notificationWebsocketActions";

export const loadConfig = () => {
  return {
    type: types.LOAD_CONFIG,
  };
};

export const loadConfigSuccess = (config) => {
  return {
    type: types.LOAD_CONFIG_SUCCESS,
    payload: config,
  };
};

export const loadConfigFailure = (error) => {
  return {
    type: types.LOAD_CONFIG_ERROR,
    payload: { error: error },
  };
};

export async function loadConfiguration(dispatch) {
  dispatch(loadConfig());
  await loadConfigurationService()
    .then((response) => {
      const config = response.data;
      dispatch(loadConfigSuccess(config));

      initCommunicatorWebSocket(config, dispatch);
      initNotificationsWebSocket(config, dispatch);
    })
    .catch((error) => {
      dispatch(loadConfigFailure(error));
    });
}

const initCommunicatorWebSocket = (config, dispatch) => {
  if (
    config.permissions &&
    config.permissions.includes(PERMISSIONS.COMMUNICATOR_MESSAGES_REVIEW)
  ) {
    dispatch(initCommunicatorWebSocketAction);
  }
};

const initNotificationsWebSocket = (config, dispatch) => {
  if (
    config.permissions &&
    config.permissions.includes(PERMISSIONS.FINA_NOTIFICATIONS)
  ) {
    dispatch(initNotificationWebSocketAction);
  }
};
