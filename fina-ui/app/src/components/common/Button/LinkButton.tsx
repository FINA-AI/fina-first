import Tooltip from "../Tooltip/Tooltip";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router-dom";
import React, { ReactElement } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { styled } from "@mui/system";

interface LinkButtonProps {
  url: string;
  title: string;
  icon: ReactElement<SvgIconProps>;
}

const StyledSpan = styled("span")(() => ({
  fontSize: "11px",
  margin: "10px 16px",
  textDecoration: "none",
  cursor: "pointer",
}));

const StyledIconButton = styled(IconButton)(() => ({
  background: "none",
  border: "none",
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
    display: "block !Important",
  },
}));

const LinkButton: React.FC<LinkButtonProps> = ({ url, title, icon }) => {
  const history = useHistory();

  const getTooltipContent = () => {
    return <StyledSpan>{title}</StyledSpan>;
  };

  return (
    <>
      <Tooltip title={getTooltipContent()}>
        <StyledIconButton
          color={"primary"}
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            history.push(url);
          }}
        >
          <span>{icon}</span>
        </StyledIconButton>
      </Tooltip>
    </>
  );
};

export default LinkButton;
