import { Box, Checkbox, Grid, Typography } from "@mui/material";
import PermitButton from "./PermitButton";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Tooltip from "../../../common/Tooltip/Tooltip";
import { styled } from "@mui/system";

interface UsersGroupCardsProps {
  permitted: boolean;
  name: string;
  text: string;
  editMode?: boolean;
  onCheck?: VoidFunction;
  index: number;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#2b3748" : "inherit",
  boxSizing: "border-box",
  border: theme.palette.borderColor,
  borderRadius: "4px",
  overflow: "hidden",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
  padding: "12px 16px",
  margin: 4,
  "&:hover": {
    background: theme.palette.mode === "dark" ? "#344258" : "#F5F5F5",
  },
}));

const StyledCheckBoxContainer = styled(Box)(() => ({
  marginLeft: -2,
  padding: "0 0 12px 0",
  display: "flex",
  alignItems: "center",
}));

const StyledCheckbox = styled(Checkbox)(() => ({
  "&.MuiCheckbox-root": {
    margin: 0,
    padding: 0,
  },
  "&.Mui-checked": {},
}));

const StyledTextBox = styled(Box)(({ theme }: any) => ({
  color: theme.palette.mode === "dark" ? "#ABBACE" : "",
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
}));

const StyledTypography = styled(Box)(() => ({
  fontWeight: 500,
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 13,
  marginBottom: 8,
}));

const UsersGroupCards: React.FC<UsersGroupCardsProps> = ({
  permitted,
  name,
  text,
  editMode,
  onCheck,
  index,
}) => {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState(false);

  const onMouseEnterFunction = (event: any) => {
    setTooltip(event.target.scrollWidth > event.target.clientWidth);
  };

  return (
    <Grid item xs={3} data-testid={"item-" + index}>
      <StyledBox
        onClick={() => {
          if (editMode) {
            onCheck?.();
          }
        }}
      >
        {editMode ? (
          <StyledCheckBoxContainer>
            <StyledCheckbox
              onClick={onCheck}
              checked={permitted}
              size="small"
              data-testid={"checkbox"}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                marginLeft: "5px",
              }}
            >
              {t("permission")}
            </Typography>
          </StyledCheckBoxContainer>
        ) : (
          <Box>
            <PermitButton permitted={permitted} />
          </Box>
        )}
        <Tooltip title={tooltip ? name : ""} arrow>
          <StyledTypography
            onMouseEnter={(event) => onMouseEnterFunction(event)}
            data-testid={"code"}
          >
            {name}
          </StyledTypography>
        </Tooltip>
        <Tooltip title={tooltip ? text : ""} arrow>
          <StyledTextBox
            onMouseEnter={(event) => onMouseEnterFunction(event)}
            data-testid={"description"}
          >
            {text}
          </StyledTextBox>
        </Tooltip>
      </StyledBox>
    </Grid>
  );
};

export default UsersGroupCards;
