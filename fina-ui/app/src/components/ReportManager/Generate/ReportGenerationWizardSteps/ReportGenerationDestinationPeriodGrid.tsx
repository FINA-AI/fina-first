import GridTable from "../../../common/Grid/GridTable";
import React, { useEffect, useState } from "react";
import { getFormattedDateValue } from "../../../../util/appUtil";
import useConfig from "../../../../hoc/config/useConfig";
import { useTranslation } from "react-i18next";
import {
  PeriodDefinitionType,
  PeriodType,
} from "../../../../types/period.type";

interface Props {
  rows: PeriodDefinitionType[];
  onCheckboxClick: (rows: PeriodDefinitionType[]) => void;
  draggable: boolean;
  virtualized: boolean;
  currentOperationName: React.MutableRefObject<string | undefined>;
  onDraggableFunc: (rows: PeriodDefinitionType[], key?: string) => void;
  type?: string;
}

const ReportGenerationDestinationPeriodGrid: React.FC<Props> = ({
  rows = [],
  onCheckboxClick,
  draggable,
  virtualized,
  currentOperationName,
  onDraggableFunc,
  type,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [columns] = useState([
    {
      field: "periodType",
      headerName: t("type"),
      renderCell: (value: string, row: PeriodDefinitionType) => {
        return <span>{t(row.periodType?.name)}</span>;
      },
    },
    {
      field: "periodNumber",
      headerName: t("number"),
    },
    {
      field: "fromDate",
      headerName: t("fromDate"),
      hideCopy: true,
      renderCell: (value: number) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "toDate",
      headerName: t("toDate"),
      hideCopy: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
  ]);

  const [checkedRows, setCheckedRows] = useState<PeriodDefinitionType[]>([]);
  const [data, setData] = useState(rows);

  useEffect(() => {
    setData(rows);
  }, [rows]);

  const onDataChange = (gridData: PeriodDefinitionType[]) => {
    setData(gridData);
    onDraggableFunc(gridData, type);
  };

  return (
    <GridTable
      columns={columns}
      rows={data}
      setRows={onDataChange}
      onCheckboxClick={(
        currRow: PeriodType,
        selectedRows: PeriodDefinitionType[]
      ) => {
        currentOperationName.current = "";
        onCheckboxClick(selectedRows);
        setCheckedRows(selectedRows);
      }}
      checkboxEnabled={true}
      virtualized={virtualized}
      draggable={draggable}
      selectedRows={currentOperationName.current === "move" ? [] : checkedRows}
    />
  );
};

export default ReportGenerationDestinationPeriodGrid;
