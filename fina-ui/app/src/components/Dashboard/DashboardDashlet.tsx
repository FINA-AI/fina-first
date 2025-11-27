import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import GridTable from "../common/Grid/GridTable";
import CustomPieChart from "../common/Chart/CustomPieChart";
import CustomBarChart from "../common/Chart/CustomBarChart";
import { getDashletData } from "../../api/services/dashboardService";
import { IconButton, Typography } from "@mui/material";
import CustomSimpleAreaChart from "../common/Chart/CustomSimpleAreaChart";
import CustomSimpleBarChart from "../common/Chart/CustomSimpleBarChart";
import CustomSimpleLineChart from "../common/Chart/CustomSimpleLineChart";
import CustomStackedAreaChart from "../common/Chart/CustomStackedAreaChart";
import CustomStackedBarChart from "../common/Chart/CustomStackedBarChart";
import DashboardFilter from "./DashboardFilter/DashboardFilter";
import CustomRadarChart from "../common/Chart/CustomRadarChart";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import {
  FilterTypes,
  getDefaultDateFormat,
  getFormattedDateValue,
} from "../../util/appUtil";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  getLocalStorageValue,
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../api/ui/localStorageHelper";
import { DashletDataType, DashletType } from "../../types/dashboard.type";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../types/common.type";
import { styled } from "@mui/material/styles";

interface DashboardDashletProps {
  item: DashletType;
}

interface FilterType {
  type: string;
  name: string;
  start?: number;
  end?: number;
  date?: number;
  value?: string;
}

const StyledDashletHeader = styled(Box)(({ theme }: any) => ({
  borderRadius: "10px 10px 0px 0px",
  borderBottom: theme.palette.borderColor,
  padding: "9px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box",
  marginBottom: "10px",
}));

const StyledDashboard = styled(Box)({
  display: "flex",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  minHeight: 0,
});

const StyledContentWrapper = styled(Box)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  borderRadius: 4,
  filter: "drop-shadow(0px 2px 10px rgba(0, 0, 0, 0.08))",
  boxShadow:
    theme.palette.mode === "dark" ? "0px 0px 10px 4px rgb(21 23 27 / 90%)" : "",
}));

const DashboardDashlet: React.FC<DashboardDashletProps> = ({ item }) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isChartTypeTable =
    JSON.parse(item.metaInfoJson).selectedType === "TABLE";

  const [originalDashletData, setOriginalDashletData] = useState<
    DashletDataType[]
  >([]);
  const [dashletData, setDashletData] = useState<DashletDataType[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(isChartTypeTable);
  const [loading, setLoading] = useState<boolean>(true);
  const [headerColumns, setHeaderColumns] = useState<GridColumnType[]>([]);
  const [headerColumnsConfig, setHeaderColumnsConfig] = useState<
    columnFilterConfigType[]
  >([]);
  const [chartColors, setChartColors] = useState({});

  useEffect(() => {
    initDashletData();
    let val = getLocalStorageValue("dashletColors");
    if (val) {
      let arr = JSON.parse(val);
      arr.forEach((obj: { id: number; style: {}[] }) => {
        obj.id === item.id && setChartColors(obj.style);
      });
    }
  }, [item.id]);

  useEffect(() => {
    setLoading(false);
  }, [isFilterOpen]);

  useEffect(() => {
    setHeaderColumns(generateColumns());
    setHeaderColumnsConfig(generateColumnsConfig());
  }, [originalDashletData]);

  useEffect(() => {
    if (isFilterOpen) {
      setHeaderColumns(generateColumns());
    }
  }, [isFilterOpen]);

  const initDashletData = () => {
    getDashletData(item.id)
      .then((res) => {
        setOriginalDashletData(res.data);
        setDashletData(res.data);
        onFilterFunctionCall(res.data);
      })
      .catch((e) => openErrorWindow(e, t("error"), true))
      .finally(() => {
        setLoading(false);
      });
  };

  const getDashboardFiltersFromLocalStorage = () => {
    const state = getStateFromLocalStorage();
    if (state && state["dashboardFilters"]) {
      let localFilters = state["dashboardFilters"];
      return localFilters;
    }
  };

  const onFilterFunctionCall = (data: DashletDataType[]) => {
    let filters = getDashboardFiltersFromLocalStorage();
    if (filters) {
      if (filters[item.id]) {
        let newObj = filters[item.id];
        filterOnChangeFunction(newObj, data);
      }
    }
  };

  const sqlLikeMatch = (text: string, pattern: string) => {
    // SQL % search generator
    const regexPattern =
      "^" + pattern.split("_").join(".").split("%").join(".*") + "$";
    const regex = new RegExp(regexPattern, "i"); // 'i' case sensitive
    return regex.test(text);
  };

  const filterOnChangeFunction = (
    obj: columnFilterConfigType[],
    data?: DashletDataType[]
  ) => {
    let isFilterEmpty = true;

    if (obj) {
      for (let item of obj) {
        if (item.value || item.end || item.start) {
          isFilterEmpty = false;
          break;
        }
      }
    }

    if (isFilterEmpty) {
      setDashletData(originalDashletData);
      let localFilters = getDashboardFiltersFromLocalStorage();
      if (localFilters) {
        delete localFilters[item.id];
        setStateToLocalStorage("dashboardFilters", localFilters);
      }
    } else {
      let filteredData = data ? data : [...originalDashletData];

      obj.forEach((filter: columnFilterConfigType) => {
        if (filter.value || filter.end || filter.start) {
          if (filter.type === "STRING" && filter.value) {
            const pattern = filter.value;
            filteredData = filteredData.filter((item: DashletDataType) => {
              if (filter.name) {
                if (typeof item[filter.name] === "string") {
                  return sqlLikeMatch(item[filter.name] as string, pattern);
                } else if (typeof item[filter.name] === "number") {
                  return item[filter.name].toString().includes(pattern);
                }
                return true;
              }
            });
          } else if (filter.type === "NUMBER_BETWEEN" && filter.name) {
            filteredData = filteredData.filter((item: DashletDataType) => {
              if (filter.name) {
                if (typeof item[filter.name] === "number") {
                  if (filter.start && filter.end) {
                    return (
                      item[filter.name] >= filter.start &&
                      item[filter.name] <= filter.end
                    );
                  } else if (filter.start) {
                    return item[filter.name] >= filter.start;
                  } else if (filter.end) {
                    return item[filter.name] <= filter.end;
                  }
                }
                return true;
              }
            });
          } else if (filter.type === "DATE") {
            filteredData = filteredData.filter((item) => {
              const dateValue = filter.name && new Date(item[filter.name]);
              if (dateValue instanceof Date && filter.start && filter.end) {
                return (
                  dateValue.getTime() >= filter.start &&
                  dateValue.getTime() <= filter.end
                );
              }
              return true;
            });
          }
        }
      });

      setDashletData(filteredData);

      let filtersArr: FilterType[] = [];

      for (let o of obj) {
        let filter: FilterType = {} as FilterType;
        if (o.value || o.start || o.end) {
          switch (o.type) {
            case FilterTypes.date:
              if (o.start) {
                filter["start"] = o.start;
              }
              if (o.end) {
                filter["end"] = o.end;
              }
              if (o.type && o.name) {
                filter["type"] = o.type;
                filter["name"] = o.name;
              }
              break;
            case FilterTypes.numberBetween:
              if (o.start) {
                filter["start"] = o.start;
              }
              if (o.end) {
                filter["end"] = o.end;
              }
              if (o.type && o.name) {
                filter["type"] = o.type;
                filter["name"] = o.name;
              }
              break;
            case FilterTypes.string:
              if (o.type && o.name && o.value) {
                filter["name"] = o.name;
                filter["value"] = o.value;
                filter["type"] = o.type;
              }
              break;
            default:
              if (o.type && o.name && o.value) {
                filter["name"] = o.name;
                filter["value"] = o.value;
                filter["type"] = o.type;
              }
              break;
          }
          filtersArr.push(filter);
        }
      }
      let localFilters = getDashboardFiltersFromLocalStorage();
      if (localFilters) {
        setStateToLocalStorage("dashboardFilters", {
          ...localFilters,
          [item.id]: filtersArr,
        });
      } else {
        setStateToLocalStorage("dashboardFilters", {
          [item.id]: filtersArr,
        });
      }
    }
  };

  const generateColumns = () => {
    let colsConfig = generateColumnsConfig();
    let cols: GridColumnType[] = [];

    if (originalDashletData && originalDashletData?.length > 0) {
      const chartWidth = ref?.current?.clientWidth;
      const gridColWidth = 150;
      const gridColSize = Object.keys(originalDashletData[0]).length;
      let isFlexColumn = true;

      if (chartWidth && gridColSize * gridColWidth > chartWidth) {
        isFlexColumn = false;
      }

      Object.keys(originalDashletData[0]).forEach((item) => {
        if (/^d_/i.test(item)) {
          if (isFilterOpen) {
            cols.push({
              field: item,
              headerName: item,
              width: isFlexColumn ? 0 : gridColWidth,
              filter: colsConfig.find(
                (f: columnFilterConfigType) => f.field === item
              ),
              renderCell: (value: string) => {
                return (
                  <span>
                    {getFormattedDateValue(value, getDefaultDateFormat())}
                  </span>
                );
              },
            });
          }
        } else if (/^f_/i.test(item)) {
          if (isFilterOpen) {
            cols.push({
              field: item,
              headerName: item,
              width: isFlexColumn ? 0 : gridColWidth,
              filter: colsConfig.find(
                (f: columnFilterConfigType) => f.field === item
              ),
            });
          }
        } else {
          cols.push({
            field: item,
            headerName: item,
            width: isFlexColumn ? 0 : gridColWidth,
            filter: colsConfig.find(
              (f: columnFilterConfigType) => f.field === item
            ),
          });
        }
      });
    }
    return cols;
  };

  const getStateFilterValue = (key: string, colName: string) => {
    let filters = getDashboardFiltersFromLocalStorage();

    if (filters) {
      let obj = filters[item.id];
      if (obj) {
        for (let o of obj) {
          if (o.name === colName) {
            return o[key];
          }
        }
      }
    }
  };

  const generateColumnsConfig = () => {
    let columnFilterConfig: columnFilterConfigType[] = [];

    if (originalDashletData && originalDashletData?.length > 0) {
      Object.keys(originalDashletData[0]).forEach((item) => {
        if (
          typeof originalDashletData[0][item] === "number" &&
          !/^d_/i.test(item)
        ) {
          columnFilterConfig.push({
            field: item,
            type: FilterTypes.numberBetween,
            name: item,
            start: getStateFilterValue("start", item),
            end: getStateFilterValue("end", item),
          });
        } else if (/^d_/i.test(item)) {
          columnFilterConfig.push({
            field: item,
            type: FilterTypes.date,
            name: item,
            start: getStateFilterValue("start", item),
            end: getStateFilterValue("end", item),
          });
        } else if (typeof originalDashletData[0][item] === "string") {
          columnFilterConfig.push({
            field: item,
            type: FilterTypes.string,
            name: item,
            value: getStateFilterValue("value", item),
          });
        }
      });
    }

    return columnFilterConfig;
  };

  const getChart = (item: DashletType) => {
    if (item.metaInfoJson) {
      const obj = JSON.parse(item.metaInfoJson);
      const selectedType = obj.selectedType;
      const selectedChart = obj.selectedChart;
      if (dashletData && dashletData.length > 0) {
        if (selectedType === "TABLE") {
          return (
            <Box width={"100%"}>
              <GridTable
                columns={generateColumns()}
                rows={dashletData}
                setRows={setDashletData}
                selectedRows={[]}
                size={"small"}
                disableRowSelection={true}
                viewMode={true}
                virtualized={true}
                loading={false}
              />
            </Box>
          );
        } else if (selectedType === "CHART") {
          switch (selectedChart) {
            case "SIMPLEAREACHART":
              return (
                <CustomSimpleAreaChart
                  data={dashletData}
                  style={chartColors}
                  id={item.id}
                />
              );
            case "SIMPLEBARCHART":
              return (
                <CustomSimpleBarChart
                  data={dashletData}
                  style={chartColors}
                  id={item.id}
                />
              );
            case "SIMPLELINECHART":
              return (
                <CustomSimpleLineChart
                  data={dashletData}
                  style={chartColors}
                  id={item.id}
                />
              );
            case "STACKEDAREACHART":
              return (
                <CustomStackedAreaChart
                  data={dashletData}
                  style={chartColors}
                  id={item.id}
                />
              );
            case "STACKEDBARCHART":
              return (
                <CustomStackedBarChart
                  data={dashletData}
                  style={chartColors}
                  id={item.id}
                />
              );
            case "PIECHART":
              return (
                <CustomPieChart
                  data={dashletData}
                  innerRadius={55}
                  outerRadius={100}
                  id={item.id}
                />
              );
            case "BARCHART":
              return <CustomBarChart data={dashletData} />;
            case "COLUMN":
              return <CustomBarChart columnChart={true} data={dashletData} />;
            case "RADAR":
              return (
                <CustomRadarChart
                  data={dashletData}
                  style={chartColors}
                  id={item.id}
                />
              );
          }
        }
      }
    }
  };

  return (
    <Box
      minHeight={"350px"}
      maxHeight={"350px"}
      padding={"10px"}
      ref={ref}
      data-testid={"dashlet-container"}
    >
      <StyledContentWrapper>
        <StyledDashletHeader data-testid={"header"}>
          <Box display={"flex"} width={"100%"} justifyContent={"space-between"}>
            <Typography
              sx={{ fontWeight: 600, fontSize: "13px", lineHeight: "20px" }}
            >
              {item.name}
            </Typography>
            {!isChartTypeTable &&
              (isFilterOpen ? (
                <IconButton
                  onClick={() => {
                    setIsFilterOpen(false);
                  }}
                  data-testid={"filter-icon-button"}
                >
                  <DashboardIcon sx={{ width: "16px", height: "16px" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setIsFilterOpen(true);
                    setLoading(true);
                  }}
                  data-testid={"filter-icon-button"}
                >
                  <FilterListRoundedIcon
                    sx={{ width: "16px", height: "16px" }}
                  />
                </IconButton>
              ))}
          </Box>
        </StyledDashletHeader>

        <StyledDashboard data-testid={"body"}>
          {isFilterOpen ? (
            <DashboardFilter
              generateColumns={headerColumns}
              generateColumnsConfig={headerColumnsConfig}
              loading={loading}
              filterOnChangeFunction={(obj) => filterOnChangeFunction(obj)}
              previewData={dashletData}
              setPreviewData={setDashletData}
              isFilterOpen={isFilterOpen}
            />
          ) : (
            getChart(item)
          )}
        </StyledDashboard>
      </StyledContentWrapper>
    </Box>
  );
};

export default DashboardDashlet;
