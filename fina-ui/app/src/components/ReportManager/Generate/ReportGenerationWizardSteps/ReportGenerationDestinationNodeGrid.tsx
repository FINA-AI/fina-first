import GridTable from "../../../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { MdtNode } from "../../../../types/mdt.type";

interface Props {
  rows: MdtNode[];
  onCheckboxClick: (rows: MdtNode[]) => void;
  draggable: boolean;
  virtualized: boolean;
  onDraggableFunc: (rows: MdtNode[], key?: string) => void;
  type?: string;
  checkedRows?: MdtNode[];
}

const ReportGenerationDestinationNodeGrid: React.FC<Props> = ({
  rows = [],
  onCheckboxClick,
  draggable,
  virtualized,
  onDraggableFunc,
  type,
  checkedRows = [],
}) => {
  const { t } = useTranslation();

  const [data, setData] = useState<MdtNode[]>(rows);

  const [columns] = useState([
    {
      field: "code",
      headerName: t("code"),
    },
    {
      field: "name",
      headerName: t("name"),
    },
  ]);

  useEffect(() => {
    setData(rows);
  }, [rows]);

  const onDataChange = (gridData: MdtNode[]) => {
    setData(gridData);
    onDraggableFunc(gridData, type);
  };

  return (
    <GridTable
      columns={columns}
      rows={data}
      setRows={onDataChange}
      onCheckboxClick={(currRow: MdtNode, selectedRows: MdtNode[]) => {
        onCheckboxClick(selectedRows);
      }}
      checkboxEnabled={true}
      virtualized={virtualized}
      draggable={draggable}
      selectedRows={checkedRows}
    />
  );
};

export default ReportGenerationDestinationNodeGrid;
