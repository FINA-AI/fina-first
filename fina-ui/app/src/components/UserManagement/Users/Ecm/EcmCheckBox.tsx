import { Box } from "@mui/system";
import { Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import { styled } from "@mui/material/styles";
import { ECMData } from "../../../../types/ecm.type";
import { UserType } from "../../../../types/user.type";

interface EcmCheckBoxProps {
  row: ECMData;
  editMode: boolean;
  currUser: Partial<UserType>;
  handleCheckChange(row: ECMData): void;
}

const StyledCheckBox = styled(Checkbox)(() => ({
  padding: 0,
  display: "block !important",
  "& .MuiSvgIcon-root": {
    display: "block !important",
  },
  "& .MuiDivider-root": {
    display: "block !important",
  },
}));

const StyledBoxIcon = styled(Box)<{ checked: boolean }>(
  ({ checked, theme }) => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: checked
      ? theme.palette.mode === "dark"
        ? "#079455"
        : "#ebf5e9"
      : theme.palette.mode === "dark"
      ? "#B42318"
      : "#ffecec",
  })
);

const StyledDoneOutlinedIcon = styled(DoneOutlinedIcon)(({ theme }) => ({
  fontSize: "small",
  color: theme.palette.mode === "dark" ? "#ABEFC6" : "#289E20",
}));

const StyledHorizontalRuleOutlinedIcon = styled(HorizontalRuleOutlinedIcon)(
  ({ theme }) => ({
    fontSize: "small",
    color: theme.palette.mode === "dark" ? "#FEE4E2" : "#ff0600",
  })
);

const EcmCheckBox: React.FC<EcmCheckBoxProps> = ({
  editMode,
  row,
  handleCheckChange,
  currUser,
}) => {
  const [checked, setChecked] = useState(row.checked);

  useEffect(() => {
    setChecked(row.checked);
  }, [currUser.id]);

  return (
    <Box paddingX={"20px"}>
      <Box paddingX={"20px"} hidden={!editMode}>
        <Box
          display={"flex"}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StyledCheckBox
            checked={checked}
            onChange={() => {
              row.checked = !checked;
              setChecked(!checked);
              handleCheckChange(row);
            }}
          />
        </Box>
      </Box>
      <Box paddingX={"20px"} hidden={editMode}>
        <StyledBoxIcon checked={checked}>
          {checked ? (
            <StyledDoneOutlinedIcon />
          ) : (
            <StyledHorizontalRuleOutlinedIcon />
          )}
        </StyledBoxIcon>
      </Box>
    </Box>
  );
};

export default EcmCheckBox;
