import { Box, Grid } from "@mui/material";
import GhostBtn from "../Button/GhostBtn";
import PrimaryBtn from "../Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import TextField from "../Field/TextField";
import Select from "../Field/Select";
import ClosableModal from "./ClosableModal";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";

interface ConfigurationType {
  value?: string;
  type: string;
  label: string;
  name?: string;
  onChangeFunction: (val: string) => void;
  listData?: { label: string; value: string }[];
  key?: string;
}

interface CrudFormModalProps {
  configuration: ConfigurationType[];
  onCancelClickFunction: () => void;
  onSaveClickFunction: (fields: any, data: any) => void;
  isModalOpen: boolean;
  title: string;
  data?: any;
  disableSave?: () => boolean;
  requiredFields?: string[];
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
}));

const StyledContent = styled(Grid)(({ theme }: any) => ({
  ...theme.ModalBody,
}));

const StyledCheckIcon = styled(CheckIcon)(() => ({
  width: 16,
  height: 14,
  marginLeft: 5,
}));

const CrudFormModal: React.FC<CrudFormModalProps> = ({
  configuration,
  onCancelClickFunction,
  onSaveClickFunction,
  isModalOpen,
  title,
  data,
  disableSave,
  requiredFields,
}) => {
  const { t } = useTranslation();

  const [fields, setFields] = useState<any>();

  let isFormInvalid = false;

  useEffect(() => {
    setFields({ ...data });
  }, [data]);

  const onChangeFieldValue = (key: string, value: string) => {
    setFields({ ...fields, [key]: value });
  };

  const getField = (field: any) => {
    isFormInvalid =
      requiredFields?.some((fieldName) => !fields?.[fieldName]) || false;

    switch (field.type) {
      case "text":
        return (
          <TextField
            size={"default"}
            isDisabled={field.isDisabled}
            label={t(field.label)}
            value={field.value}
            multiline={field.multiline}
            onChange={(val: string) => {
              field.onChangeFunction(val);
              onChangeFieldValue(field.name, val);
            }}
            fieldName={field?.key}
          />
        );
      case "list":
        return (
          <Select
            size={"default"}
            disabled={field.isDisabled}
            label={t(field.label)}
            value={field.value}
            data={field.listData}
            onChange={(val) => {
              field.onChangeFunction(val);
              onChangeFieldValue(field.name, val);
            }}
            data-testid={field?.key}
          />
        );
    }
  };

  return (
    <ClosableModal
      onClose={onCancelClickFunction}
      open={isModalOpen}
      includeHeader={true}
      width={400}
      title={t(title)}
      disableBackdropClick={true}
      titleFontWeight={"600"}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <StyledContent container spacing={2} direction={"column"}>
            {configuration.map((field, index) => (
              <Grid item key={index}>
                {getField(field)}
              </Grid>
            ))}
          </StyledContent>
        </Box>
        <StyledFooter
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box marginRight={"10px"}>
            <GhostBtn
              onClick={onCancelClickFunction}
              data-testid={"cancel-button"}
            >
              {t("cancel")}
            </GhostBtn>
          </Box>
          <PrimaryBtn
            onClick={() => onSaveClickFunction(fields, data)}
            backgroundColor={"#289E20"}
            disabled={isFormInvalid || (disableSave ? disableSave() : false)}
            endIcon={<StyledCheckIcon />}
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default CrudFormModal;
