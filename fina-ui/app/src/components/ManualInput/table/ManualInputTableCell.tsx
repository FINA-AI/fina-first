import React, { memo } from "react";
import ManualInputTableNumberField from "./Input/ManualInputTableNumberField";
import ManualInputTableTextField from "./Input/ManualInputTableTextField";
import ManualInputTableComboField from "./Input/ManualInputTableComboField";
import ManualInputTableDateField from "./Input/ManualInputTableDateField";
import ManualInputTableDateTimeField from "./Input/ManualInputTableDateTimeField";
import { TableCell, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import {
  MiProcess,
  MiTable,
  MiTableRowItem,
  MiTableType,
} from "../../../types/manualInput.type";
import { MDTNodeDataType } from "../../../types/mdt.type";

export interface ManualInputTableCellProps {
  rowItem: MiTableRowItem;
  index: number;
  miProcess: MiProcess;
  table: MiTable;
  getFormattedValue: (value: string) => string;
  dateFormat: string;
  dateTimeFormat: string;
  tableType: MiTableType;
  rowIndex: number;
}

const StyledMiTableCellFirstColumn = styled(TableCell)(
  ({ theme }: { theme: any }) => ({
    border: "none",
    fontSize: "10px",
    color: theme.palette.mode === "light" ? "grey" : "#FFFFFF",
    fontWeight: "bold",
    position: "sticky",
    background: `${theme.palette.paperBackground} !important`,
    borderRight: theme.general.border,
    left: 0,
    zIndex: 1,
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "pre-line",
    "@supports (-webkit-line-clamp: 2)": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
    },
  })
);

const StyledMiTableCell = styled(TableCell)({
  border: "none",
  fontSize: "12px",
  flex: 1,
});

const StyledMiTableCellRowNumberer = styled(Box)(
  ({ theme }: { theme: any }) => ({
    overflow: "visible!important",
    border: "none",
    fontSize: "10px",
    color: theme.palette.mode === "light" ? "grey" : "#FFFFFF",
    fontWeight: "bold",
    position: "sticky",
    background: theme.palette.paperBackground,
    borderRight: theme.general.border,
    maxWidth: "50px !important",
    width: "50px !important",
    left: 0,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
  })
);

const ManualInputTableCell: React.FC<ManualInputTableCellProps> = ({
  rowItem,
  index,
  miProcess,
  table,
  getFormattedValue,
  dateFormat,
  dateTimeFormat,
  tableType,
  rowIndex,
}) => {
  const getCell = () => {
    if (rowItem.listElementValues) {
      return (
        <StyledMiTableCell>
          <ManualInputTableComboField rowItem={rowItem} />
        </StyledMiTableCell>
      );
    } else {
      switch (rowItem.dataType) {
        case MDTNodeDataType.UNKNOWN:
          return (
            <StyledMiTableCell>
              <ManualInputTableNumberField
                disabled={true}
                isFormula={true}
                rowItem={rowItem}
                miProcess={miProcess}
                table={table}
                getFormattedValue={getFormattedValue}
              />
            </StyledMiTableCell>
          );
        case MDTNodeDataType.NUMERIC:
          return (
            <StyledMiTableCell>
              <ManualInputTableNumberField
                rowItem={rowItem}
                miProcess={miProcess}
                table={table}
                getFormattedValue={getFormattedValue}
                isFormula={rowItem.nodeType === 3}
                disabled={rowItem.nodeType === 3}
              />
            </StyledMiTableCell>
          );
        case MDTNodeDataType.TEXT:
          return (
            <StyledMiTableCell>
              <ManualInputTableTextField
                rowItem={rowItem}
                miProcess={miProcess}
                table={table}
                isFormula={rowItem.nodeType === 3}
                disabled={rowItem.nodeType === 3}
              />
            </StyledMiTableCell>
          );
        case MDTNodeDataType.DATE:
          return (
            <StyledMiTableCell>
              <ManualInputTableDateField
                rowItem={rowItem}
                formatPattern={dateFormat}
                miProcess={miProcess}
                table={table}
              />
            </StyledMiTableCell>
          );
        case MDTNodeDataType.DATE_TIME:
          return (
            <StyledMiTableCell>
              <ManualInputTableDateTimeField
                rowItem={rowItem}
                formatPattern={dateTimeFormat}
              />
            </StyledMiTableCell>
          );
        default:
          return null;
      }
    }
  };

  // Column 1
  if (index === 0) {
    return (
      <>
        <StyledMiTableCellRowNumberer
          display={"flex"}
          justifyContent={"center"}
          style={{ borderTop: "none" }}
        >
          {rowIndex + 1}
        </StyledMiTableCellRowNumberer>
        {tableType === "MCT" && (
          <Tooltip title={rowItem.description}>
            <StyledMiTableCellFirstColumn>
              {rowItem.description}
            </StyledMiTableCellFirstColumn>
          </Tooltip>
        )}
      </>
    );
  }

  let cell = rowItem && getCell();

  if (cell) {
    return cell;
  }

  console.log("DATA TYPE IS NOT IMPLEMENTED", rowItem?.dataType, rowItem);
  return (
    <TableCell align="left" sx={{ minWidth: "200px" }}>
      {rowItem?.value}
    </TableCell>
  );
};

export default memo(ManualInputTableCell);
