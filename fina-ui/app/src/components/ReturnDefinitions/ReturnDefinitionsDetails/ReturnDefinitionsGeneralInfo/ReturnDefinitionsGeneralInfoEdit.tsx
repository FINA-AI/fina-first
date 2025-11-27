import { Box } from "@mui/system";
import { ToggleButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "../../../common/Field/TextField";
import Select from "../../../common/Field/Select";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import {
  ReturnDefinitionTable,
  ReturnDefinitionType,
  ReturnType,
} from "../../../../types/returnDefinition.type";

interface Props {
  data: ReturnDefinitionType;
  setData: (data: ReturnDefinitionType) => void;
  setGeneralInfoEditMode: (mode: boolean) => void;
  saveReturnDefinition: (data: ReturnDefinitionType) => void;
  returnTypes: ReturnType[];
  setIsDetailPageOpen: (value: boolean) => void;
  onCancel: VoidFunction;
  tables: ReturnDefinitionTable[];
}

const StyledGeneralInfoHeader = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: theme.palette.borderColor,
  padding: "0 10px",
  paddingBottom: 10,
}));

const StyledEditToggleButton = styled(ToggleButton)({
  height: 25,
  width: "fit-content",
  padding: "3px 5px 3px 5px",
  color: "#707C93 !important",
  fontSize: 12,
  fontWeight: 500,
  textTransform: "capitalize",
  borderRadius: 30,
});

const StyledDivider = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light" ? "#DFDFDF" : "rgb(125,129,157)",
  height: 1,
  width: "100%",
  marginTop: 10,
}));

const StyledEditFieldBox = styled(Box)({
  marginTop: "15px",
});

const StyledEditReturnsText = styled(Box)(({ theme }: { theme: any }) => ({
  color: theme.palette.textColor,
  fontSize: 14,
  fontWeight: 600,
}));

const StyledSaveBox = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
  marginLeft: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));

const StyledCancel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  padding: 0,
  paddingRight: 4,
  color:
    theme.palette.mode === "light"
      ? "rgba(104, 122, 158, 0.8)"
      : "rgba(140,156,192,0.8)",
  borderRight: "1px solid rgba(104, 122, 158, 0.8)",
  cursor: "pointer",
}));

const StyledToggleButtonBox = styled(Box)(({ theme }) => ({
  marginRight: "5px",
  "&.active": {
    "& .MuiButtonBase-root": {
      color: "#FFFFFF !important",
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const ReturnDefinitionsGeneralInfoEdit: React.FC<Props> = ({
  data,
  setData,
  setGeneralInfoEditMode,
  saveReturnDefinition,
  returnTypes,
  setIsDetailPageOpen,
  onCancel,
  tables,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [generalInfoData, setGeneralInfoData] =
    useState<ReturnDefinitionType>();

  const isAddNew = !data?.id || data.id === 0;
  useEffect(() => {
    setGeneralInfoData(data);
  }, []);

  return (
    <Box>
      <StyledGeneralInfoHeader>
        <StyledEditReturnsText>
          <Typography fontWeight={"inherit"}>
            {t(`${isAddNew ? "addNew" : "editReturnDefinitions"}`)}
          </Typography>
        </StyledEditReturnsText>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <StyledCancel
            onClick={() => {
              onCancel();
              if (!generalInfoData?.id) {
                setIsDetailPageOpen(false);
              }
              setGeneralInfoEditMode(false);
              setData({ ...data, ...generalInfoData });
            }}
          >
            {t("cancel")}
          </StyledCancel>
          <StyledSaveBox
            onClick={() => {
              const payload = {
                ...data,
                tables: tables,
              };
              if (data.code?.trim().length) {
                saveReturnDefinition(payload);
              } else {
                enqueueSnackbar(t("codeIsRequired"), { variant: "warning" });
              }
            }}
          >
            <Typography fontSize={"inherit"} mr={"3px"}>
              {t("save")}
            </Typography>
            <CheckIcon fontSize={"inherit"} />
          </StyledSaveBox>
        </Box>
      </StyledGeneralInfoHeader>
      <Box sx={{ paddingTop: "15px !important", padding: "0 10px" }}>
        <Box>
          <TextField
            value={data.code}
            onChange={(val: string) => {
              setData({
                ...data,
                code: val,
              });
            }}
            label={t("code")}
            size={"small"}
          />
        </Box>
        <StyledEditFieldBox>
          <TextField
            value={data.name}
            onChange={(val: string) => {
              setData({ ...data, name: val });
            }}
            label={t("description")}
            size={"small"}
          />
        </StyledEditFieldBox>
        <StyledEditFieldBox>
          <Select
            value={data.returnType?.code}
            data={returnTypes.map((item) => {
              return { label: item.code, value: item.code };
            })}
            onChange={(val) => {
              let returnType = returnTypes.find((item) => item.code === val);
              if (returnType) setData({ ...data, returnType: returnType });
            }}
            label={t("returnType")}
            size={"small"}
          />
        </StyledEditFieldBox>
        <StyledEditFieldBox>
          <TextField
            value={data.generalInfo}
            onChange={(val: string) => setData({ ...data, generalInfo: val })}
            label={t("contactPerson")}
            size={"small"}
          />
        </StyledEditFieldBox>
        <StyledDivider />
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <StyledToggleButtonBox className={data.manualInput ? "active" : ""}>
            <StyledEditToggleButton
              onClick={() => {
                setData({
                  ...data,
                  manualInput: data.manualInput ? !data.manualInput : true,
                });
              }}
              value={data.manualInput ? data.manualInput : ""}
            >
              {t("manualInput")}
            </StyledEditToggleButton>
          </StyledToggleButtonBox>
          <StyledToggleButtonBox className={data.disable ? "active" : ""}>
            <StyledEditToggleButton
              onClick={() => {
                setData({
                  ...data,
                  disable: data.disable ? !data.disable : true,
                });
              }}
              value={data.disable ? data.disable : ""}
            >
              {t("disable")}
            </StyledEditToggleButton>
          </StyledToggleButtonBox>
        </Box>
      </Box>
    </Box>
  );
};

export default ReturnDefinitionsGeneralInfoEdit;
