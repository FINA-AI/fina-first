import { useTranslation } from "react-i18next";
import useConfig from "../../../hoc/config/useConfig";
import React, { useEffect, useState } from "react";
import { PeriodDefinitionType, PeriodType } from "../../../types/period.type";
import { getFormattedDateValue } from "../../../util/appUtil";
import GridTable from "../../common/Grid/GridTable";

interface ReportEditPeriodGridProps {
  rows: PeriodDefinitionType[];
  onCheckboxClick: (rows: PeriodDefinitionType[]) => void;
  draggable: boolean;
  virtualized: boolean;
  onDraggableFunc: (rows: PeriodDefinitionType[]) => void;
  selectedRows?: PeriodDefinitionType[];
}

const ReportEditPeriodGrid: React.FC<ReportEditPeriodGridProps> = ({
  rows = [],
  onCheckboxClick,
  draggable,
  virtualized,
  onDraggableFunc,
  selectedRows = [],
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

  useEffect(() => {
    setCheckedRows(selectedRows);
  }, [selectedRows]);

  const onDataChange = (gridData: PeriodDefinitionType[]) => {
    setData(gridData);
    onDraggableFunc(gridData);
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
        onCheckboxClick(selectedRows);
        setCheckedRows(selectedRows);
      }}
      checkboxEnabled={true}
      virtualized={virtualized}
      draggable={draggable}
      selectedRows={checkedRows}
    />
  );
};

export default ReportEditPeriodGrid;
