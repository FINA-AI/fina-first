import React, { useLayoutEffect, useState } from "react";
import format from "date-fns/format";
import parse from "date-fns/parse";
import formatNumber from "number-format.js";
import { getLocalStorageValue } from "../api/ui/localStorageHelper";

//TODO remove
let appContextPath = window.location.pathname.split("/")[1];
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  appContextPath = "fina-app";
}
export const BASE_REST_URL = `/${appContextPath}/rest/ui/v1`;
export const BASE_URL = `/${appContextPath}`;

export const getLanguage = () => {
  let localeArray = document.cookie
    .split(";")
    .filter((d) => d.split("=")[0].trim() === "locale");
  if (localeArray && localeArray.length === 0) {
    return getLocalStorageValue("i18nextLng", "en_US");
  }
  return localeArray && localeArray.length !== 0
    ? localeArray[0].split("=")[1]
    : "en_US";
};

export const getFileSize = (fileSize) => {
  const sizes = ["bytes", "kB", "MB", "GB", "TB", "PB"];
  if (fileSize && fileSize > 0) {
    const e = parseInt(Math.floor(Math.log(fileSize) / Math.log(1024)));
    let result = fileSize / Math.pow(1024, Math.floor(e));
    result = Math.round(result * 100) / 100;
    return result + " " + sizes[e];
  }
  return `0 ${sizes[0]}`;
};

export const getFormattedDateValue = (value, dateFormat) => {
  try {
    return format(new Date(parseInt(value)), getDateFormat(dateFormat));
  } catch (error) {
    return value;
  }
};

export const getFormattedDateTimeValue = (value, dateFormat) => {
  try {
    return format(
      new Date(parseInt(value)),
      getTimeFormat(dateFormat),
      new Date()
    );
  } catch (error) {
    return value;
  }
};

export const getTimeStampFromDateString = (dateString, dateFormat) => {
  const date = parse(dateString, dateFormat, new Date());
  return date.getTime();
};

export const checkDateFormat = (dateFormat) => {
  try {
    format(new Date(), dateFormat, new Date());
    return true;
  } catch (error) {
    return false;
  }
};

export const calendarDateFormat = (value) => {
  try {
    return format(new Date(parseInt(value)), "yyyy-MM-dd", new Date());
  } catch (error) {
    return value;
  }
};

const getTimeFormat = (dateFormat) => {
  return dateFormat ? dateFormat + " HH:mm" : getDefaultTimeFormat();
};

const getDateFormat = (dateFormat) => {
  return dateFormat ? dateFormat : getDefaultDateFormat();
};

export const getDefaultDateFormat = () => {
  return "yyyy/MM/dd";
};

export const getDefaultTimeFormat = () => {
  return "yyyy/MM/dd HH:mm";
};

export const getFormattedNumber = (value, pattern) => {
  const defaultPattern = "#,##0.####";
  return !!value
    ? formatNumber(pattern ? pattern : defaultPattern, value)
    : value;
};

export const markSearchText = (text, searchText) => {
  const index = text.toLowerCase().indexOf(searchText.toLowerCase());
  if (index >= 0) {
    return (
      <span>
        {text.substring(0, index)}
        <mark>{text.substring(index, index + searchText.length)}</mark>
        {text.substring(index + searchText.length)}
      </span>
    );
  }
};

export const hasPermission = (permission, permissions) => {
  return permissions && permissions.indexOf(permission) >= 0;
};

export const isFunction = (functionToCheck) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
};

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export const resizerMovement = (isMouseDown, clientX, resizerRef) => {
  if (isMouseDown) {
    resizerRef.current.style.display = "block";
    resizerRef.current.style.left = `${clientX}px`;
  }
};

export const getFieldsHeight = (size) => {
  switch (size) {
    case "default":
      return "36px";
    case "small":
      return "32px";
    default:
      return "40px";
  }
};

export const FileUploadStage = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  IMPORTED: "IMPORTED",
  ADDED: "ADDED",
  ERROR: "ERROR",
};

export const NumOfRowsPerPage = {
  INITIAL_ROWS_PER_PAGE: 25,
  MAX_ROWS_PER_PAGE: 500,
  MIN_ROWS_PER_PAGE: 5,
  OPTIONS: ["25", "50", "100"],
};

export const PaginationTypes = {
  PAGE: "page",
  NEXT: "next",
  PREVIOUS: "previous",
  START_ELLIPSIS: "start-ellipsis",
  END_ELLIPSIS: "end-ellipsis",
};

export const MiniPagination = {
  VISIBILITY_LIMIT: 4,
};

export const INITIAL_PAGINATION_PAGE = 1;

export const FilterTypes = {
  string: "STRING",
  number: "NUMBER",
  date: "DATE",
  list: "LIST",
  users: "USERS",
  fis: "FIS",
  country: "COUNTRY",
  datePicker: "DATE_PICKER",
  dateAndTimePicker: "DATE_AND_TIME_PICKER",
  periods: "PERIODS",
  numberBetween: "NUMBER_BETWEEN",
};

export const contextPath = appContextPath;

export const downloadErrorLogHandler = (errorText) => {
  const element = document.createElement("a");
  const file = new Blob([errorText], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = "error_log.txt";
  document.body.appendChild(element);
  element.click();
};

export const copyToClipboard = async (text) => {
  try {
    if (!text) {
      return;
    }

    if (window.isSecureContext) {
      await navigator.clipboard.writeText(
        typeof text === "object" ? text.length : text
      );
    } else {
      //DEPRECATED
      const tempDiv = document.createElement("div");
      tempDiv.contentEditable = true;
      tempDiv.style.position = "fixed";
      tempDiv.style.opacity = 0;
      tempDiv.textContent = text;
      document.body.appendChild(tempDiv);

      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");

      document.body.removeChild(tempDiv);
    }
  } catch (e) {
    console.error(e);
  }
};

export const Currencies = ["USD", "GEL", "COM"];

export const markTypes = {
  bookmark: "BOOKMARK",
  important: "IMPORTANT",
};

export const MAX_ALLOWED_FILE_SIZE = 200 * 1024 * 1024; // 200 mb

export const sortByKey = (unsortedData, sortKey) => {
  return [...unsortedData].sort((a, b) => {
    const codeA = a[sortKey]?.toLowerCase() || "";
    const codeB = b[sortKey]?.toLowerCase() || "";
    if (codeA < codeB) return -1;
    if (codeA > codeB) return 1;
    return 0;
  });
};

export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
