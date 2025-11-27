import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { styled } from "@mui/system";

interface SelectorBtnProps {
  label: string;
  isDisabled?: boolean;
  onClick: () => void;
  width?: string;
  style?: object;
}

const StyledButton = styled(Button)<{ width?: string }>(({ theme, width }) => ({
  marginTop: 15,
  marginBottom: 15,
  width: width ? width : "fit-content",
  textTransform: "none",
  "& .MuiSvgIcon-root": {
    width: (theme as any).icon.iconWidth,
    height: (theme as any).icon.iconHeight,
    [theme.breakpoints.between(900, 1300)]: {
      width: "1rem !important",
      height: "1rem !important",
    },
  },
  "& .MuiButton-startIcon": {
    marginRight: "5px ",
  },
  "& .MuiButton-endIcon": {
    marginLeft: "5px ",
  },
}));

const StyledAddIcon = styled(AddIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const SelectorBtn: React.FC<SelectorBtnProps> = ({
  label,
  isDisabled,
  onClick,
  width,
  ...props
}) => {
  return (
    <StyledButton
      width={width}
      variant="outlined"
      disabled={isDisabled}
      onClick={() => onClick()}
      startIcon={<StyledAddIcon />}
      {...props}
    >
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          lineHeight: "normal",
        }}
      >
        {label}
      </span>
    </StyledButton>
  );
};

export default SelectorBtn;
