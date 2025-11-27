import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../../../api/ui/localStorageHelper";
import { getRandomFillAndStrokeColor } from "./chartUtil";
import {
  DashletDataType,
  DashletStyleType,
} from "../../../types/dashboard.type";

export const getChartDataKey = (obj: any): string => {
  if (obj) {
    const foundEntry = Object.entries(obj).find(([key, value]) => {
      return (
        typeof value === "string" &&
        !key.toLowerCase().startsWith("f_") &&
        !key.toLowerCase().startsWith("d_")
      );
    });
    if (foundEntry) {
      return foundEntry[0];
    }
    return "";
  }
  return "name";
};

export const getDataValueKeys = (obj: any): string[] => {
  if (obj) {
    return Object.keys(obj).filter(
      (key) =>
        !key.toLowerCase().startsWith("f_") &&
        typeof obj[key] === "number" &&
        !key.toLowerCase().startsWith("d_")
    );
  }
  return [];
};

const setColorsToLocalstorage = (
  storedStylesArr: DashletStyleType[],
  id: number,
  chartStyles: DashletStyleType | DashletStyleType[]
) => {
  setLocalStorageValue(
    "dashletColors",
    JSON.stringify([
      ...storedStylesArr,
      {
        id: id,
        style: chartStyles,
      },
    ])
  );
};

export const getDashletColors = (
  id: number | undefined,
  chartType: string,
  data: DashletDataType[]
) => {
  if (id) {
    let storedStyles = getLocalStorageValue("dashletColors");
    let storedStylesArr = storedStyles ? JSON.parse(storedStyles) : [];
    if (
      chartType === "RADARCHART" ||
      chartType === "AREACHART" ||
      chartType === "BARCHART" ||
      chartType === "STACKEDAREACHART"
    ) {
      let currChartItem: DashletStyleType | undefined;
      storedStylesArr.forEach(
        (item: { id: number; style: { fill: string; stroke: string } }) => {
          if (item.id === id) {
            currChartItem = item.style;
            return;
          }
        }
      );
      if (currChartItem) {
        return currChartItem;
      } else {
        const randomChartStyle = getRandomFillAndStrokeColor();
        setColorsToLocalstorage(storedStylesArr, id, randomChartStyle);

        return randomChartStyle;
      }
    } else if (chartType === "STACKEDBARCHART" || chartType === "LINECHART") {
      let currItemStyles: DashletStyleType[] = [];
      storedStylesArr.forEach(
        (obj: { id: number; style: DashletStyleType[] }) => {
          if (obj.id === id) {
            currItemStyles = obj.style;
            return;
          }
        }
      );
      if (currItemStyles.length > 0) {
        return currItemStyles;
      } else {
        let newColorsArr: DashletStyleType[] = [];
        getDataValueKeys(data[0]).forEach(() => {
          const randomChartStyle = getRandomFillAndStrokeColor();
          newColorsArr.push(randomChartStyle);
        });
        setColorsToLocalstorage(storedStylesArr, id, newColorsArr);
        return newColorsArr;
      }
    } else if (chartType === "PIECHART") {
      let currItemStyles: { fill: string; stroke: string }[] =
        storedStylesArr.find((obj: { id: number; style: {} }) => {
          return obj.id === id;
        })?.style;
      if (currItemStyles?.length > 0) {
        return currItemStyles;
      } else {
        let colorArr: { fill: string; stroke: string }[] = [];
        data?.forEach(() => {
          const colors = getRandomFillAndStrokeColor();
          colorArr.push(colors);
        });
        currItemStyles = colorArr;
        setColorsToLocalstorage(storedStylesArr, id, colorArr);
        return currItemStyles;
      }
    }
  } else {
    let colors: any = [];
    data.forEach(() => {
      colors.push(getRandomFillAndStrokeColor());
    });
    return colors;
  }
};
