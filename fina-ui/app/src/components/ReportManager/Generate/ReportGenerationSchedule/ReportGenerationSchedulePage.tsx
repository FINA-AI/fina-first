import { Box } from "@mui/system";
import DateAndTimePicker from "../../../common/Field/DateTimePicker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextField from "../../../common/Field/TextField";
import {
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import ScheduleRepositoryFolderChooser from "./ScheduleRepositoryFolderChooser";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { ReportSchedule } from "../../../../types/reportGeneration.type";
import { TreeState } from "../../../../types/common.type";
import { ScheduleType } from "../../../../types/schedule.type";

interface ReportGenerationSchedulePageProps {
  setSchedules?(schedule: ReportSchedule): void;
}

const StyledDateTimePicker = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "14px 16px 8px 16px",
});

const StyledFormControlBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "10px 16px",
  alignItems: "flex-start",
});

const StyledFormControlLabel = styled(FormControlLabel)({
  "& .MuiTypography-root": {
    fontSize: "12px !important",
    fontWeight: 500,
    lineHeight: "16px",
    textTransform: "capitalize",
    color: "#596D89",
  },
  "& .Mui-checked": {
    "& .MuiSvgIcon-root": {
      color: "#2962FF",
    },
  },
});

const StyledTextFieldBox = styled(Box)({
  display: "flex",
  padding: "6px 16px 8px 16px",
  flexDirection: "column",
  alignItems: "flex - start",
});

const StyledChip = styled(Chip)({
  marginRight: 4,
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 500,
  padding: "4px 8px 4px 8px",
  border: "1px solid #EAEBF0",
  height: "24px",
  "& .MuiChip-label": {
    padding: 0,
  },
});

const ReportGenerationSchedulePage: React.FC<
  ReportGenerationSchedulePageProps
> = ({ setSchedules }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [scheduleTimeError, setScheduleTimeError] = useState(false);

  const [treeState, setTreeState] = useState<TreeState<ScheduleType[]>>({
    treeData: [],
    columns: [],
  });
  const [schedulesData, setSchedulesData] = useState<ReportSchedule>({
    scheduleTime: null,
    isChecked: false,
    onDemand: false,
    notificationsMails: null,
    fileStorageLocation: null,
    repositoryFolder: [],
  });

  useEffect(() => {
    if (setSchedules) {
      setSchedules(schedulesData);
    }
  }, [schedulesData]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSchedulesData({
      ...schedulesData,
      isChecked: event.target.checked,
      notificationsMails: null,
      fileStorageLocation: null,
      repositoryFolder: [],
    });
  };

  const InputPropsFunc = () => {
    const handleChipClick = () => {
      setSchedulesData({
        ...schedulesData,
        scheduleTime: null,
        onDemand: !schedulesData.onDemand,
      });
    };
    return (
      <>
        <InputAdornment position="end">
          <StyledChip
            data-testid={"on-demand-chip"}
            label={t("onDemand")}
            clickable
            variant="outlined"
            onClick={handleChipClick}
            style={{
              color: schedulesData.onDemand ? "white" : "#596D89",
              backgroundColor: schedulesData.onDemand ? "#2962FF" : "",
              border: schedulesData.onDemand ? "none" : "",
            }}
          />
        </InputAdornment>
      </>
    );
  };

  return (
    <Box height={"100%"} style={{ overflow: "hidden" }}>
      <StyledDateTimePicker>
        <DateAndTimePicker
          value={schedulesData.scheduleTime}
          size={"default"}
          label={t("scheduleTime")}
          onChange={(value) => {
            if (value && new Date(value) <= new Date()) {
              enqueueSnackbar(t("pastDateDetected"), { variant: "error" });
              setScheduleTimeError(true);
              return;
            } else {
              setSchedulesData({ ...schedulesData, scheduleTime: value });
              setScheduleTimeError(false);
            }
          }}
          InputPropsFunc={InputPropsFunc}
          isDisabled={schedulesData.onDemand}
          isError={scheduleTimeError}
          minDateTime
        />
      </StyledDateTimePicker>
      <Divider />
      <StyledFormControlBox>
        <StyledFormControlLabel
          label={t("generateAndUpload")}
          data-testid={"generate-and-upload-checkbox"}
          control={
            <Checkbox
              checked={schedulesData.isChecked}
              onChange={handleCheckboxChange}
              style={{ color: "#c2cad8" }}
              size="small"
            />
          }
        />
      </StyledFormControlBox>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <StyledTextFieldBox>
          <TextField
            border={4}
            size={"default"}
            value={schedulesData.notificationsMails || ""}
            fieldName={"notificationsMails"}
            label={t("notificationsMails")}
            onChange={(value: string) => {
              setSchedulesData({ ...schedulesData, notificationsMails: value });
            }}
            height={80}
          />
        </StyledTextFieldBox>
        <StyledTextFieldBox>
          <TextField
            border={4}
            size={"default"}
            value={schedulesData.fileStorageLocation || ""}
            fieldName={"fileLocation"}
            label={t("fileLocation")}
            onChange={(value: string) =>
              setSchedulesData({ ...schedulesData, fileStorageLocation: value })
            }
            height={80}
          />
        </StyledTextFieldBox>
        <StyledTextFieldBox>
          <ScheduleRepositoryFolderChooser
            treeState={treeState}
            setTreeState={setTreeState}
            schedulesData={schedulesData}
            setSchedulesData={setSchedulesData}
          />
        </StyledTextFieldBox>
      </Box>
    </Box>
  );
};

export default ReportGenerationSchedulePage;
