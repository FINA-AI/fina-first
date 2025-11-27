import axios from "axios";
import * as types from "./actionTypes";
import { BASE_REST_URL } from "../AppUtil";

export const changePeriodType = (periodType) => ({
  type: types.PERIOD_TYPE_CHANGE,
  payload: periodType,
});

export const loadConfigurationProcessing = () => {
  return { type: types.LOAD_CONFIGURATION_PROCESSING };
};

export const loadConfigurationSuccess = (response) => {
  return {
    type: types.LOAD_CONFIGURATION_SUCCESS,
    configuration: response.data,
  };
};

export const loadConfigurationFailure = (error) => {
  return { type: types.LOAD_CONFIGURATION_FAILURE, error };
};

export const loadConfiguration = () => {
  return async function (dispatch) {
    dispatch(loadConfigurationProcessing());
    try {
      const response = await axios.get(
        `${BASE_REST_URL}/dashboard/configuration`,
        {
          headers: {
            Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
          },
        }
      );
      dispatch(loadConfigurationSuccess(response));
    } catch (error) {
      dispatch(dispatch(loadConfigurationFailure(error)));
    }
  };
};

export const changeChartLabelVisibility = (isVisible) => {
  return {
    type: types.CHART_LABEL_VISIBILITY_CHANGE,
    isVisible,
  };
};
