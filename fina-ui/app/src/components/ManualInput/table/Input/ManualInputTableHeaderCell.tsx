import React, { memo, ReactNode } from "react";
import { TableCell, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MiTableType } from "../../../../types/manualInput.type";

interface ManualInputTableHeaderCellProps {
  tableType: MiTableType;
  label: ReactNode;
  index: number;
}

const StyledHeaderFirstColumnCell = styled(TableCell)(({ theme }) => ({
  border: "none",
  fontSize: "10px",
  fontWeight: "bold",
  position: "sticky",
  background: (theme as any).palette.paperBackground,
  top: "56px",
  left: 0,
  zIndex: 999999990,
  display: "flex",
}));

const StyledHeaderCell = styled(TableCell)({
  border: "none",
  fontSize: "10px",
  fontWeight: "bold",
  position: "sticky",
  background: "inherit",
  top: "56px",
  zIndex: 99999998,
  overflow: "hidden",
  maxWidth: "300px",
  height: "100%",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  cursor: "pointer",
  marginLeft: 0,
});

const ManualInputTableHeaderCell: React.FC<ManualInputTableHeaderCellProps> = ({
  tableType = "MCT",
  label,
  index,
}) => {
  if (tableType === "MCT") {
    if (index === 0) {
      return (
        <StyledHeaderFirstColumnCell key={"header_" + index} align="left">
          #
          {label ? (
            <span style={{ marginLeft: "50px" }}>{label}</span>
          ) : (
            <span style={{ visibility: "hidden", marginLeft: "50px" }}>
              text
            </span>
          )}
        </StyledHeaderFirstColumnCell>
      );
    }
    return (
      <Tooltip title={label}>
        <StyledHeaderCell key={"header_" + index} align="left">
          {label ? label : <span style={{ visibility: "hidden" }}>text</span>}
        </StyledHeaderCell>
      </Tooltip>
    );
  }

  return index === 0 ? (
    <StyledHeaderCell key={"header_" + index} align="left">
      #
    </StyledHeaderCell>
  ) : (
    <Typography noWrap>
      <Tooltip title={label}>
        <StyledHeaderCell key={"header_" + index} align="left">
          {label ? label : <span style={{ visibility: "hidden" }}>text</span>}
        </StyledHeaderCell>
      </Tooltip>
    </Typography>
  );
};

export default memo(ManualInputTableHeaderCell);
