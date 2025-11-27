import ClosableModal from "../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import TextField from "../common/Field/TextField";
import { Box } from "@mui/system";
import Select from "../common/Field/Select";
import React, { useEffect, useState } from "react";
import GhostBtn from "../common/Button/GhostBtn";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { Grid } from "@mui/material";
import SimpleLoadMask from "../common/SimpleLoadMask";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/material/styles";
import { Return } from "../../types/return.type";
import { ReturnVersion } from "../../types/importManager.type";

interface ReturnSaveAsModalProps {
  onClose: VoidFunction;
  returnVersions: ReturnVersion[];
  selectedReturns: Partial<Return>[];
  saveAsModalOpen: boolean;
  actionStatus: string;
  onSaveActionStatusHandler(
    selectedReturn: Partial<Return>[],
    reportStatus?: string,
    note?: string
  ): Promise<void>;
  onSave(
    selectedReturns: Partial<Return>[],
    returnStatus?: string | number,
    note?: string
  ): Promise<void>;
}

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.pagePaging({ size: "default" }),
  ...theme.modalFooter,
  justifyContent: "space-evenly",
  padding: "10px",
}));

const StyledRoot = styled(Grid)({
  padding: "28px 16px 16px 32px",
  overflow: "hidden",
  "& .MuiGrid-item": {
    padding: "0px",
    display: "flex",
    alignItems: "flex-start",
  },
  "& .MuiFormControl-root": {
    width: "100%",
  },
});

const ReturnSaveAsModal: React.FC<ReturnSaveAsModalProps> = ({
  onClose,
  onSave,
  returnVersions,
  selectedReturns,
  saveAsModalOpen,
  actionStatus,
  onSaveActionStatusHandler,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const [selectedVersionId, setSelectedVersionId] = useState<number | string>();
  const [note, setNote] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedVersionId(returnVersions[0]?.id);
  }, [returnVersions]);

  const getSaveAsRequestModel = () => {
    let res;

    if (selectedReturns && selectedReturns[0]?.group) {
      let packageElement = { ...selectedReturns[0] };
      delete packageElement.children;
      delete packageElement.id;

      res = [packageElement];
    } else {
      res = selectedReturns;
    }

    return res;
  };
  return (
    <ClosableModal
      onClose={onClose}
      open={saveAsModalOpen}
      width={748}
      height={392}
      includeHeader={true}
      padding={"10 20"}
      titleFontWeight={"700"}
      title={actionStatus !== "saveAs" ? t("changeReturnStatus") : t("saveAs")}
    >
      {saving ? (
        <SimpleLoadMask
          loading={true}
          message={"Saving Please Wait"}
          color={"primary"}
        />
      ) : (
        <></>
      )}
      <Box
        display={"flex"}
        width={"100%"}
        height={"100%"}
        overflow={"hidden"}
        flexDirection={"column"}
      >
        <Box width={"100%"} height={"100%"}>
          <StyledRoot container direction={"row"} spacing={2}>
            <Grid item xs={12}>
              <Box pt={"10px"} pb={"10px"} width={"100%"}>
                {actionStatus === "saveAs" ? (
                  <Select
                    label={t("returnVersion")}
                    value={selectedVersionId}
                    data={returnVersions.map((rv) => ({
                      label: `${rv.code} - ${rv.name}`,
                      value: rv.id,
                    }))}
                    onChange={(v) => {
                      setSelectedVersionId(v);
                    }}
                    data-testid={"return-version-select"}
                  />
                ) : (
                  <TextField
                    label={t("status")}
                    onChange={(event: any) => setNote(event.target.value)}
                    value={actionStatus}
                    fieldName={"status"}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("note")}
                multiline={true}
                rows={8}
                onChange={(v: string) => {
                  setNote(v);
                }}
                fieldName={"note"}
              />
            </Grid>
          </StyledRoot>
        </Box>

        <StyledFooter display={"flex"} justifyContent={"space-evenly"}>
          <Box display={"flex"} justifyContent={"flex-end"} flex={1}>
            <GhostBtn
              style={{ marginRight: "10px" }}
              onClick={onClose}
              data-testid={"cancel-button"}
            >
              {t("cancel")}
            </GhostBtn>
            <PrimaryBtn
              onClick={async () => {
                setSaving(true);
                try {
                  if (actionStatus === "saveAs") {
                    const model = getSaveAsRequestModel();

                    await onSave(model, selectedVersionId, note);
                  } else {
                    let returnStatus;
                    if (actionStatus === "Rejected") {
                      returnStatus = "STATUS_REJECTED";
                    } else if (actionStatus === "Reseted") {
                      returnStatus = "STATUS_RESETED";
                    } else if (actionStatus === "Accepted") {
                      returnStatus = "STATUS_ACCEPTED";
                    }

                    await onSaveActionStatusHandler(
                      selectedReturns,
                      returnStatus,
                      note
                    );
                  }

                  enqueueSnackbar(t("returnSaved"), { variant: "success" });
                } catch (error) {
                  openErrorWindow(error, t("error"), true);

                  console.log(error);
                  setSaving(false);
                }
              }}
              endIcon={<CheckRoundedIcon />}
              data-testid={"save-button"}
            >
              {t("save")}
            </PrimaryBtn>
          </Box>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default ReturnSaveAsModal;
