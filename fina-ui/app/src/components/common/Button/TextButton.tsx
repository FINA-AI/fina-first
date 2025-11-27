import { Button, ButtonProps } from "@mui/material";
import React from "react";
import { styled } from "@mui/system";

interface TextButtonProps extends ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  sx?: React.CSSProperties;
  to?: string;
}

const StyledButton = styled(Button)(() => ({
  fontSize: "12px",
  textTransform: "none",
  border: "none",
  fontWeight: 500,
  lineHeight: "18px",
  padding: "4px 4px 4px 4px",
  "&:hover": {
    border: "none",
    backgroundColor: "inherit",
  },
  "& .MuiButton-startIcon": {
    marginRight: "5px",
  },
  "& .MuiButton-endIcon": {
    marginLeft: "5px ",
  },
}));

const TextButton: React.FC<TextButtonProps> = ({
  children,
  onClick,
  disabled,
  sx,
  ...props
}) => {
  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton onClick={clickHandler} disabled={disabled} sx={sx} {...props}>
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {children}
      </span>
    </StyledButton>
  );
};

export default TextButton;
