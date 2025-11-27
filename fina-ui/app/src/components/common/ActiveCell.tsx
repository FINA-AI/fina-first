import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ActiveCellProps extends React.ComponentProps<typeof Box> {
  children: React.ReactNode;
  active: boolean;
}

const StyledStatusBox = styled(Box)<{ active: boolean }>(
  ({ active, theme }) => ({
    borderRadius: "100px",
    width: "auto",
    paddingInline: "10px",
    display: "flex",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 16,
    height: "28px",
    alignItems: "center",
    color: active
      ? (theme as any).palette.mode === "light"
        ? "#289E20"
        : "#ABEFC6"
      : (theme as any).palette.mode === "light"
      ? "#FF4128"
      : "#FEE4E2",
    backgroundColor: active
      ? (theme as any).palette.mode === "light"
        ? "#E9F5E9"
        : "#079455"
      : (theme as any).palette.mode === "light"
      ? "rgba(104, 122, 158, 0.1)"
      : "#B42318",
  })
);

const ActiveCell: React.FC<ActiveCellProps> = ({
  children,
  active,
  ...props
}) => {
  return (
    <StyledStatusBox active={active} {...props}>
      {children}
    </StyledStatusBox>
  );
};

export default ActiveCell;
