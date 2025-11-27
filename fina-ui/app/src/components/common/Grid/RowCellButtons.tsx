import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

interface RowCellButtonsProps {
  row: any;
  actionColumnRef: any;
  height: number;
  rowIndex: number;
  actionButtons: (row: any, rowIndex: number) => any;
  size?: string;
}

const StyledBox = styled(Box)<{ size: string }>(({ theme, size }) => ({
  minWidth: "min-content",
  display: "none",
  // position: "absolute !important",
  right: 0,
  top: 0,
  marginRight: 14,
  justifyContent: "center",
  alignItems: "center",
  height: size === "small" ? "37px" : "45px",
  "& .MuiSvgIcon-root": {
    width: size === "small" ? "16px" : "20px",
    height: size === "small" ? "16px" : "20px",
  },
  zIndex: theme.zIndex.drawer - 2,
}));

const RowCellButtons: FC<RowCellButtonsProps> = ({
  row,
  actionColumnRef,
  height,
  rowIndex,
  actionButtons,
  size = "default",
}) => {
  return (
    <StyledBox
      size={size}
      ref={actionColumnRef}
      style={{ height: height, position: "absolute" }}
      data-testid={`row-${rowIndex}-action-buttons-wrapper`}
    >
      {actionButtons(row, rowIndex)}
    </StyledBox>
  );
};

export default RowCellButtons;
