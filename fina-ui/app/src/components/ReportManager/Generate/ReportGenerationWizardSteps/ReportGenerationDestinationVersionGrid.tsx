import GridTable from "../../../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { returnVersionDataType } from "../../../../types/returnVersion.type";

interface Props {
  rows: returnVersionDataType[];
  onCheckboxClick: (rows: returnVersionDataType[]) => void;
  draggable: boolean;
  virtualized: boolean;
  onDraggableFunc: (rows: returnVersionDataType[], key?: string) => void;
  type?: string;
}

const ReportGenerationDestinationVersionGrid: React.FC<Props> = ({
  rows = [],
  onCheckboxClick,
  draggable,
  virtualized,
  onDraggableFunc,
  type,
}) => {
  const { t } = useTranslation();

  const [columns] = useState([
    {
      field: "code",
      headerName: t("code"),
    },
    {
      field: "description",
      headerName: t("description"),
    },
  ]);

  const [data, setData] = useState(rows);

  const onDataChange = (gridData: returnVersionDataType[]) => {
    setData(gridData);
    onDraggableFunc(gridData, type);
  };

  useEffect(() => {
    setData(rows);
  }, [rows]);

  return (
    <GridTable
      columns={columns}
      rows={data}
      onCheckboxClick={(
        currRow: returnVersionDataType,
        selectedRows: returnVersionDataType[]
      ) => {
        onCheckboxClick(selectedRows);
      }}
      setRows={onDataChange}
      checkboxEnabled={true}
      virtualized={virtualized}
      draggable={draggable}
    />
  );
};

export default ReportGenerationDestinationVersionGrid;
