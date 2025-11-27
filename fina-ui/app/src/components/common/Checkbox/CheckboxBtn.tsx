import React, { CSSProperties, FC } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { isFieldDisabled } from "../../../util/component/fieldUtil";
import { styled } from "@mui/material/styles";

interface StyleProps {
  _color?: string;
  padding?: string;
}

interface CheckboxBtnProps {
  onClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean | (() => boolean);
  label?: string;
  color?: string;
  size?: "small" | "medium";
  padding?: string;
  style?: CSSProperties;
  props?: any;
}

const StyledCheckBox = styled(Checkbox)<StyleProps>(
  ({ theme, _color, padding }) => ({
    "& .Mui-disabled": {
      color: "#2A3341",
    },
    "& .Mui-disabled.MuiCheckbox-root": {
      color: "#B3BED0",
    },
    "& .MuiTypography-root": {
      color: _color ?? (theme as any).palette.textColor,
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "20px",
      textTransform: "capitalize",
    },
    padding: padding ?? "",
    color: theme.palette.mode === "light" ? "#AEB8CB" : "#7D95B3",
  })
);

const StyledFormControlLabel = styled(FormControlLabel)<{ _color?: string }>(
  ({ theme, color }) => ({
    "& .Mui-disabled": {
      color: "#2A3341",
    },
    "& .Mui-disabled.MuiCheckbox-root": {
      color: "#B3BED0",
    },
    "& .MuiTypography-root": {
      color: color ?? (theme as any).palette.textColor,
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "20px",
      textTransform: "capitalize",
    },
  })
);

const CheckboxBtn: FC<CheckboxBtnProps> = ({
  onClick,
  checked = false,
  disabled = false,
  label,
  color,
  size = "medium",
  padding,
  style = {},
  ...props
}) => {
  const getCheckBox = () => {
    return (
      <StyledCheckBox
        _color={color}
        padding={padding}
        onChange={onClick}
        checked={checked}
        disabled={isFieldDisabled(disabled)}
        size={size}
        style={{ ...style }}
        {...props}
      />
    );
  };

  const getCheckBoxWithLabel = () => {
    return (
      <StyledFormControlLabel
        _color={color}
        disabled={isFieldDisabled(disabled)}
        control={getCheckBox()}
        label={label}
      />
    );
  };

  return <>{label ? getCheckBoxWithLabel() : getCheckBox()}</>;
};

export default CheckboxBtn;
