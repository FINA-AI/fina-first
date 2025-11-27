import React, { FC, useEffect, useState } from "react";
import ClosableModal from "../../common/Modal/ClosableModal";
import { Box, Grid, Typography } from "@mui/material";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import DoneIcon from "@mui/icons-material/Done";
import TextField from "../../common/Field/TextField";
import Select from "../../common/Field/Select";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import { MainMatrixDataType } from "../../../types/matrix.type";
import { FiTypeDataType } from "../../../types/fi.type";
import { PeriodDefinitionType } from "../../../types/period.type";
import { returnVersionDataType } from "../../../types/returnVersion.type";
import SwitchBtn from "../../common/Button/SwitchBtn";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled(Box)(() => ({
  overflow: "auto",
}));

export const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  padding: 0,
}));

export const StyledCheckIcon = styled(DoneIcon)(() => ({
  width: 16,
  height: 14,
}));

export const StyledContent = styled(Grid)(() => ({
  padding: 30,
}));

interface MainMatrixAddModalProps {
  fiTypes: FiTypeDataType[];
  periodTypes: PeriodDefinitionType[];
  returnVersions: returnVersionDataType[];
  selectedMatrix?: MainMatrixDataType;
  onSave: (data: MainMatrixDataType) => void;
  isAddModalOpen: {
    open: boolean;
    data?: MainMatrixDataType;
  };
  setIsAddModalOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      data?: MainMatrixDataType;
    }>
  >;
}

const MainMatrixAddModal: FC<MainMatrixAddModalProps> = ({
  fiTypes,
  periodTypes,
  returnVersions,
  selectedMatrix,
  onSave,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { t } = useTranslation();

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isRegAdvancedDisabled, setIsRegAdvancedDisabled] =
    useState<boolean>(true);
  const [currData, setCurrData] = useState<MainMatrixDataType>(
    (selectedMatrix || {
      enable: true,
      processEngine: "FINA",
    }) as MainMatrixDataType
  );

  useEffect(() => {
    selectedMatrix && setCurrData({ ...selectedMatrix } as MainMatrixDataType);
  }, [selectedMatrix]);

  const onChangeValue = (
    key: keyof MainMatrixDataType,
    value: MainMatrixDataType[keyof MainMatrixDataType]
  ) => {
    (currData[key] as any) = value;
    setCurrData({ ...currData });

    checkedMatrixValid(currData);
  };

  const checkedMatrixValid = (data: any) => {
    const engineValidation = () => {
      if (data.processEngine && data.processEngine !== "REG_ADVANCED") {
        return true;
      }
      if (data.processEngine === "REG_ADVANCED" && data.regFileType) {
        return true;
      }
      return false;
    };

    setIsSaveDisabled(
      !(
        data.pattern &&
        data.fiTypeModel &&
        data.periodType &&
        data.returnVersion &&
        ("digitalSignatureCheckEnabled" in data
          ? String(data.digitalSignatureCheckEnabled)
          : data.digitalSignatureCheckEnabled) &&
        engineValidation()
      )
    );
    if (data.processEngine !== "REG_ADVANCED") {
      if (currData?.regFileType) {
        delete currData.regFileType;
        setCurrData(currData);
      }
      setIsRegAdvancedDisabled(true);
    } else {
      setIsRegAdvancedDisabled(false);
    }
  };

  return (
    <ClosableModal
      onClose={() => {
        setIsAddModalOpen({ open: false });
      }}
      open={isAddModalOpen.open}
      includeHeader={true}
      width={700}
      title={currData?.id ? t("edit") : t("Add")}
      disableBackdropClick={true}
    >
      <StyledRoot
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <StyledContent container spacing={2} direction={"row"}>
            <Grid item xs={6}>
              <Grid container spacing={2} direction={"column"}>
                <Grid item>
                  <CustomAutoComplete
                    label={t("fiTypes")}
                    data={fiTypes}
                    selectedItem={currData?.fiTypeModel}
                    displayFieldName={"name"}
                    valueFieldName={"id"}
                    onChange={(v) => {
                      onChangeValue("fiTypeModel", v);
                    }}
                    size={"default"}
                    displayFieldFunction={(option) => {
                      return `${option.code} / ${option.name}`;
                    }}
                    allowInvalidInputSelection
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label={"pattern"}
                    value={currData?.pattern}
                    onChange={(v: string) => {
                      onChangeValue("pattern", v);
                    }}
                    size={"default"}
                  />
                </Grid>

                <Grid item>
                  <CustomAutoComplete
                    label={t("periodType")}
                    data={periodTypes}
                    selectedItem={currData?.periodType}
                    valueFieldName={"id"}
                    onChange={(v) => {
                      onChangeValue("periodType", v);
                    }}
                    size={"default"}
                    displayFieldFunction={(option) => {
                      return `${option.code} / ${option.name}`;
                    }}
                    allowInvalidInputSelection
                  />
                </Grid>

                <Grid item>
                  <CustomAutoComplete
                    label={t("returnVersion")}
                    data={returnVersions}
                    selectedItem={currData?.returnVersion}
                    displayFieldName={"code"}
                    valueFieldName={"id"}
                    onChange={(v) => {
                      onChangeValue("returnVersion", v);
                    }}
                    size={"default"}
                    allowInvalidInputSelection
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2} direction={"column"}>
                <Grid item>
                  <Select
                    label={t("signaturecheck")}
                    data={[
                      { label: "Yes", value: "true" },
                      { label: "No", value: "false" },
                    ]}
                    value={currData?.digitalSignatureCheckEnabled?.toString()}
                    onChange={(v) => {
                      onChangeValue("digitalSignatureCheckEnabled", v);
                    }}
                    size={"default"}
                  />
                </Grid>

                <Grid item>
                  <Select
                    label={t("engine")}
                    data={[
                      { label: "FINA", value: "FINA" },
                      { label: "REG", value: "REG" },
                      { label: "REG_ADVANCED", value: "REG_ADVANCED" },
                    ]}
                    value={currData?.processEngine}
                    onChange={(v) => {
                      onChangeValue("processEngine", v);
                    }}
                    size={"default"}
                  />
                </Grid>

                <Grid item>
                  <Select
                    label={t("regadvanced")}
                    data={
                      !isRegAdvancedDisabled ||
                      currData.processEngine === "REG_ADVANCED"
                        ? [
                            { label: t("create"), value: "CREATE" },
                            { label: t("update"), value: "UPDATE" },
                            { label: t("delete"), value: "DELETE" },
                          ]
                        : []
                    }
                    value={currData?.regFileType}
                    onChange={(v) => {
                      onChangeValue("regFileType", v);
                    }}
                    size={"default"}
                    disabled={isRegAdvancedDisabled}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label={"password"}
                    type={"text"}
                    value={currData?.password ?? ""}
                    onChange={(v: string) => {
                      onChangeValue("password", v);
                    }}
                    size={"default"}
                  />
                </Grid>
              </Grid>
            </Grid>
          </StyledContent>
        </Box>
        <StyledFooter display={"flex"} width={"100%"}>
          <Box
            display={"flex"}
            flex={1}
            justifyContent={"flex-start"}
            alignItems={"center"}
            paddingLeft={"18px"}
          >
            <Typography>{t("enabled")} </Typography>
            <Box pl={"5px"}>
              <SwitchBtn
                onClick={() => {
                  onChangeValue("enable", !currData.enable);
                }}
                checked={currData.enable}
                size={"small"}
              />
            </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
            flex={1}
            padding={"8px 16px"}
          >
            <GhostBtn
              onClick={() => {
                setIsAddModalOpen({ open: false });
              }}
              style={{ marginRight: "10px" }}
            >
              {t("cancel")}
            </GhostBtn>
            <PrimaryBtn
              onClick={() => onSave(currData)}
              backgroundColor={"rgb(41, 98, 255)"}
              disabled={Boolean(isSaveDisabled)}
              endIcon={<StyledCheckIcon />}
            >
              {t("save")}
            </PrimaryBtn>
          </Box>
        </StyledFooter>
      </StyledRoot>
    </ClosableModal>
  );
};

export default MainMatrixAddModal;
