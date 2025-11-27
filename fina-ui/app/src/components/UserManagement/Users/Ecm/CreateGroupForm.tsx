import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import TextField from "../../../common/Field/TextField";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import { updateUserEcm } from "../../../../api/services/userManagerService";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/system";
import { ECMData } from "../../../../types/ecm.type";

interface CreateGroupFormProps {
  onCancel: VoidFunction;
  ecmData: ECMData[];
  setEcmData: React.Dispatch<React.SetStateAction<ECMData[]>>;
}

type Data = { id: string; displayName: string };

const StyledModalBox = styled(Box)(({ theme }) => ({
  height: 200,
  padding: 20,
  borderTop: theme.palette.borderColor,
  borderBottom: theme.palette.borderColor,
}));

const StyledFooterBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: "15px",
  background: theme.palette.paperBackground,
}));

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onCancel,
  ecmData,
  setEcmData,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const [data, setData] = useState<Data>({} as Data);

  const setValue = (key: string, value: string) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const onSubmit = () => {
    updateUserEcm({
      id: data?.id,
      displayName: data?.displayName,
    })
      .then((resp) => {
        enqueueSnackbar(t("addNewItem"), {
          variant: "success",
        });
        onCancel();
        setEcmData([...ecmData, resp.data]);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  return (
    <Box>
      <StyledModalBox>
        <Stack spacing={2}>
          <TextField
            size={"default"}
            label={t("code")}
            onChange={(value: string) => {
              setValue("id", value);
            }}
          />
          <TextField
            size={"default"}
            label={t("description")}
            onChange={(value: string) => {
              setValue("displayName", value);
            }}
          />
        </Stack>
      </StyledModalBox>
      <StyledFooterBox>
        <GhostBtn onClick={onCancel}>{t("cancel")}</GhostBtn>
        <Box marginLeft={"5px"}>
          <PrimaryBtn
            variant="contained"
            color="primary"
            endIcon={<DoneIcon />}
            onClick={onSubmit}
          >
            {t("save")}
          </PrimaryBtn>
        </Box>
      </StyledFooterBox>
    </Box>
  );
};

export default CreateGroupForm;
