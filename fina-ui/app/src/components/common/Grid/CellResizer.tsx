import React from "react";
import { styled } from "@mui/material/styles";

interface CellResizerProps {
  tableRef: any;
  tableHeaderMainDivider: any;
  headerRefs: any;
  column: any;
  cellRefs: any;
  getMemoizedFlexibleColumns: any;
  size: string;
  checkboxEnabled: boolean;
}

const StyledCommonDividerDiv = styled("div")(() => ({
  top: 0,
  position: "absolute",
  right: 0,
  cursor: "ew-resize",
  zIndex: 100,
  visibility: "hidden",
  height: "100%",
  width: "5px",
}));

const StyledDividerDiv = styled(StyledCommonDividerDiv)(() => ({}));

const StyledDividerDivHandle = styled(StyledCommonDividerDiv)(
  ({ theme }: any) => ({
    background: theme.palette.mode === "dark" ? "rgb(125,129,157)" : "#EAEBF0",
    width: "2px",
    visibility: "inherit",
  })
);

const CellResizer: React.FC<CellResizerProps> = ({
  tableRef,
  tableHeaderMainDivider,
  headerRefs,
  column,
  cellRefs,
  getMemoizedFlexibleColumns,
  size = "default",
  checkboxEnabled = false,
}) => {
  const handleMouseDown = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    tableHeaderMainDivider.current.style.left = `${
      event.clientX - tableRef.getBoundingClientRect().left
    }px`;
    tableHeaderMainDivider.current.style.visibility = "visible";
    tableHeaderMainDivider.current.style.height = `${
      tableRef.getBoundingClientRect().height
    }px`;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: any) => {
    const mouseX = event.clientX;

    if (
      mouseX <= headerRefs.current[column.field].getBoundingClientRect().left
    ) {
      return;
    }

    tableHeaderMainDivider.current.style.left = `${
      mouseX - tableRef.getBoundingClientRect().left
    }px`;
  };

  const handleMouseUp = () => {
    tableHeaderMainDivider.current.style.visibility = "hidden";

    let paddingWidth = 10;

    let deltaWidth =
      tableHeaderMainDivider.current.getBoundingClientRect().left -
      headerRefs.current[column.field].getBoundingClientRect().left;

    if (column.width || column.fixed) {
      tableRef.style.setProperty(
        [`--${column.field.replaceAll(".", "-")}-size`],
        deltaWidth
      );
      headerRefs.current[column.field].style.minWidth = `${
        deltaWidth - paddingWidth
      }px`;
      headerRefs.current[column.field].style.minWidth = `${
        deltaWidth - paddingWidth
      }px`;
      headerRefs.current[column.field].style.maxWidth = `${
        deltaWidth - paddingWidth
      }px`;

      Object.entries(headerRefs.current).forEach((element: any) => {
        if (element) {
          tableRef.style.setProperty(
            [`--${element[0].replaceAll(".", "-")}-size`],
            element[1].getBoundingClientRect().width
          );
        }
      });
    } else {
      let currentColumnRef = headerRefs.current[column.field];
      let arr: any = [];
      let fullWidth = 0;
      let checkboxWidth = checkboxEnabled ? (size === "default" ? 40 : 24) : 0;
      let avWidth =
        (deltaWidth - currentColumnRef.getBoundingClientRect().width) /
          getMemoizedFlexibleColumns.length -
        checkboxWidth;

      Object.entries(headerRefs.current).forEach((element: any) => {
        if (
          getMemoizedFlexibleColumns.find(
            (col: any) => col.field === element[0]
          )
        ) {
          let obj = {
            field: element[0],
            width:
              element[0] === column.field
                ? deltaWidth
                : element[1].getBoundingClientRect().width - avWidth,
            flex: 0,
          };
          fullWidth += element[1].getBoundingClientRect().width;
          arr.push(obj);
        }
      });

      arr = arr.map((item: any) => {
        return { ...item, flex: item.width / fullWidth };
      });

      let index = 0;
      Object.entries(headerRefs.current).forEach((element: any) => {
        if (
          getMemoizedFlexibleColumns.find(
            (col: any) => col.field === element[0]
          )
        ) {
          if (element && element[1]) {
            element[1].style.flex = String(arr[index].flex.toFixed(3));
          }

          Object.entries(cellRefs.current).forEach((bodyCell: any) => {
            if (bodyCell && bodyCell[0].includes(element[0]) && bodyCell[1]) {
              bodyCell[1].style.flex = String(arr[index].flex.toFixed(3));
            }
          });

          index++;
        }
      });
    }

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <StyledDividerDiv onMouseDown={handleMouseDown} id={"resizer_Root"}>
      <StyledDividerDivHandle />
    </StyledDividerDiv>
  );
};

export default CellResizer;
