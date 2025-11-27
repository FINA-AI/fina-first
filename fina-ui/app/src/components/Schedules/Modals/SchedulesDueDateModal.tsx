import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GhostBtn from "../../common/Button/GhostBtn";
import { Checkbox, Grid, Typography } from "@mui/material";
import TextField from "../../common/Field/TextField";
import { singleScheduleUpdate } from "../../../api/services/scheduleService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import FIChooserSelect from "../../FI/FIChooserSelect";
import ReturnDefinitionSelect from "../../ReturnDefinitions/ReturnDefinitionSelect";
import { ScheduleType } from "../../../types/schedule.type";
import { FiType } from "../../../types/fi.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../../types/returnDefinition.type";
import { PeriodSubmitDataType } from "../../../types/period.type";
import { styled } from "@mui/material/styles";

const StyledBody = styled(Box)(({ height }: { height: number }) => ({
  display: "flex",
  height: `${height}px`,
  padding: "4px 12px",
  "& .MuiCheckbox-root": {
    paddingLeft: "0px",
  },
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  paddingTop: "10px",
  display: "flex",
  justifyContent: "flex-end",
  paddingRight: "36px",
}));

const StyledConfirmTextWrapper = styled(Grid)({
  padding: 4,
  display: "flex",
  alignItems: "center",
});
const StyledConfirmText = styled(Typography)({
  fontSize: 12,
  lineHeight: "20px",
  marginLeft: 5,
});

const StyledFiChooser = styled(Box)({
  "& .MuiFormControl-root": {
    width: "100% !important",
  },
});

interface SchedulesDueDateModalProps {
  onClose: () => void;
  onOpen: boolean;
  isSingle: boolean;
  data?: ScheduleType;
  fis?: FiType[];
  returns: ReturnDefinitionType[];
  onDataUpdateCallBackFunction: any;
  returnTypes: ReturnType[];
  filter: any;
}

export interface DueDateInfo
  extends Omit<ScheduleType, "fi" | "period" | "returnDefinition"> {
  newDueDate?: null | number;
  newDueDateHour?: null | number;
  newDueDateMinute?: null | string;
  newComment?: null | string;
  fi?: FiType | null;
  period?: PeriodSubmitDataType | null;
  returnDefinition?: ReturnDefinitionType | null;
}

const SchedulesDueDateModal: FC<SchedulesDueDateModalProps> = ({
  onClose,
  onOpen,
  isSingle,
  data,
  fis = [],
  returns,
  onDataUpdateCallBackFunction,
  returnTypes,
  filter,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [dueDateInfo, setDueDateInfo] = useState<DueDateInfo>({
    comment: "",
    delay: 0,
    delayHour: 0,
    delayMinute: 0,
    fi: undefined,
    id: 0,
    newComment: null,
    newDueDate: null,
    newDueDateHour: null,
    newDueDateMinute: null,
    period: undefined,
    returnDefinition: undefined,
  });
  const [warningCheckbox, setWarningCheckbox] = useState(false);
  const [selectedRDefinition, setSelectedRDefinition] = useState<
    ReturnDefinitionType[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (filter) {
      setDueDateInfo({
        ...dueDateInfo,
        ...filter,
      });
    }
    if (data) {
      setDueDateInfo({
        ...dueDateInfo,
        ...data,
      });
    }
  }, [filter, data]);

  const setData = (key: string, value: string | number | FiType[]) => {
    if (dueDateInfo) setDueDateInfo({ ...dueDateInfo, [key]: value });
  };

  const onUpdate = async () => {
    if (dueDateInfo && validRequiredFields()) {
      setLoading(true);
      try {
        if (isSingle) {
          const newDueDateInfo = {
            ...dueDateInfo,
            delay: dueDateInfo.newDueDate ?? dueDateInfo.delay,
            delayHour: dueDateInfo.newDueDateHour ?? dueDateInfo.delayHour,
            delayMinute:
              dueDateInfo.newDueDateMinute ?? dueDateInfo.delayMinute,
            comment: dueDateInfo.newComment ?? dueDateInfo.comment,
          };

          await singleScheduleUpdate(newDueDateInfo);
          onDataUpdateCallBackFunction(newDueDateInfo, isSingle);
          enqueueSnackbar(t("saved"), { variant: "success" });
          onClose();
        } else {
          const completeOperation = () => {
            setLoading(false);
            onClose();
          };
          await onDataUpdateCallBackFunction(
            dueDateInfo,
            isSingle,
            completeOperation
          );
        }
      } catch (err) {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      }
    }
  };

  const validRequiredFields = () => {
    const comment = dueDateInfo.comment;
    const delay = dueDateInfo.delay;

    const newComment = dueDateInfo.newComment;
    const newDelay = dueDateInfo.newDueDate;

    if (
      (newComment === null && newDelay === null && comment && delay) ||
      (comment && newComment && delay && newDelay) ||
      (newComment !== null && newDelay !== null && newComment && newDelay) ||
      (newComment === null && newDelay !== null && comment && newDelay) ||
      (newComment !== null && newDelay === null && newComment && delay)
    ) {
      return true;
    } else {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });

      !delay &&
        newDelay === null &&
        setDueDateInfo({ ...dueDateInfo, newDueDate: 0 });

      !comment &&
        newComment === null &&
        setDueDateInfo({ ...dueDateInfo, newComment: "" });

      return false;
    }
  };

  return (
    <ClosableModal
      onClose={onClose}
      open={onOpen}
      width={700}
      height={isSingle && !data?.id ? 450 : 335}
      includeHeader={true}
      titleFontWeight={"700"}
      title={isSingle ? t("singleEditDueDate") : t("editDueDate")}
      loading={loading}
    >
      <Box
        display={"flex"}
        width={"100%"}
        height={"100%"}
        flexDirection={"column"}
      >
        <StyledBody height={isSingle ? 350 : 230}>
          <Grid container style={{ marginTop: "0px" }}>
            {isSingle && !data?.id && (
              <Grid item xs={12}>
                <StyledFiChooser>
                  <FIChooserSelect
                    onChange={(val) => {
                      setData("fi", val);
                    }}
                    label={t("bank")}
                    data={[...fis]}
                    checkedRows={
                      data?.fi
                        ? [
                            {
                              ...data.fi,
                              code: data.fi.name,
                              level: 1,
                            },
                          ]
                        : []
                    }
                    singleSelect={true}
                  />
                </StyledFiChooser>
              </Grid>
            )}
            {isSingle && !data?.id && (
              <Grid item xs={12}>
                <Box>
                  <ReturnDefinitionSelect
                    onChange={(key, value) => {
                      setSelectedRDefinition(value);
                      setData("returnDefinition", value[0].id);
                    }}
                    data={returns}
                    label={t("returnDefinition")}
                    checkedRows={
                      selectedRDefinition[0]?.id
                        ? selectedRDefinition
                        : data && data.returnDefinition
                        ? [data.returnDefinition]
                        : []
                    }
                    singleSelect={true}
                    returnTypes={returnTypes}
                  />
                </Box>
              </Grid>
            )}
            <Grid item p={"4px"} xs={isSingle ? 12 : 4}>
              <TextField
                size={"default"}
                label={t("dueDate")}
                value={data?.delay ? data.delay.toString() : ""}
                onChange={(value: number) => {
                  if (dueDateInfo)
                    setDueDateInfo({ ...dueDateInfo, newDueDate: value });
                }}
                isError={
                  dueDateInfo.newDueDate !== null
                    ? !dueDateInfo.newDueDate
                    : false
                }
              />
            </Grid>
            <Grid item p={"4px"} xs={isSingle ? 12 : 4}>
              <TextField
                size={"default"}
                label={t("dueHour")}
                value={data?.delayHour ? data?.delayHour.toString() : ""}
                onChange={(value: number) => {
                  if (dueDateInfo) dueDateInfo.newDueDateHour = value;
                }}
              />
            </Grid>
            <Grid item p={"4px"} xs={isSingle ? 12 : 4}>
              <TextField
                size={"default"}
                label={t("dueMinute")}
                value={data?.delayMinute ? data?.delayMinute.toString() : ""}
                onChange={(value: string) => {
                  if (dueDateInfo) dueDateInfo.newDueDateMinute = value;
                }}
              />
            </Grid>
            <Grid item p={"4px"} xs={12}>
              <TextField
                label={t("comment")}
                value={data?.comment || ""}
                onChange={(value: string) => {
                  if (dueDateInfo)
                    setDueDateInfo({ ...dueDateInfo, newComment: value });
                }}
                multiline={true}
                rows={2}
                isError={
                  dueDateInfo.newComment !== null
                    ? !dueDateInfo.newComment
                    : false
                }
              />
            </Grid>
            {!isSingle && (
              <StyledConfirmTextWrapper item xs={12}>
                <Checkbox
                  style={{ padding: 0 }}
                  onClick={() => setWarningCheckbox(!warningCheckbox)}
                />
                <StyledConfirmText>
                  {t("confirmScheduleEditAllDate")}
                </StyledConfirmText>
              </StyledConfirmTextWrapper>
            )}
          </Grid>
        </StyledBody>
        <StyledFooter>
          <GhostBtn style={{ marginRight: "10px" }} onClick={onClose}>
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            onClick={onUpdate}
            disabled={isSingle ? false : !warningCheckbox}
            endIcon={<ChevronRightIcon />}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default SchedulesDueDateModal;
