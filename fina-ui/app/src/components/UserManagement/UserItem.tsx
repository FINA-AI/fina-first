import {
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import { UserAndGroup } from "../../types/user.type";

interface UserItemProps {
  name: string;
  selectedItem: any;
  secondaryName: string;
  selected: boolean;
  selectionCallback: (item: UserAndGroup, selected: boolean) => void;
  size?: string;
  hasParent?: boolean;
  index: number;
}

const StyledRootBox = styled(Box)<{
  _size?: string;
  _hasParent: boolean;
  _selected: boolean;
}>(({ theme, _size, _hasParent, _selected }) => ({
  height: "36px",
  boxSizing: "border-box",
  backgroundColor: _selected
    ? theme.palette.action.select
    : theme.palette.mode === "light"
    ? "#FFF"
    : "#2C3644",
  display: "flex",
  alignItems: "center",
  boxShadow: "0px -1px 0px rgb(50 50 50 / 3%)",
  paddingRight: _size === "small" ? "16px" : "27px",
  paddingLeft: _size === "small" ? (_hasParent ? "63px" : "16px") : "23px",
  "& p": {
    color: theme.palette.textColor,
  },
  "& .MuiFormControlLabel-root": {
    marginRight: "0px",
    width: "16px",
  },
  borderBottom: theme.palette.borderColor,
}));

const StyledPersonIcon = styled(PersonIcon)<{ _size?: string }>(
  ({ _size }) => ({
    width: _size === "small" ? "16px" : "24px",
    height: _size === "small" ? "16px" : "24px",
  })
);

const StyledMainTypography = styled(Typography)<{ _size?: string }>(
  ({ theme, _size }) => ({
    fontSize: _size === "small" ? 11 : 13,
    paddingRight: 10,
    lineHeight: "16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: theme.palette.textColor,
  })
);

const StyledSecondaryTypography = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  color:
    theme.palette.mode === "dark"
      ? "#ABBACE !important"
      : theme.palette.textColor,
  opacity: theme.palette.mode === "light" ? "60%" : "",
  lineHeight: "16px",
  marginRight: "5px",
}));

const StyledCheckboxLabel = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: "auto",
  "& .MuiTypography-root": {
    fontSize: 12,
    lineHeight: "16px",
    color: "#6B7C98",
  },
  "& .MuiButtonBase-root": {
    padding: 0,
    "& svg": {
      color: "#B3BED0",
      borderRadius: "4px",
      marginRight: 0,
    },
  },
  "& .Mui-checked": {
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledCheckbox = styled(Checkbox)<{ _size?: string }>(({ _size }) => ({
  "& .MuiSvgIcon-root": {
    width: _size === "small" ? "16px" : "",
    height: _size === "small" ? "16px" : "",
  },
}));

const UserItem: React.FC<UserItemProps> = ({
  selectedItem,
  selectionCallback,
  name,
  secondaryName,
  selected,
  size,
  hasParent = false,
  index,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState(false);
  const theme = useTheme();

  const onMouseEnterFunction = (event: any) => {
    setTooltip(event.target.scrollWidth > event.target.clientWidth);
  };

  const selectItemsFunc = () => {
    setIsSelected(!isSelected);
    if (selectionCallback) {
      selectionCallback(
        { ...selectedItem, login: selectedItem?.code },
        !isSelected
      );
    }
  };
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  return (
    <StyledRootBox
      _size={size}
      _hasParent={hasParent}
      _selected={selected}
      style={{
        background: !!isSelected
          ? (theme as any).palette.action.select
          : "inherit",
      }}
      data-testid={"item-" + index}
    >
      <StyledPersonIcon
        _size={size}
        style={{
          marginRight: "10px",
          color: Boolean(isSelected)
            ? theme.palette.primary.main
            : (theme as any).palette.iconColor,
        }}
      />

      <Tooltip title={tooltip ? name : ""}>
        <StyledMainTypography
          _size={size}
          onMouseEnter={(event) => onMouseEnterFunction(event)}
          data-testid={"name"}
        >
          {name}
        </StyledMainTypography>
      </Tooltip>
      <StyledSecondaryTypography data-testid={"secondary-name"}>
        {secondaryName && `(${secondaryName})`}
      </StyledSecondaryTypography>
      <StyledCheckboxLabel
        control={
          <StyledCheckbox
            _size={size}
            checked={Boolean(isSelected)}
            onChange={selectItemsFunc}
            name="select"
            data-testid={"checkbox"}
          />
        }
        label={""}
      />
    </StyledRootBox>
  );
};

export default UserItem;
