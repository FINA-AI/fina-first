import TextField from "../../../common/Field/TextField";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import React, { useState } from "react";
import { styled } from "@mui/system";
import { FiTypeDataType } from "../../../../types/fi.type";

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const StyledCheckIcon = styled(CheckIcon)(() => ({
  width: 16,
  height: 14,
  marginLeft: "5px",
}));

const StyledContent = styled(Grid)(() => ({
  padding: 30,
}));

interface FiTypeCreateFormProps {
  onSave: (fiType: FiTypeDataType) => void;
  onCancel: () => void;
  currFiType?: Partial<FiTypeDataType>;
}

const FiTypeCreateForm: React.FC<FiTypeCreateFormProps> = ({
  onSave,
  onCancel,
  currFiType,
}) => {
  const { t } = useTranslation();
  const [fiType, setFiType] = useState(
    currFiType
      ? currFiType
      : {
          code: "",
          version: 0,
          nameStrId: 0,
          name: "",
          descriptionModel: null,
          activeFisCount: 0,
          inactiveFisCount: 0,
        }
  );

  const onChangeValue = (
    key: keyof FiTypeDataType,
    value: string | number | null
  ) => {
    setFiType((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
    >
      <Box display={"flex"} flex={1}>
        <StyledContent container spacing={2} direction={"column"}>
          <Grid item>
            <TextField
              label={t("personCreateName")}
              value={fiType.name}
              onChange={(value: string) => onChangeValue("name", value)}
              size={"default"}
              fieldName={"name"}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t("code")}
              value={fiType.code}
              onChange={(value: string) => onChangeValue("code", value)}
              size={"default"}
              pattern={/^[\x00-\x7F]*$/}
              fieldName={"code"}
            />
          </Grid>
        </StyledContent>
      </Box>
      <StyledFooter>
        <GhostBtn
          onClick={() => {
            onCancel();
          }}
        >
          {t("cancel")}
        </GhostBtn>
        &#160;&#160;
        <PrimaryBtn
          onClick={() => {
            onCancel();
            onSave(fiType as FiTypeDataType);
          }}
          disabled={!(fiType.code || "").trim() || !(fiType.name || "").trim()}
          endIcon={<StyledCheckIcon />}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </Box>
  );
};

export default FiTypeCreateForm;
