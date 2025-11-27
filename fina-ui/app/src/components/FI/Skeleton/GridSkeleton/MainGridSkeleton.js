import { Skeleton, TableCell } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(TableBody)({
  width: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  "& .MuiTableRow-root": {
    display: "flex",
  },
});

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => !prop.startsWith("_"),
})(
  ({
    theme,
    _size,
    _paddingLeft,
    _checkboxEnabled,
    // TODO delete
  }) => ({
    "& .MuiTableCell-root": {
      borderBottom: theme.palette.borderColor,
      "&:nth-of-type(1)": {
        paddingLeft: _paddingLeft ? _paddingLeft : "16px",
        width: _checkboxEnabled ? 24 : "100%",
        paddingRight: _checkboxEnabled && "0px",
      },
      "&:nth-last-of-type(1)": {
        paddingRight: "0px",
        paddingLeft: "16px",
      },
      display: "flex",
      width: "100%",
      alignItems: "center",
    },
    "&:nth-of-type(1)": {
      height: 40,
    },
    height: _size === "small" ? "40px" : "48px",
  })
);

const MainGridSkeleton = ({
  columns,
  columnFilterConfig = [],
  checkboxEnabled,
  paddingLeft,
  checkboxPosition,
  minWidth = 150,
  size = "default",
}) => {
  let rows = Array.apply({}, Array(15));

  const tableRow = (row, index) => {
    return (
      <StyledTableRow
        key={index}
        _size={size}
        _checkboxEnabled={checkboxEnabled}
        _paddingLeft={paddingLeft}
      >
        {checkboxEnabled && checkboxPosition !== "end" && (
          <TableCell>
            <Skeleton variant="circular" width={20} height={20} />
          </TableCell>
        )}
        {columns.map((col, id) => {
          if (columnFilterConfig.length > 0) {
            col.filter = columnFilterConfig.find((f) => f.field === col.field);
          }
          return (
            <TableCell
              key={id}
              width={"100%"}
              style={{
                flex: col.flex ? col.flex : null,
                width: col.width ? col.width : null,
              }}
            >
              <Skeleton
                variant="rectangular"
                width={
                  col.width
                    ? col.width
                    : col.flex
                    ? "100%"
                    : col.minWidth
                    ? col.filter
                      ? `${col.minWidth + 30}px`
                      : col.minWidth
                    : minWidth
                }
                height={12}
                sx={{ borderRadius: "10px", color: "#DBDBDB" }}
              />
            </TableCell>
          );
        })}
        {checkboxEnabled && checkboxPosition === "end" && (
          <TableCell width={"100%"}>
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              sx={{ marginLeft: "10px" }}
            />
          </TableCell>
        )}
      </StyledTableRow>
    );
  };

  return (
    <Table data-testid={"grid-table-body-skeleton"}>
      <StyledContainer>
        {rows.map((row, index) => {
          return tableRow(row, index);
        })}
      </StyledContainer>
    </Table>
  );
};

MainGridSkeleton.propTypes = {
  columns: PropTypes.array.isRequired,
  checkboxEnabled: PropTypes.bool,
  paddingLeft: PropTypes.string,
  checkboxPosition: PropTypes.string,
  minWidth: PropTypes.number,
  size: PropTypes.string,
  columnFilterConfig: PropTypes.array,
};
export default MainGridSkeleton;
