import React from "react";
import { Box } from "@mui/system";
import { IconButton, ToggleButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTranslation } from "react-i18next";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { ReturnDefinitionType } from "../../../../types/returnDefinition.type";

interface ReturnDefinitionsGeneralInfoProps {
  data: ReturnDefinitionType;
  setIsDetailPageOpen: (open: boolean) => void;
  setGeneralInfoEditMode: (mode: boolean) => void;
  setData: (data: ReturnDefinitionType) => void;
}

const StyledTypography = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.textColor,
  fontSize: 14,
  marginRight: 5,
}));

const StyledToggleButtonBox = styled(Box)(({ theme }) => ({
  "&.active": {
    "& .MuiButtonBase-root": {
      color: "#FFFFFF !important",
      backgroundColor: `${theme.palette.primary.main} !important`,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(
  ({ theme }: { theme: any }) => ({
    height: 25,
    width: "fit-content",
    padding: "3px 5px 3px 5px",
    color: "#8695B1 !important",
    fontSize: 12,
    fontWeight: 500,
    textTransform: "capitalize",
    border: "none !important",
    cursor: "default",
    "&:hover": {
      backgroundColor: theme.palette.buttons.secondary.backgroundColor,
      color:
        theme.palette.mode === "dark"
          ? "#FFFFFF !important"
          : "#596D89 !important",
    },
  })
);

const StyledSecondaryText = styled(Typography)({
  color: "#9AA7BE",
  fontSize: 12,
  marginRight: 5,
});

const StyledFlexItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "5px",
});

const ReturnDefinitionsGeneralInfo: React.FC<
  ReturnDefinitionsGeneralInfoProps
> = ({ data, setIsDetailPageOpen, setGeneralInfoEditMode, setData }) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <Box p={"0 10px"}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display={"flex"}>
          <StyledToggleButtonBox
            sx={{ marginRight: "5px" }}
            className={data.manualInput ? "active" : ""}
          >
            <StyledToggleButton
              value={data.manualInput ? data.manualInput : ""}
            >
              {t("manual")}
            </StyledToggleButton>
          </StyledToggleButtonBox>
          <StyledToggleButtonBox
            sx={{ marginRight: "5px" }}
            className={data.disable ? "active" : ""}
          >
            <StyledToggleButton value={data.disable ? data.disable : ""}>
              {t("disabled")}
            </StyledToggleButton>
          </StyledToggleButtonBox>
        </Box>
        <Box>
          {hasPermission(PERMISSIONS.FINA_RETURN_DEFINITION_AMEND) && (
            <IconButton
              onClick={() => {
                setGeneralInfoEditMode(true);
              }}
              style={{ background: "none", border: "none" }}
            >
              <EditIcon sx={{ color: "#8695B1", fontSize: 14 }} />
            </IconButton>
          )}

          <IconButton
            onClick={() => {
              setIsDetailPageOpen(false);
              setData({} as ReturnDefinitionType);
            }}
            style={{ background: "none", border: "none" }}
          >
            <CloseRoundedIcon sx={{ color: "#8695B1", fontSize: 14 }} />
          </IconButton>
        </Box>
      </Box>
      <StyledFlexItem>
        <StyledTypography fontWeight={600}>{data.code}</StyledTypography>
        <Typography color={"#9AA7BE"} fontSize={12} ml={"5px"}>
          {data.name}
        </Typography>
      </StyledFlexItem>
      <StyledFlexItem>
        <StyledSecondaryText>{t("returnType")} :</StyledSecondaryText>
        <Typography fontSize={14}>{data.returnType?.code}</Typography>
      </StyledFlexItem>
      <StyledFlexItem>
        <StyledSecondaryText>{t("description")} :</StyledSecondaryText>
        <Typography fontSize={14}>{data.name}</Typography>
      </StyledFlexItem>
    </Box>
  );
};

export default ReturnDefinitionsGeneralInfo;
