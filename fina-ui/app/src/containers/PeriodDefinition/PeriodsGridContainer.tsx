import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import GridTable from "../../components/common/Grid/GridTable";
import { FilterTypes, getFormattedDateValue } from "../../util/appUtil";
import {
  columnFilterConfigType,
  FieldSize,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import useConfig from "../../hoc/config/useConfig";
import { PeriodSubmitDataType, PeriodType } from "../../types/period.type";

interface PeriodsGridContainerProps {
  selectedRows: PeriodSubmitDataType[];
  actionButtons?: (row: PeriodSubmitDataType, index: number) => React.ReactNode;
  onCheckFunc: (val: PeriodSubmitDataType[]) => void;
  periodTypes?: PeriodType[];
  rows: PeriodSubmitDataType[];
  parentLoading: boolean;
  size?: string;
  filterOnChangeFunction?: (val: FilterType[]) => void;
  checkboxEnabled?: boolean;
  orderRowByHeader: (sortField: string, arrowDirection: string) => void;
}

const PeriodsGridContainer: React.FC<PeriodsGridContainerProps> = ({
  selectedRows,
  actionButtons,
  onCheckFunc,
  periodTypes,
  rows,
  parentLoading,
  filterOnChangeFunction,
  size = FieldSize.DEFAULT,
  checkboxEnabled,
  orderRowByHeader,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [periods, setPeriods] = useState<PeriodSubmitDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [periodTypesData, setPeriodTypesData] = useState(periodTypes ?? []);

  useEffect(() => {
    if (periodTypes) {
      setPeriodTypesData(periodTypes);
    }
  }, [periodTypes]);

  useEffect(() => {
    setColumns(columnsHeader);
  }, [t]);

  const columnsHeader: GridColumnType[] = [
    {
      field: "fromDate",
      headerName: t("fromDate"),
      hideCopy: true,
      flex: 1,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "toDate",
      headerName: t("toDate"),
      hideCopy: true,
      flex: 1,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "periodType.name",
      headerName: t("type"),
      flex: 1,
      hideSort: true,
      hideCopy: true,
      renderCell: (value) => {
        return <span>{t(value)}</span>;
      },
    },
    {
      field: "periodNumber",
      headerName: t("number"),
      flex: 1,
      hideCopy: true,
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnsHeader);

  const [columnFilterConfig, setColumnFilterConfig] = useState<
    columnFilterConfigType[]
  >([]);

  const getFilters = () => {
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
      },
      {
        field: "periodNumber",
        type: FilterTypes.number,
        name: "periodNumber",
      },
      {
        field: "fromDate",
        type: FilterTypes.datePicker,
        name: "fromDate",
      },
      {
        field: "toDate",
        type: FilterTypes.datePicker,
        name: "toDate",
      },
    ];
  };

  useEffect(() => {
    setColumnFilterConfig(getFilters());
    setColumns([...columns]);
  }, [periodTypesData]);

  useEffect(() => {
    if (rows) {
      setPeriods([...rows]);
    } else {
      setPeriods([]);
    }
    setLoading(parentLoading);
  }, [parentLoading, rows]);

  const getCurrentPageSelectedRows = () => {
    return periods.filter((period) =>
      selectedRows.find((selectedPeriod) => selectedPeriod.id === period.id)
    );
  };

  return (
    <GridTable
      columns={columns}
      rows={periods}
      setRows={setPeriods}
      selectedRows={getCurrentPageSelectedRows()}
      rowOnClick={(_: any, __: any, selectedRows: PeriodSubmitDataType[]) => {
        onCheckFunc(selectedRows);
      }}
      onCheckboxClick={(
        currRow: PeriodSubmitDataType,
        selectedRows: PeriodSubmitDataType[]
      ) => {
        onCheckFunc(selectedRows);
      }}
      filterOnChangeFunction={filterOnChangeFunction}
      loading={loading}
      actionButtons={actionButtons}
      checkboxEnabled={checkboxEnabled}
      columnFilterConfig={columnFilterConfig}
      checkboxSelection={true}
      size={size}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

export default PeriodsGridContainer;
