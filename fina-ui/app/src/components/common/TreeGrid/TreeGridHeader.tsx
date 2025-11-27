import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { FC, useEffect, useRef, useState } from "react";
import TreeGridHeaderCell from "./TreeGridHeaderCell";
import { TreeGridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface TreeGridHeaderProps {
  columns: TreeGridColumnType[];
  setFreezeWidth: React.Dispatch<React.SetStateAction<number[]>>;
  headerFontWeight?: number;
  hideCheckBox?: boolean;
  borderColor: string;
  orderRowByHeader?: (cellName: string, arrowDirection: string) => void;
  columnsFilter: any[];
  setColumnsFilter?: any;
  filterOnChangeFunction: (filter: any) => void;
  size?: string;
  cellRefs?: any;
  headerRefs?: any;
  tableContainerRef?: any;
  tableRef?: any;
  resizer: boolean;
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (props) => props !== "hideCheckBox",
})<{
  size: string;
  hideCheckBox?: boolean;
}>(({ size }) => ({
  height: size === "small" ? "41px" : "49px",
  "& .MuiTableCell-root": {
    padding: size === "small" ? "0px" : "4px 0px",
  },
}));

const StyledTr = styled("tr")(({ theme }) => ({
  position: "absolute",
  background: theme.palette.mode === "dark" ? "rgb(125,129,157)" : "#EAEBF0",
  width: "2px",
  zIndex: theme.zIndex.modal + 1,
  visibility: "hidden",
}));

const TreeGridHeader: FC<TreeGridHeaderProps> = ({
  columns,
  setFreezeWidth,
  headerFontWeight = 700,
  hideCheckBox,
  borderColor,
  orderRowByHeader,
  columnsFilter,
  setColumnsFilter,
  filterOnChangeFunction,
  size = "default",
  cellRefs,
  headerRefs,
  tableContainerRef,
  tableRef,
  resizer,
}) => {
  const [widthArray, setWidthArray] = useState<number[]>([]);
  const refArray = useRef([]);
  const [activeSortColName, setActiveSortColName] = useState("");
  const tableHeaderMainDivider: React.MutableRefObject<any> = useRef();

  useEffect(() => {
    getCellRef();
  }, [columns]);

  useEffect(() => {
    window.addEventListener("resize", getCellRef);
  }, []);

  const getCellRef = () => {
    if (refArray) {
      let newWidth: number[] = [0];
      let firstWidth: number = 0;
      refArray.current.map((ref: any) => {
        firstWidth += ref?.getBoundingClientRect().width;
        newWidth.push(firstWidth);
      });
      setWidthArray(newWidth);
      setFreezeWidth(newWidth);
    }
  };

  return (
    <TableHead
      sx={(theme: any) => ({
        height: size === "small" ? "41px" : "49px",
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar - 2,
      })}
    >
      <StyledTr id={"table_header_divider"} ref={tableHeaderMainDivider} />
      <StyledTableRow
        size={size}
        sx={{
          display: "flex",
          "& .MuiTableCell-root": {
            fontWeight: headerFontWeight ? headerFontWeight : 500,
            borderColor: borderColor ? `${borderColor} !important` : "",
          },
        }}
        data-testid={"tree-grid-header-row"}
      >
        {columns
          .filter((col) => !col.hidden)
          .map((col, i) => {
            return (
              <TreeGridHeaderCell
                columns={columns}
                refArray={refArray}
                widthArray={widthArray}
                borderColor={borderColor}
                headerFontWeight={headerFontWeight}
                orderRowByHeader={orderRowByHeader}
                columnsFilter={columnsFilter}
                setColumnsFilter={setColumnsFilter}
                filterOnChangeFunction={filterOnChangeFunction}
                col={col}
                i={i}
                size={size}
                key={i}
                setActiveSortColName={setActiveSortColName}
                activeSortColName={activeSortColName}
                cellRefs={cellRefs}
                headerRefs={headerRefs}
                resizer={resizer}
                tableRef={tableRef}
                tableContainerRef={tableContainerRef}
                tableHeaderMainDivider={tableHeaderMainDivider}
                hideCheckBox={hideCheckBox}
              />
            );
          })}
      </StyledTableRow>
    </TableHead>
  );
};

export default React.memo(TreeGridHeader);
