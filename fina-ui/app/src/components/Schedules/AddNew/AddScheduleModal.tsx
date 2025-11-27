import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import ScheduleReturnsContainer from "../../../containers/Schedules/ScheduleReturnsContainer";
import SchedulePeriodsContainer from "../../../containers/Schedules/SchedulePeriodsContainer";
import ScheduleFiContainer from "../../../containers/Schedules/ScheduleFiContainer";
import NumberField from "../../common/Field/NumberField";
import Split from "react-split";
import { saveSchedule } from "../../../api/services/scheduleService";
import { ping } from "../../../api/services/configService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { FiType } from "../../../types/fi.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../../types/returnDefinition.type";
import { PeriodType } from "../../../types/period.type";
import { ScheduleType } from "../../../types/schedule.type";
import { styled } from "@mui/material/styles";
import webSocket from "../../../api/websocket/webSocket";
import { useSnackbar } from "notistack";

const StyledContainer = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 16px",
  boxSizing: "border-box",
}));

const StyledBody = styled(Split)({
  display: "flex",
  padding: "12px 16px 12px 12px",
  height: 482,
  overflow: "hidden",
  boxSizing: "border-box",
  width: "100%",
  "& .gutter": {
    width: "2px !important",
    cursor: "col-resize",
  },
});

const StyledGridContainer = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: 4,
  background: theme.palette.mode === "dark" ? "#253143" : "#F9F9F9",
  marginLeft: 8,
  overflow: "hidden",
  boxSizing: "border-box",
  height: "100%",
  width: "100%",
  border: theme.palette.borderColor,
}));

const StyledGridTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "18px",
});

const StyledGridHeader = styled(Box)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  width: "100%",
  height: 38,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  padding: 12,
}));

const StyledFiContainer = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
  display: "flex",
  flex: 1,
  overflow: "hidden",
  boxSizing: "border-box",
  height: "100%",
}));

const StyledTextFields = styled(Box)({
  padding: 4,
  width: 150,
});

const StyledBackdrop = styled(Backdrop)(({ theme }: any) => ({
  zIndex: theme.zIndex.drawer - 1,
  position: "absolute",
  "&.MuiBackdrop-root": {
    backgroundColor: theme.palette.primary.darkerLightColor,
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "#303a4af0" : "rgb(240, 240, 245,.9)",
  borderRadius: "8px",
  padding: "10px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  width: "150px",
}));

interface AddScheduleModalProps {
  setAddNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setExistingScheduleModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      data?: ScheduleType[];
    }>
  >;
  fis?: FiType[];
  returns: ReturnDefinitionType[];
  loadScheduleData: (filteredData: any) => void;
  returnTypes: ReturnType[];
  periodTypes: PeriodType[];
  filter: any;
}

const LoadMask = ({ loading, eventInfo }: any) => {
  const progress = eventInfo.progress
    ? (eventInfo.progress / eventInfo.total) * 100
    : 0;
  return loading ? (
    <StyledBackdrop open={loading} id={"backdrop"}>
      <StyledBox>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <CircularProgress variant="determinate" value={progress} size={55} />
          <Typography
            color="primary"
            sx={{
              position: "absolute",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {`${progress.toFixed(1)}%`}
          </Typography>
        </Box>
        <Typography
          fontWeight={400}
        >{`${eventInfo.progress} / ${eventInfo.total}`}</Typography>
        <Typography>created</Typography>
      </StyledBox>
    </StyledBackdrop>
  ) : null;
};

const AddScheduleModal: FC<AddScheduleModalProps> = ({
  setAddNewOpen,
  setExistingScheduleModal,
  fis,
  returns,
  loadScheduleData,
  returnTypes,
  periodTypes,
  filter,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { openErrorWindow } = useErrorWindow();
  const [loading, setLoading] = useState(false);
  const [generationBtn, setGenerationBtn] = useState(true);
  const [eventInfo, setEventInfo] = useState<any>({ progress: 0, total: 0 });

  useEffect(() => {
    const ws = webSocket("ws/schedule", (message: any) => {
      const eventInfo = JSON.parse(message);

      if (eventInfo.total === eventInfo.progress) {
        if (eventInfo.notSavedSchedules.length > 0) {
          setExistingScheduleModal({
            isOpen: true,
            data: eventInfo.notSavedSchedules,
          });
        }
        setAddNewOpen(false);
        setLoading(false);
        enqueueSnackbar("Schedules Created", { variant: "success" });
      } else {
        setEventInfo({ total: eventInfo.total, progress: eventInfo.progress });
      }
    });

    ws.onerror = (error) => {
      console.log(error);
      openErrorWindow("Error creating schedule", "Error", true);
      setLoading(false);
    };

    //5 min
    const pingInterval = setInterval(() => {
      ping();
    }, 300_000);

    return () => {
      ws.close();
      clearInterval(pingInterval);
    };
  }, []);

  const newScheduleRef: any = useRef({
    fis: [],
    definitions: [],
    periods: [],
    delay: null,
    delayHour: null,
    delayMinute: null,
    loadAllPeriodData: filter?.loadAllPeriodData,
  });

  const onNewScheduleChange = (key: string, value: any) => {
    if (key === "definitions") {
      newScheduleRef.current[key] = value.map(
        (item: { id: number }) => item.id
      );
    } else {
      newScheduleRef.current[key] = value;
    }
    setGenerationBtn(
      !(
        typeof newScheduleRef.current.delay === "number" &&
        newScheduleRef.current.fis &&
        newScheduleRef.current.fis.length > 0 &&
        newScheduleRef.current.definitions &&
        newScheduleRef.current.definitions.length > 0 &&
        newScheduleRef.current.periods &&
        newScheduleRef.current.periods.length > 0
      )
    );
  };

  const save = (data: {
    delay: number;
    delayHour: number;
    delayMinute: number;
    fiId: number;
    id: number;
    periodId: number;
    returnDefinitionId: number;
  }) => {
    saveSchedule(data)
      .then(() => {
        loadScheduleData({});
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      });
  };

  const generateSchedule = () => {
    setLoading(true);
    save(newScheduleRef.current);
  };

  const GetScheduleFiContainer = useCallback(() => {
    return (
      <ScheduleFiContainer
        onNewScheduleChange={onNewScheduleChange}
        data={fis}
      />
    );
  }, [fis]);

  const GetScheduleReturnsContainer = useCallback(() => {
    return (
      <ScheduleReturnsContainer
        onNewScheduleChange={onNewScheduleChange}
        data={returns}
        returnTypes={returnTypes}
        singleSelect={false}
      />
    );
  }, [returns]);

  const GetSchedulePeriodsContainer = useCallback(() => {
    return (
      <SchedulePeriodsContainer
        onNewScheduleChange={onNewScheduleChange}
        periodTypes={periodTypes}
      />
    );
  }, []);

  return (
    <>
      <LoadMask loading={loading} eventInfo={eventInfo} />
      <StyledContainer flex={1}>
        <StyledBody>
          <StyledGridContainer data-testid={"fi-container"}>
            <StyledGridHeader>
              <StyledGridTitle>{t("fi")}</StyledGridTitle>
            </StyledGridHeader>
            <StyledFiContainer>{GetScheduleFiContainer()}</StyledFiContainer>
          </StyledGridContainer>
          <StyledGridContainer data-testid={"returns-container"}>
            <StyledGridHeader>
              <StyledGridTitle>{t("returns")}</StyledGridTitle>
            </StyledGridHeader>
            {GetScheduleReturnsContainer()}
          </StyledGridContainer>
          <StyledGridContainer data-testid={"periods-container"}>
            <StyledGridHeader>
              <StyledGridTitle>{t("periods")}</StyledGridTitle>
            </StyledGridHeader>
            {GetSchedulePeriodsContainer()}
          </StyledGridContainer>
        </StyledBody>
        <StyledFooter data-testid={"footer"}>
          <Box display={"flex"}>
            <StyledTextFields>
              <NumberField
                size={"small"}
                label={t("dueDate")}
                width={"120px"}
                onChange={(value) => {
                  onNewScheduleChange("delay", value);
                }}
                pattern={/^\d*(?:\.\d*)?$/}
                fieldName={"due-date-field"}
              />
            </StyledTextFields>
            <StyledTextFields>
              <NumberField
                size={"small"}
                width={"120px"}
                label={t("dueHour")}
                onChange={(value) => {
                  onNewScheduleChange("delayHour", value);
                }}
                fieldName={"due-date-field"}
              />
            </StyledTextFields>
            <StyledTextFields>
              <NumberField
                size={"small"}
                width={"120px"}
                label={t("dueMinute")}
                onChange={(value) => {
                  onNewScheduleChange("delayMinute", value);
                }}
                fieldName={"due-date-field"}
              />
            </StyledTextFields>
          </Box>
          <Box>
            <GhostBtn
              style={{ marginRight: "10px" }}
              onClick={() => {
                setAddNewOpen(false);
              }}
              data-testid={"cancel-button"}
            >
              {t("cancel")}
            </GhostBtn>
            <PrimaryBtn
              onClick={() => {
                generateSchedule();
              }}
              disabled={generationBtn}
              endIcon={<DoneIcon />}
              data-testid={"generate-button"}
            >
              {t("generate")}
            </PrimaryBtn>
          </Box>
        </StyledFooter>
      </StyledContainer>
    </>
  );
};

export default AddScheduleModal;
