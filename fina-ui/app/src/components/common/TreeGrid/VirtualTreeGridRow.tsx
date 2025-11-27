import React, { FC, useRef } from "react";
import RowCellButtons from "../Grid/RowCellButtons";
import { GridColumnType } from "../../../types/common.type";

interface VirtualTreeGridRowProps {
  className: string;
  columns: GridColumnType[];
  a11yProps: any;
  style: { [key: string]: string | number };
  index: number;
  rowData: any;
  size: string;
  actionButtons: (row: any, index: number) => JSX.Element;
}

const VirtualTreeGridRow: FC<VirtualTreeGridRowProps> = ({
  className,
  columns,
  a11yProps,
  style,
  index,
  rowData,
  size,
  actionButtons,
}) => {
  const actionColumnRef: React.MutableRefObject<any> = useRef(null);

  return (
    <div
      {...a11yProps}
      className={className}
      key={`${index}-0`}
      role="row"
      style={style}
      data-testid={"virtual-tree-grid-row-" + index}
      onMouseEnter={() => {
        if (actionColumnRef) {
          actionColumnRef.current.style.display = "flex";
        }
      }}
      onMouseLeave={() => {
        actionColumnRef.current.style.display = "none";
      }}
    >
      {columns}
      <RowCellButtons
        key={`rowCell-${index}`}
        row={rowData}
        rowIndex={index}
        actionColumnRef={actionColumnRef}
        height={size === "small" ? 40 : 48}
        actionButtons={actionButtons}
        size={size}
      />
    </div>
  );
};

export default VirtualTreeGridRow;
