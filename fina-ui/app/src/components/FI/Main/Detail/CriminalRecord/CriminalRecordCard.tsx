import { useTranslation } from "react-i18next";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIconMui from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "../../../../common/Field/TextField";
import NumberField from "../../../../common/Field/NumberField";
import DatePicker from "../../../../common/Field/DatePicker";
import React, { useState } from "react";
import { Currencies, getFormattedDateValue } from "../../../../../util/appUtil";
import useConfig from "../../../../../hoc/config/useConfig";
import ConfirmModal from "../../../../common/Modal/ConfirmModal";
import TextButton from "../../../../common/Button/TextButton";
import RestoreIcon from "@mui/icons-material/Restore";
import FICriminalRecordHistoryContainer from "../../../../../containers/FI/Main/CriminalRecord/FICriminalRecordHistoryContainer";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import Select from "../../../../common/Field/Select";
import { CriminalRecordDataType } from "../../../../../types/fi.type";
import { CancelIcon } from "../../../../../api/ui/icons/CancelIcon";

const iconCommonStyles = (theme: any) => ({
  color: theme.palette.mode === "dark" ? "#5D789A" : "",
  cursor: "pointer",
  fontSize: "20px",
  ...theme.smallIcon,
});

const StyledRestoreIcon = styled(RestoreIcon)(({ theme }) => ({
  ...iconCommonStyles(theme),
}));

const StyledEditIconMui = styled(EditIconMui)(({ theme }) => ({
  ...iconCommonStyles(theme),
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  color: "#FF4128",
  cursor: "pointer",
  fontSize: "20px",
  ...theme.smallIcon,
}));

const StyledContainerView = styled(Box)({
  wrap: "nowrap",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
});

const StyledColumnContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "auto",
});

const StyledFieldColumnContainer = styled(Box)({
  padding: "4px",
  width: "100%",
});

const StyledContainerItem = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "20px",
  width: "auto",
  padding: 8,
}));

const StyledRoot = styled(Grid, {
  shouldForwardProp: (prop: string) => prop !== "isView",
})<{ isView: boolean }>(({ theme, isView }) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: isView ? "4px 20px" : "16px 0px 0px 0px",
  marginBottom: "8px",
  background: theme.palette.mode === "dark" ? "#344258" : "#F9F9F9",
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 500,
  fontSize: 11,
  paddingBottom: 2,
  lineHeight: "12px",
}));

interface CriminalRecordCardProps {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: { editable: number | null };
  setEditMode: React.Dispatch<
    React.SetStateAction<{ editable: number | null }>
  >;
  item: any;
  onAdd: (record: CriminalRecordDataType) => void;
  onEdit: (record: CriminalRecordDataType) => void;
  onDeleteButton?: () => void;
  dataTestId?: string;
}

const CriminalRecordCard: React.FC<CriminalRecordCardProps> = ({
  setAddNew,
  item,
  editMode,
  setEditMode,
  onAdd,
  onEdit,
  onDeleteButton,
  dataTestId,
}) => {
  const { hasPermission } = useConfig();
  const [currRecord, setCurrentRecord] = useState(item);
  const isView =
    editMode.editable !== currRecord.id &&
    editMode.editable !== currRecord.editable;

  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const getCurrRecordClone = () => {
    if (item) {
      return JSON.parse(JSON.stringify(item));
    }
  };

  const onCancel = () => {
    setEditMode({ editable: null });
    setAddNew(false);
    setCurrentRecord(getCurrRecordClone());
  };
  const handleCancel = () => {
    onCancel();
    setIsCancelModalOpen(false);
  };

  const handleSave = () => {
    if (!currRecord["currency"]) {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
      return;
    }
    setEditMode({ editable: null });
    setAddNew(false);
    onAdd(currRecord);
  };

  const onValueChange = (value: any, name: keyof CriminalRecordDataType) => {
    setCurrentRecord({ ...currRecord, [name]: value });
  };
  const onEditButton = () => {
    setEditMode({ editable: currRecord.id });
  };

  const getItem = (field: keyof CriminalRecordDataType, type?: string) => {
    return (
      <StyledContainerItem>
        <StyledTitle>
          {field === "type"
            ? t("typeOfViolation")
            : field === "currency"
            ? t("fiBeneficiaryCurrency")
            : t(field)}
        </StyledTitle>
        {type === "date"
          ? getFormattedDateValue(currRecord[field], getDateFormat(true))
          : currRecord[field]}
      </StyledContainerItem>
    );
  };

  const getItemField = (field: keyof CriminalRecordDataType, type: string) => {
    switch (type) {
      case "string":
        return (
          <StyledContainerItem>
            <TextField
              size={"default"}
              isDisabled={false}
              label={field === "type" ? t("typeOfViolation") : t(field)}
              value={currRecord[field] ? String(currRecord[field]) : ""}
              fieldName={field}
              onChange={(value: string) => {
                if (onValueChange) {
                  onValueChange(value, field);
                }
              }}
            />
          </StyledContainerItem>
        );
      case "number":
        return (
          <StyledContainerItem>
            <NumberField
              size={"default"}
              isDisabled={false}
              label={t(field)}
              value={currRecord[field] ? Number(currRecord[field]) : undefined}
              fieldName={field}
              format={"#"}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, field);
                }
              }}
            />
          </StyledContainerItem>
        );

      case "date":
        return (
          <StyledContainerItem>
            <DatePicker
              size={"default"}
              isDisabled={false}
              label={t(field)}
              value={currRecord[field]}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(
                    value ? new Date(value).getTime().toString() : null,
                    field
                  );
                }
              }}
              data-testid={field}
            />
          </StyledContainerItem>
        );

      case "currency":
        return (
          <StyledContainerItem>
            <Select
              data={Currencies.map((e) => ({
                label: t(`currency${e}`),
                value: e,
              }))}
              value={currRecord.currency}
              label={t("Currency")}
              onChange={(value) => {
                if (onValueChange) {
                  onValueChange(value, field);
                }
              }}
              isError={!currRecord[field]}
              data-testid={field + "-select"}
            />
          </StyledContainerItem>
        );
    }
  };

  return (
    <StyledRoot isView={isView} data-testid={dataTestId}>
      {!isView && (
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          sx={{ marginRight: "10px", marginLeft: "18px", marginBottom: "16px" }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <TextButton
              color={"secondary"}
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
              }}
              onClick={() => setIsCancelModalOpen(true)}
              data-testid={"cancel-button"}
            >
              {t("cancel")}
            </TextButton>
            <span
              style={{
                borderLeft: "1px solid #687A9E",
                height: "14px",
              }}
            />
            <TextButton
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
              }}
              onClick={() => {
                if (editMode.editable !== -1) onEdit(currRecord);
                else handleSave();
              }}
              endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
              data-testid={"save-button"}
            >
              {t("save")}
            </TextButton>
          </Box>
        </Box>
      )}

      {isView ? (
        <StyledContainerView display={"flex"}>
          <StyledColumnContainer>
            {getItem("courtDecision")}
            {getItem("fineAmount")}
          </StyledColumnContainer>

          <StyledColumnContainer>
            {getItem("courtDecisionNumber")}
            {getItem("currency")}
          </StyledColumnContainer>

          <StyledColumnContainer>
            {getItem("courtDecisionDate", "date")}
            {getItem("punishmentStartDate", "date")}
          </StyledColumnContainer>

          <StyledColumnContainer>
            {getItem("type")}
            {getItem("punishmentDate", "date")}
          </StyledColumnContainer>

          <Box>
            <Box display={"flex"} alignItems={"center"}>
              <IconButton
                onClick={() => {
                  setIsHistoryModalOpen(true);
                }}
                data-testid={"history-button"}
              >
                <StyledRestoreIcon />
              </IconButton>
              {hasPermission(PERMISSIONS.FI_AMEND) && (
                <IconButton
                  onClick={() => {
                    onEditButton();
                  }}
                  data-testid={"edit-button"}
                >
                  <StyledEditIconMui />
                </IconButton>
              )}
              {hasPermission(PERMISSIONS.FI_DELETE) && (
                <IconButton
                  onClick={onDeleteButton}
                  data-testid={"delete-button"}
                >
                  <StyledDeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </StyledContainerView>
      ) : (
        <Grid
          container
          direction={"row"}
          wrap={"nowrap"}
          sx={{ padding: "0 4px" }}
        >
          <Grid item xs={3} display={"flex"}>
            <StyledFieldColumnContainer>
              {getItemField("courtDecision", "string")}
              {getItemField("fineAmount", "number")}
            </StyledFieldColumnContainer>
          </Grid>
          <Grid item xs={3} display={"flex"}>
            <StyledFieldColumnContainer>
              {getItemField("courtDecisionNumber", "string")}
              {getItemField("currency", "currency")}
            </StyledFieldColumnContainer>
          </Grid>
          <Grid item xs={3} display={"flex"}>
            <StyledFieldColumnContainer>
              {getItemField("courtDecisionDate", "date")}
              {getItemField("punishmentStartDate", "date")}
            </StyledFieldColumnContainer>
          </Grid>
          <Grid item xs={3} display={"flex"}>
            <StyledFieldColumnContainer>
              {getItemField("type", "string")}
              {getItemField("punishmentDate", "date")}
            </StyledFieldColumnContainer>
          </Grid>
        </Grid>
      )}
      {isCancelModalOpen && (
        <ConfirmModal
          isOpen={isCancelModalOpen}
          setIsOpen={setIsCancelModalOpen}
          onConfirm={handleCancel}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          additionalBodyText={t("changes")}
          bodyText={t("cancelBodyText")}
          icon={<CancelIcon />}
        />
      )}
      {isHistoryModalOpen && (
        <FICriminalRecordHistoryContainer
          onCloseHistoryClick={() => {
            setIsHistoryModalOpen(false);
          }}
          criminalRecordId={item.id}
        />
      )}
    </StyledRoot>
  );
};

export default CriminalRecordCard;
