import { IconButton, TableCell } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { memo } from "react";
import { MiTable } from "../../../../types/manualInput.type";

export interface ManualInputVctRowDeleteButtonProps {
  tableInfo: MiTable;
  rowIndex: number;
  elementIndex: number;
  onDeleteRowClick: (rowIndex: number) => void;
  isDisabled: boolean;
}

const ManualInputVctRowDeleteButton: React.FC<
  ManualInputVctRowDeleteButtonProps
> = ({ tableInfo, rowIndex, elementIndex, onDeleteRowClick, isDisabled }) => {
  return (
    <TableCell
      key={tableInfo.description + "_cell_" + rowIndex + "_" + elementIndex}
      sx={{
        border: "none",
        fontSize: "12px",
        flex: 1,
      }}
    >
      <IconButton
        onClick={() => {
          onDeleteRowClick(rowIndex);
        }}
        sx={{
          color: "red",
          padding: "10px",
          marginTop: "-9px",
          background: "none",
          border: "none",
        }}
        disabled={isDisabled || tableInfo.rows.length <= 2}
      >
        <DeleteIcon />
      </IconButton>
    </TableCell>
  );
};

export default memo(ManualInputVctRowDeleteButton);
