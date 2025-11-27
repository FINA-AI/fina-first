import { IconButton } from "@mui/material";
import { FC } from "react";
import { styled } from "@mui/material/styles";

interface ToolbarIconProps {
  onClickFunction: () => void;
  Icon: React.ReactNode;
  hideBackground?: boolean;
  isSquare?: boolean;
  disabled?: boolean;
  iconColor?: string;
  hoverColor?: string;
  props?: any;
}

const StyledIconButton = styled(IconButton)(() => ({
  borderRadius: "96px !important",
  padding: "4px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  margin: "0px 1px",
}));

const ToolbarIcon: FC<ToolbarIconProps> = ({
  onClickFunction,
  Icon,
  hideBackground = false,
  isSquare = false,
  disabled = false,
  ...props
}) => {
  return (
    <StyledIconButton
      color={"primary"}
      style={{
        ...(!hideBackground && {
          width: 32,
          height: 32,
        }),
        borderRadius: isSquare ? "8px" : "",
      }}
      onClick={onClickFunction}
      disabled={disabled}
      {...props}
    >
      {Icon}
    </StyledIconButton>
  );
};

export default ToolbarIcon;
