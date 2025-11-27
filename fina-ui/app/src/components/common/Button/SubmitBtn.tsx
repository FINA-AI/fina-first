import React, { ReactElement } from "react";
import { Box, styled } from "@mui/system";
import { Button } from "@mui/material";

interface SubmitBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
  endIcon: ReactElement;
  disabled?: boolean;
  variant?: any;
  color?: any;
}

const StyledButton = styled(Button)(({ theme }: any) => ({
  borderRadius: theme.btn.borderRadius,
  lineHeight: theme.btn.lineHeight,
  // height: "32px",
  fontSize: theme.btn.fontSize,
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
  padding: "8px 16px",
  textTransform: "none",
  ...theme.primaryBtn,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const SubmitBtn: React.FC<SubmitBtnProps> = ({ children, ...props }) => {
  return (
    <StyledButton color="primary" {...props}>
      <Box
        component="span"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {children}
      </Box>
    </StyledButton>
  );
};

export default SubmitBtn;
