import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import React, { useEffect, useState } from "react";
import { getPeriodDefinitions } from "../../api/services/periodDefinitionsService";
import GridTable from "../../components/common/Grid/GridTable";
import { FilterTypes, getFormattedDateValue } from "../../util/appUtil";
import { getPeriodTypes } from "../../api/services/periodTypesService";
import { FieldSize } from "../../types/common.type";
import useConfig from "../../hoc/config/useConfig";
import { PeriodSubmitDataType, PeriodType } from "../../types/period.type";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../redux/actions/stateActions";
import isArray from "lodash/isArray";

interface PeriodPredefinedData {
  periods?: PeriodSubmitDataType[];
  types?: PeriodType[];
}

interface PeriodsVirtualizedGridContainerProps {
  selectedRows?: any[];
  onCheckFunc?: (selectedRows: PeriodType[]) => void;
  periodTypes?: PeriodType[];
  periodPredefinedData?: PeriodPredefinedData;
  size?: FieldSize;
  defaultFilter?: { [key: string]: number | number[] };
  singleRowSelect?: boolean;
}

const PeriodsVirtualizedGridContainer: React.FC<
  PeriodsVirtualizedGridContainerProps
> = ({
  selectedRows,
  onCheckFunc = () => {},
  periodTypes,
  periodPredefinedData,
  size = FieldSize.DEFAULT,
  defaultFilter = {},
  singleRowSelect,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) =>
    state.getIn(["state", "reportPeriodTableCustomization"])
  );
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { getDateFormat } = useConfig();
  const [periods, setPeriods] = useState<PeriodSubmitDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodTypesData, setPeriodTypesData] = useState<PeriodType[]>(
    periodTypes ?? []
  );

  useEffect(() => {
    if (
      Object.keys(defaultFilter).length !== 0 &&
      state?.filters === undefined
    ) {
      handleUpdateState(state?.filters, defaultFilter);
    }
  }, []);

  useEffect(() => {
    setColumns([...columnsHeader]);
    setColumnFilterConfig([...getFilters()]);
    loadPeriodDefinitions({ ...state?.filters });
  }, [state]);

  useEffect(() => {
    if (periodTypes) {
      setPeriodTypesData(periodTypes);
    }
  }, [periodTypes]);

  useEffect(() => {
    setColumns(columnsHeader);
  }, [t]);

  const getStateFilterValue = (key: string) => {
    if (state && state.filters) {
      return state.filters[key];
    }
  };

  const getFilters = (): any[] => {
    let filterArray = periodTypesData.map((item) => ({
      label: t(item.name),
      value: item.id,
    }));

    return [
      {
        field: "periodType.name",
        type: FilterTypes.list,
        name: "typeIds",
        filterArray: filterArray,
        value: getStateFilterValue("typeIds"),
      },
      {
        field: "periodNumber",
        type: FilterTypes.number,
        name: "periodNumber",
        value: getStateFilterValue("periodNumber"),
      },
      {
        field: "fromDate",
        type: FilterTypes.datePicker,
        name: "fromDate",
        value: getStateFilterValue("fromDate"),
      },
      {
        field: "toDate",
        type: FilterTypes.datePicker,
        name: "toDate",
        value: getStateFilterValue("toDate"),
      },
    ];
  };

  const columnsHeader = [
    {
      field: "fromDate",
      headerName: t("fromDate"),
      hideCopy: true,
      flex: 1,
      renderCell: (value: Date) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
      filter: getFilters().find((item) => item.field === "fromDate"),
    },
    {
      field: "toDate",
      headerName: t("toDate"),
      hideCopy: true,
      flex: 1,
      renderCell: (value: Date) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
      filter: getFilters().find((item) => item.field === "toDate"),
    },
    {
      field: "periodType.name",
      headerName: t("type"),
      flex: 1,
      hideCopy: true,
      renderCell: (value: string) => {
        return <span>{t(value)}</span>;
      },
      filter: getFilters().find((item) => item.field === "periodType.name"),
    },
    {
      field: "periodNumber",
      headerName: t("number"),
      flex: 1,
      hideCopy: true,
      filter: getFilters().find((item) => item.field === "periodNumber"),
    },
  ];

  const [columns, setColumns] = useState(columnsHeader);
  const [columnFilterConfig, setColumnFilterConfig] = useState<any[]>([]);

  useEffect(() => {
    setColumnFilterConfig(getFilters());
    setColumns([...columns]);
  }, [periodTypesData]);

  const loadPeriodDefinitions = (filteredData?: any) => {
    setLoading(true);

    if (periodPredefinedData && !filteredData) {
      setPeriods([...(periodPredefinedData.periods || [])]);
      setPeriodTypesData([...(periodPredefinedData.types || [])]);
      setLoading(false);
    } else {
      getPeriodDefinitions(undefined, undefined, filteredData)
        .then((result) => {
          setPeriods(result.data.list);
          if (!periodTypes && periodTypesData.length === 0) {
            loadPeriodTypes();
          } else if (columnFilterConfig.length === 0) {
            setColumnFilterConfig(getFilters());
          }
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const loadPeriodTypes = () => {
    getPeriodTypes()
      .then((res) => {
        setPeriodTypesData(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const filterOnChangeFunction = (filteredData: any[]) => {
    let filter: any = {};

    for (let item of filteredData) {
      switch (item.type) {
        case FilterTypes.list:
          if (item.value) {
            filter[item.name] = isArray(item.value)
              ? [...item.value]
              : [item.value];
          }
          break;
        case FilterTypes.number:
          if (item.value) {
            filter[item.name] = item.value;
          }
          break;
        case FilterTypes.datePicker:
          if (item.date) {
            filter[item.name] = item.date;
          }
          break;
        default: {
          filter[item.name] = item.value;
        }
      }
    }
    handleUpdateState(filter);
  };

  const handleUpdateState = (filters: any, defaultFilters: any = {}) => {
    const newData = {
      key: "reportPeriodTableCustomization",
      updatedState: {
        ...(state && state),
        filters: { ...defaultFilters, ...filters },
      },
    };
    dispatch(updateState(newData));
  };

  return (
    <GridTable
      columns={columns}
      rows={periods}
      setRows={setPeriods}
      selectedRows={selectedRows}
      rowOnClick={(_: any, __: any, selectedRows: PeriodType[]) => {
        onCheckFunc(selectedRows);
      }}
      onCheckboxClick={(_: any, selectedRows: any) => {
        onCheckFunc(selectedRows);
      }}
      filterOnChangeFunction={filterOnChangeFunction}
      loading={loading}
      checkboxEnabled={true}
      virtualized={true}
      columnFilterConfig={columnFilterConfig}
      checkboxSelection={true}
      size={size}
      singleRowSelect={singleRowSelect}
    />
  );
};

export default PeriodsVirtualizedGridContainer;
