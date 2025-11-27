import React, { FC } from "react";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface CellResizerProps {
  cellRefs: any;
  colName: string;
  headerRefs: any;
  columns: GridColumnType[];
  virtualized: boolean;
  tableRef: any;
  tableHeaderMainDivider: any;
  tableContainerRef: any;
  size: string;
  checkboxEnabled?: boolean;
  draggable: boolean;
}

const commonDividerStyles = {
  top: 0,
  right: 0,
  cursor: "ew-resize",
  zIndex: 100,
  height: "100%",
  width: "5px",
};

const StyledMainDivider = styled("div")(() => ({
  ...commonDividerStyles,
  position: "absolute",
  visibility: "hidden",
}));

const StyledInnerDivider = styled("div")(({ theme }) => ({
  ...commonDividerStyles,
  position: "absolute",
  background: theme.palette.mode === "dark" ? "rgb(125,129,157)" : "#EAEBF0",
  width: "2px",
  visibility: "inherit",
}));

const CellResizer: FC<CellResizerProps> = ({
  cellRefs,
  colName,
  headerRefs,
  columns,
  virtualized,
  tableRef,
  tableHeaderMainDivider,
  tableContainerRef,
  size,
  checkboxEnabled,
  draggable,
}) => {
  const headerCells = headerRefs.current.headerCells;
  let limitLeftPosition = 0;

  const headerCellRef = () => {
    return headerCells[colName];
  };

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    tableHeaderMainDivider.current.style.visibility = "visible";
    tableHeaderMainDivider.current.style.height = `${
      tableRef.getBoundingClientRect().height
    }px`;

    // let left = checkboxEnabled ? (size === "small" ? 32 : 40) : 0;
    // left += draggable ? 35 : 0;
    let left = 0;
    let headerColumns = columns.filter((f: GridColumnType) => !f.hidden);
    for (let column of headerColumns) {
      const cellWidth = headerCells[column.field].getBoundingClientRect().width;
      left += cellWidth;
      if (column.field === colName) {
        limitLeftPosition = left - cellWidth + 30;
        break;
      }
    }
    //2 is divider width
    tableHeaderMainDivider.current.style.left = `${left - 2}px`;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: any) => {
    const containerRect = tableContainerRef.current.getBoundingClientRect();
    const relativeMouseX = event.clientX - containerRect.left;

    const adjustedMouseX =
      relativeMouseX + tableContainerRef.current.scrollLeft;

    if (adjustedMouseX > limitLeftPosition) {
      tableHeaderMainDivider.current.style.left = `${relativeMouseX}px`;
    }
  };

  const handleMouseUp = () => {
    tableHeaderMainDivider.current.style.visibility = "hidden";
    tableHeaderMainDivider.current.style.height = "0";

    let deltaWidth =
      tableHeaderMainDivider.current.getBoundingClientRect().left -
      headerCellRef().getBoundingClientRect().left;

    headerCellRef().style.minWidth = `${deltaWidth}px`;
    headerCellRef().style.maxWidth = `${deltaWidth}px`;
    headerCellRef().style.width = `${deltaWidth}px`;

    onChangeNextHeaderCellStyle();
    limitLeftPosition = 0;
    tableHeaderMainDivider.current.style.left = 0;

    if (virtualized) {
      columns.forEach((c: GridColumnType) => {
        if (c.field !== colName) {
          tableRef.style.setProperty(
            [`--${c.field.replaceAll(".", "-")}-size`],
            headerCells[c.field].clientWidth
          );
        }
      });
      tableRef.style.setProperty(
        [`--${colName.replaceAll(".", "-")}-size`],
        deltaWidth + 34
      );
    }

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const onChangeNextHeaderCellStyle = () => {
    let arr: number[] = [checkboxEnabled ? (size === "small" ? 32 : 40) : 0];
    if (draggable) {
      arr[0] += draggable ? 35 : 0;
    }

    let headerColumns = columns.filter((c: GridColumnType) => !c.hidden);

    for (let column of headerColumns) {
      arr.push(headerCells[column.field].getBoundingClientRect().width);
    }

    columns.forEach((column, index) => {
      Object.entries(cellRefs.current).forEach(([key, el]) => {
        const cellKey = key.split("_")[0];
        if (column.field === cellKey && el instanceof HTMLTableCellElement) {
          const newWidth = `${arr[index + 1]}px`;
          el.style.width = newWidth;
          el.style.minWidth = newWidth;
          el.style.maxWidth = newWidth;
        }
      });
    });

    headerRefs.current.headerCellWidths = [...arr.slice(1)];
  };

  return (
    <StyledMainDivider onMouseDown={handleMouseDown} id={"resizer_Root"}>
      <StyledInnerDivider />
    </StyledMainDivider>
  );
};

export default CellResizer;
