export const getLocalStorageValue = (key, defaultValue) => {
  const currValue = window.localStorage.getItem(key);
  return currValue !== null && currValue !== undefined
    ? currValue
    : defaultValue;
};

export const setLocalStorageValue = (key, value) => {
  if (key) {
    window.localStorage.setItem(key, value);
  }
};

export const getLocalStorageValueBoolean = (key, defaultValue) => {
  const currValue = JSON.parse(window.localStorage.getItem(key));

  if (currValue !== null && currValue !== undefined) {
    return currValue;
  }

  return defaultValue ? defaultValue : false;
};

//-------- state

export const setStateToLocalStorage = (key, value) => {
  if (key) {
    let state = JSON.parse(window.localStorage.getItem("state"));
    if (!state) {
      state = {};
    }
    state[key] = value;
    window.localStorage.setItem("state", JSON.stringify(state));
  }
};

export const getStateFromLocalStorage = () => {
  let state = JSON.parse(window.localStorage.getItem("state"));
  return state || {};
};
