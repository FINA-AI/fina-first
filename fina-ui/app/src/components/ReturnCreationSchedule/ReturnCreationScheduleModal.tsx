import ClosableModal from "../common/Modal/ClosableModal";
import Wizard from "../Wizard/Wizard";
import { useTranslation } from "react-i18next";
import Select from "../common/Field/Select";
import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/system";
import TextField from "../common/Field/TextField";
import { Chip } from "@mui/material";
import SchedulesContainer from "../../containers/Schedules/SchedulesContainer";
import DateAndTimePicker from "../common/Field/DateTimePicker";
import { getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { styled, useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { AddModal } from "../../containers/ReturnCreationSchedule/ReturnCreationScheduleContainer";
import { ReturnVersion } from "../../types/importManager.type";
import { ReturnSchedule } from "../../types/returnCreationSchedule.type";

interface Props {
  addModal: AddModal;
  setAddModal: (modal: AddModal) => void;
  returnVersions: ReturnVersion[];

  saveFunction(info: Partial<ReturnSchedule>): void;
}

const StyledContentWrapper = styled(Box)({
  height: "100%",
  overflow: "auto",
  padding: "0 14px",
  paddingTop: 10,
});

const StyledChip = styled(Chip)({
  marginRight: 4,
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 500,
  padding: "0",
});

const ReturnCreationScheduleModal: React.FC<Props> = ({
  addModal,
  setAddModal,
  returnVersions,
  saveFunction,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { enqueueSnackbar } = useSnackbar();

  const [id, setId] = useState(0);
  const [onDemand, setOnDemand] = useState(false);
  const [returnVersion, setReturnVersion] = useState<ReturnVersion>();
  const [infoText, setInfoText] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<Date | null | number>();
  const [selectedSchedules, setSelectedSchedules] = useState<ReturnSchedule[]>(
    []
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  useEffect(() => {
    if (addModal && addModal.row) {
      let row = addModal.row;
      setInfoText(row.taskName);
      setId(row.id);
      setOnDemand(row.onDemand);
      setReturnVersion(returnVersions.find((f) => f.id === row.versionId));
    }
  }, []);

  const getInvalidFieldsByStep = (step?: number) => {
    let invalidFields = [];
    !infoText && invalidFields.push("infoText");
    !returnVersion && invalidFields.push("returnVersion");
    !(selectedSchedules.length > 0) && invalidFields.push("selectedSchedules");
    if (!onDemand) {
      if (!scheduledTime) {
        invalidFields.push("scheduledTime");
      } else if (new Date(scheduledTime) <= new Date()) {
        if (step === undefined) {
          invalidFields.push("scheduledTime");
          enqueueSnackbar(t("pastDateDetected"), { variant: "error" });
        }
      }
    }

    if (step === 1) {
      invalidFields = invalidFields.filter((f) => f !== "selectedSchedules");
    }

    return invalidFields;
  };

  const handleErrorFields = (value: any, key: string) => {
    setErrorFields((prevState) => {
      if ((!value || value?.length === 0) && !prevState.includes(key)) {
        return [...prevState, key];
      } else if (value && prevState.includes(key)) {
        return [...prevState.filter((f) => f !== key)];
      }
      return prevState;
    });
  };

  const onScheduleSelectFunction = (row: ReturnSchedule) => {
    if (Array.isArray(row)) {
      setSelectedSchedules(row);
    } else {
      setSelectedSchedules([row]);
    }
    handleErrorFields(row, "selectedSchedules");
  };

  const onSaveClick = () => {
    if (!onDemand && new Date(scheduledTime as Date) <= new Date()) {
      setErrorFields((prev) => [...prev, "scheduledTime"]);
      enqueueSnackbar(t("pastDateDetected"), { variant: "error" });
      return;
    }

    if (returnVersion) {
      saveFunction({
        id: id,
        taskName: infoText,
        onDemand: onDemand,
        scheduleTime: !onDemand ? scheduledTime : null,
        versionId: returnVersion.id,
        versionCode: returnVersion.code,
        scheduleIds: selectedSchedules.map((item) => item.id),
        status: "STATUS_SCHEDULED",
      });
    }
  };

  const columns = [
    {
      field: "returnDefinition.code",
      headerName: t("code"),
      width: 100,
      hideCopy: true,
    },
    {
      field: "period.fromDate",
      headerName: t("periodFrom"),
      width: 100,
      hideCopy: true,

      renderCell: (value: number) => {
        return getFormattedDateValue(value, getDateFormat(true));
      },
    },
    {
      field: "period.toDate",
      headerName: t("periodTo"),
      width: 100,
      hideCopy: true,

      renderCell: (value: number) => {
        return getFormattedDateValue(value, getDateFormat(true));
      },
    },
    {
      field: "period.periodType.code",
      headerName: t("periodTypeCode"),
      width: 100,
      hideCopy: true,
    },
    {
      field: "period.periodType.name",
      headerName: t("periodTypeName"),
      width: 200,
      hideCopy: true,
    },
    {
      field: "returnDefinition.name",
      headerName: t("definitionName"),
      width: 200,
      hideCopy: true,
    },
    {
      field: "fi.code",
      headerName: t("fiCode"),
      width: 100,
      hideCopy: true,
    },
    {
      field: "fi.name",
      headerName: t("fiName"),
      width: 200,
      hideCopy: true,
    },
    {
      field: "returnDefinition.returnType.code",
      headerName: t("returnType"),
      width: 100,
      hideCopy: true,
    },
    {
      field: "delay",
      headerName: t("dueDate"),
      width: 100,
      hideCopy: true,
    },
    {
      field: "delayHour",
      headerName: t("dueHour"),
      width: 100,
      hideCopy: true,
    },
    {
      field: "delayMinute",
      headerName: t("dueMinute"),
      width: 100,
      hideCopy: true,
    },
    {
      field: "comment",
      headerName: t("comment"),
      width: 100,
      hideCopy: true,
    },
  ];

  const memoizedSchedules = useMemo(() => {
    return (
      <SchedulesContainer
        columnsProp={columns}
        viewMode={true}
        onScheduleSelectFunction={onScheduleSelectFunction}
        selectedSchedules={selectedSchedules}
      />
    );
  }, [activeStepIndex, selectedSchedules]);

  const handleOnNext = (_: number, nextStep: number) => {
    setActiveStepIndex(nextStep);

    const invalidPreviousStep = getInvalidFieldsByStep(nextStep).length > 0;

    setErrorFields(getInvalidFieldsByStep());

    return !invalidPreviousStep;
  };

  return (
    <ClosableModal
      onClose={() => setAddModal(null)}
      open={addModal?.isOpen || false}
      width={800}
      height={500}
      includeHeader={false}
      disableBackdropClick={true}
    >
      <Wizard
        steps={[t("generalParameters"), t("returnSchedules")]}
        onCancel={() => setAddModal(null)}
        onSubmit={() => onSaveClick()}
        onNext={handleOnNext}
        isSubmitDisabled={errorFields.length > 0}
      >
        <StyledContentWrapper>
          <Box padding={"4px"}>
            <Select
              size={"default"}
              onChange={(value) => {
                setReturnVersion(
                  returnVersions.find((f) => f.id === Number(value))
                );
                handleErrorFields(value, "returnVersion");
              }}
              value={returnVersion?.id}
              data={returnVersions.map((type) => {
                return { label: type.name, value: type.id };
              })}
              label={t("returnVersion")}
              isError={errorFields.includes("returnVersion")}
              data-testid={"return-version-select"}
            />
          </Box>
          <Box padding={"4px"}>
            <TextField
              border={4}
              size={"default"}
              value={infoText}
              fieldName={""}
              label={t("task")}
              isError={errorFields.includes("infoText")}
              multiline={true}
              rows={2}
              onChange={(value: string) => {
                setInfoText(value);
                handleErrorFields(value, "infoText");
              }}
              height={80}
              data-testid={"return-version-task-input"}
            />
          </Box>
          <Box padding={"4px"}>
            <StyledChip
              label={t("autoTime")}
              variant="outlined"
              onClick={() => setOnDemand(false)}
              style={{
                color: !onDemand ? "white" : "#596D89",
                backgroundColor: !onDemand ? theme.palette.primary.main : "",
                border: !onDemand ? "none" : "",
              }}
              data-testid={"return-version-auto-button"}
            />
            <StyledChip
              label={t("manualTime")}
              variant="outlined"
              onClick={() => setOnDemand(true)}
              style={{
                color: onDemand ? "white" : "#596D89",
                backgroundColor: onDemand ? theme.palette.primary.main : "",
                border: onDemand ? "none" : "",
              }}
              data-testid={"return-version-manual-button"}
            />
          </Box>
          <Box
            padding={"4px"}
            paddingTop={"10px"}
            style={{ display: onDemand ? "none" : "" }}
          >
            <DateAndTimePicker
              value={scheduledTime || null}
              size={"default"}
              label={t("scheduledTime")}
              onChange={(value) => {
                setScheduledTime(value);
                handleErrorFields(value, "scheduledTime");
              }}
              isError={errorFields.includes("scheduledTime")}
              minDateTime
              data-testid={"return-version-schedule-time"}
            />
          </Box>
        </StyledContentWrapper>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {memoizedSchedules}
        </div>
      </Wizard>
    </ClosableModal>
  );
};

export default ReturnCreationScheduleModal;
