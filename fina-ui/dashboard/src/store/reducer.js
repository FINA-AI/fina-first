import * as types from "./actionTypes";

const initialState = {
  periodType: "Q",
  isQuarter: true,
  configuration: null,
  isChartLabelVisible: false,
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case types.PERIOD_TYPE_CHANGE:
      return {
        ...state,
        periodType: action.payload ? "Q" : "M",
        isQuarter: action.payload,
      };
    case types.LOAD_CONFIGURATION_PROCESSING:
      return {
        ...state,
        configuration: {
          processing: true,
          success: false,
          fail: false,
          data: null,
        },
      };
    case types.LOAD_CONFIGURATION_SUCCESS:
      return {
        ...state,
        configuration: {
          processing: false,
          success: true,
          fail: false,
          data: action.configuration,
        },
      };
    case types.LOAD_CONFIGURATION_FAILURE:
      return {
        ...state,
        configuration: {
          processing: false,
          success: false,
          fail: true,
          data: null,
        },
      };
    case types.CHART_LABEL_VISIBILITY_CHANGE:
      return {
        ...state,
        isChartLabelVisible: action.isVisible,
      };
    default:
      return { ...state };
  }
}
