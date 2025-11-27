import { Box } from "@mui/system";
import { Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import { styled } from "@mui/material/styles";

interface PermissionCheckboxProps {
  row: any;
  handleCheckChange: (row: any, checked: boolean, isMulti?: boolean) => void;
  disabled: boolean;
  editMode: boolean;
  isRowChecked: boolean;
}

const StyledCheckbox = styled(Checkbox)(() => ({
  padding: 0,
  display: "block !important",
  "& .MuiSvgIcon-root": {
    display: "block !important",
  },
  "& .MuiDivider-root": {
    display: "block !important",
  },
}));

const StyledBoxIcon = styled(Box)<{ disabled: boolean; isRowChecked: boolean }>(
  ({ theme, disabled, isRowChecked }) => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: disabled
      ? theme.palette.mode === "dark"
        ? "rgb(130 151 181 / 31%)"
        : "#DDDEDF"
      : isRowChecked
      ? theme.palette.mode === "dark"
        ? "#7cff6230"
        : "#ebf5e9"
      : theme.palette.mode === "dark"
      ? "#ffabab57"
      : "#f5e9e9",
  })
);

const StyledDoneOutlinedIcon = styled(DoneOutlinedIcon)(() => ({
  fontSize: "small",
  color: "#289E20",
}));

const StyledHorRuleOutlinedIcon = styled(HorizontalRuleOutlinedIcon)(() => ({
  fontSize: "small",
  color: "#ff0600",
}));

const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
  row,
  handleCheckChange,
  disabled = false,
  editMode,
  isRowChecked,
}) => {
  const [checked, setChecked] = useState(isRowChecked);

  useEffect(() => {
    setChecked(isRowChecked);
  }, [isRowChecked]);

  const handleChange = (event: any) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    handleCheckChange(row, isChecked);
  };

  return (
    <Box paddingX={"20px"}>
      <Box paddingX={"20px"} hidden={!editMode}>
        <Box
          display={"flex"}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <StyledCheckbox
            disabled={disabled}
            checked={checked}
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Box paddingX={"10px"} hidden={editMode}>
        <StyledBoxIcon disabled={disabled} isRowChecked={isRowChecked}>
          {isRowChecked ? (
            <StyledDoneOutlinedIcon
              style={{
                color: disabled ? "rgb(44, 54, 68)" : "",
              }}
            />
          ) : (
            <StyledHorRuleOutlinedIcon />
          )}
        </StyledBoxIcon>
      </Box>
    </Box>
  );
};

export default PermissionCheckbox;
