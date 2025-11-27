import Button from "@mui/material/Button";
import React from "react";
import { styled } from "@mui/system";

const StyledButton = styled(Button)(() => ({
  marginTop: 24,
  width: "100%",
  color: "#FFFFFF",
  borderRadius: 4,
  padding: "15px 50px",
  background: "#157AFF",
  "&:hover": {
    background: `#2962FF 0% 0% no-repeat padding-box`,
  },
  "&:disabled": {
    opacity: 0.6,
    background: `#2962FF 0% 0% no-repeat padding-box`,
    color: "#FFFFFF",
  },
  textTransform: "none",
}));

interface PrimaryStretchBtnProps {
  label: string;
  isDisabled?: boolean;
  onClick: () => void;
}

const PrimaryStretchBtn: React.FC<PrimaryStretchBtnProps> = ({
  label,
  isDisabled,
  onClick,
}) => {
  return (
    <StyledButton disabled={isDisabled} onClick={() => onClick()}>
      {label}
    </StyledButton>
  );
};

export default PrimaryStretchBtn;
