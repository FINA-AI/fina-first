import { Box, Dialog, DialogContent, Grid, Zoom } from "@mui/material";
import React, {
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import CloseBtn from "../../common/Button/CloseBtn";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import ReportGenerationWizardSourceContainer from "./ReportGenerationWizardSourceContainer";
import ReportGenerationWizardMovementContainer from "./ReportGenerationWizardMovementContainer";
import ReportGenerationWizardFooter from "./ReportGenerationWizardFooter";
import ReportGenerationWizardDestinationContainer from "./ReportGenerationWizardDestinationContainer";
import ReportGenerationLoader from "./ReportGenerationLoader";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import { useTranslation } from "react-i18next";
import GeneratedReportsContainer from "../../../containers/ReportManager/Generate/GeneratedReportsContainer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import Step from "@mui/material/Step";
import {
  BaseGenerationParameter,
  Iterator,
  Parameter,
  ReportSchedule,
} from "../../../types/reportGeneration.type";
import { TransitionProps } from "@mui/material/transitions";
import { GeneratedReports } from "./ReportGenerationWizardContainer";
import { validate } from "../../../containers/ReportManager/Util/ReportMarameterChooserValidator";
import { configureUpDownActions } from "../Edit/ReportParameterEditHelper";
import { ReportParameterType } from "./ParameterTypeNames";

interface ReportGenerationWizardProps {
  handleClose: () => void;
  parameters: Partial<Parameter>[];
  iterators: Iterator[];
  generationStepName: string;
  selectedIterators: React.MutableRefObject<
    BaseGenerationParameter | undefined
  >;
  selectedParameters: React.MutableRefObject<
    BaseGenerationParameter | undefined
  >;
  currentSelectedDestinationSelectedRows: any;
  setCurrentSelectedDestinationTableRows: (rows: any[]) => void;
  setGenerationStepName: (step: string) => void;
  currentOperationName: React.MutableRefObject<string | undefined>;
  reportGenerationTypesData: any;
  loading: boolean;
  generatedReports: GeneratedReports;
  onFinish: () => void;
  fileType: string;
  isReportScheduller?: boolean;

  setSchedules(schedule: ReportSchedule): void;

  onReviewOrReGenerate(
    reportIds: number[],
    regenate: boolean,
    key?: string | null
  ): void;

  onDataSequenceChange(up: boolean, data: any, isParam: boolean): void;

  onDataMove(
    leftToRight: boolean,
    sourceTable: any,
    destinationTable: any,
    isParam: boolean
  ): void;
}

export type WarningInfo = { visibility: boolean; title: string };

const StyledRoot = styled(Box)({
  height: "100%",
  "& .MuiStepLabel-root": {
    cursor: "pointer !Important",
  },
});

const StyledStepContainer = styled(Box)({
  padding: "8px 16px",
  "& .MuiStepConnector-line": {
    display: "none",
  },
});

const StyledStepContentBox = styled(Box)({
  borderRadius: "4px",
  cursor: "pointer !important",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  maxWidth: "150px",
  "& :hover": {
    minWidth: "50px",
    borderRadius: "2px",
    "& .MuiStepLabel-iconContainer": {
      minWidth: "0px !important",
      "& div": {
        background: "inherit",
        minWidth: "0px",
        borderRadius: "25px",
      },
    },
  },
  "& .MuiStepLabel-iconContainer": {
    borderRadius: "25px",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& div": {
      display: "flex",
      "& :hover": {
        background: "inherit",
        minWidth: "0px",
        borderRadius: "25px",
      },
    },
  },
});

const StyledStepLabel = styled(StepLabel)({
  padding: "5px",
  "& .MuiStepLabel-label": {
    marginTop: "6px !important",
    maxWidth: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "500",
    color: "#9AA7BE",
  },
  "& .MuiSvgIcon-root": {
    color: "#FFFFFF",
  },
});

const StyledStep = styled(Step)({
  padding: "0px 10px",
  minWidth: "150",
  maxWidth: "150px",
});

const StyledGeneratedReportHeader = styled(Box)({
  color: "rgb(44, 54, 68)",
  fontSize: "13px",
  fontWeight: "600",
  lineHeight: "20px",
  textTransform: "capitalize",
  position: "relative",
});

const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  paddingRight: "10px",
  paddingLeft: "10px",
  borderBottom: theme.palette.borderColor,
}));

const paperStyles = {
  minWidth: "1100px",
  height: "750px",
  borderRadius: "4px",
};

const paperSmallStyles = {
  minWidth: "750px",
  height: "500px",
  borderRadius: "4px",
};

const commonIconStyles = {
  color: "#FFFFFF",
  borderRadius: "8px",
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: any
) {
  return <Zoom ref={ref} {...props} timeout={500} />;
});

export const CustomStepIcon = (props: any) => {
  const { item } = props;

  const getStepIcon = (parameterType: ReportParameterType) => {
    switch (parameterType) {
      case ReportParameterType.SCHEDULE:
        return <AccessTimeIcon sx={{ ...commonIconStyles }} />;
      case ReportParameterType.BANK:
        return <AccountBalanceIcon sx={{ ...commonIconStyles }} />;
      case ReportParameterType.PEER:
        return <GroupsIcon sx={{ ...commonIconStyles }} />;
      case ReportParameterType.NODE:
        return <AccountTreeRoundedIcon sx={{ ...commonIconStyles }} />;
      case ReportParameterType.PERIOD:
        return <HistoryToggleOffIcon sx={{ ...commonIconStyles }} />;
      case ReportParameterType.OFFSET:
        return <LocalPrintshopRoundedIcon sx={{ ...commonIconStyles }} />;
      case ReportParameterType.VERSION:
        return <HdrStrongIcon sx={{ ...commonIconStyles }} />;
      case ReportParameterType.VCT:
      case ReportParameterType.PLAIN_VCT: {
        switch (item.vctIteratorInfo.type) {
          case ReportParameterType.BANK:
            return <AccountBalanceIcon sx={{ ...commonIconStyles }} />;
          case ReportParameterType.PEER:
            return <GroupsIcon sx={{ ...commonIconStyles }} />;
          case ReportParameterType.PERIOD:
            return <HistoryToggleOffIcon sx={{ ...commonIconStyles }} />;
          default:
            return <></>;
        }
      }
      default:
        return <></>;
    }
  };

  return <div>{getStepIcon(item.type)}</div>;
};

export enum ActionButton {
  LeftEnabled = "leftEnabled",
  RightEnabled = "rightEnabled",
  UpEnabled = "upEnabled",
  DownEnabled = "downEnabled",
}

const ReportGenerationWizard: React.FC<ReportGenerationWizardProps> = ({
  handleClose,
  parameters = [],
  iterators = [],
  generationStepName,
  selectedIterators,
  selectedParameters,
  currentSelectedDestinationSelectedRows,
  setCurrentSelectedDestinationTableRows,
  setGenerationStepName,
  onDataMove,
  onDataSequenceChange,
  currentOperationName,
  reportGenerationTypesData,
  loading,
  onReviewOrReGenerate,
  generatedReports,
  onFinish,
  fileType,
  setSchedules,
  isReportScheduller,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const [actionButtonsState, setActionButtonsState] = useState({
    [ActionButton.LeftEnabled]: false,
    [ActionButton.RightEnabled]: false,
    [ActionButton.UpEnabled]: false,
    [ActionButton.DownEnabled]: false,
  });

  const selectedSourceParametersRows = useRef<any>();
  const selectedDestinationParametersRows = useRef<any>();
  const selectedSourceIteratorsRows = useRef<any>();
  const selectedDestinationIteratorsRows = useRef<any>();
  const [open, setOpen] = useState(true);
  const currentSelectedRows = useRef<any>();

  const updateActionButtonsState = (key: string, value: boolean) => {
    setActionButtonsState((prev) => ({ ...prev, [key]: value }));
  };

  const [warningIconInfo, setWarningIconInfo] =
    useState<Partial<WarningInfo>>();

  useEffect(() => {
    if (generationStepName !== null) {
      let currentStepName =
        generationStepName === "CHOOSE_PARAMETERS"
          ? parameters[activeStep]?.name
          : iterators[activeStep]?.name;
      if (generationStepName === "CHOOSE_PARAMETERS") {
        setCurrentSelectedDestinationTableRows(
          selectedParameters.current &&
            currentStepName &&
            selectedParameters.current[currentStepName]
            ? selectedParameters.current[currentStepName].selectedRows
            : []
        );

        if (selectedSourceParametersRows.current) {
          enableArrowBtn(
            (val: boolean) =>
              updateActionButtonsState(ActionButton.RightEnabled, val),
            selectedSourceParametersRows.current[activeStep]
          );
        } else {
          updateActionButtonsState("rightEnabled", false);
        }

        if (selectedDestinationParametersRows.current) {
          enableArrowBtn(
            (val: boolean) =>
              updateActionButtonsState(ActionButton.LeftEnabled, val),
            selectedDestinationParametersRows.current[activeStep]
          );
        } else {
          updateActionButtonsState(ActionButton.LeftEnabled, false);
        }
      } else {
        setCurrentSelectedDestinationTableRows(
          selectedIterators.current &&
            currentStepName &&
            selectedIterators.current[currentStepName]
            ? selectedIterators.current[currentStepName].selectedRows
            : []
        );

        if (selectedSourceIteratorsRows.current) {
          enableArrowBtn(
            (val: boolean) =>
              updateActionButtonsState(ActionButton.RightEnabled, val),
            selectedSourceIteratorsRows.current[activeStep]
          );
        } else {
          updateActionButtonsState(ActionButton.RightEnabled, false);
        }

        if (selectedDestinationIteratorsRows.current) {
          enableArrowBtn(
            (val: boolean) =>
              updateActionButtonsState(ActionButton.LeftEnabled, val),
            selectedDestinationIteratorsRows.current[activeStep]
          );
        } else {
          updateActionButtonsState(ActionButton.LeftEnabled, false);
        }
      }
    }
  }, [activeStep, generationStepName]);

  const enableArrowBtn = (setFun: (val: boolean) => void, obj: any) => {
    if (obj) {
      setFun(Boolean(obj && obj.selectedRows && obj.selectedRows.length > 0));
      updateActionButtonsState(
        ActionButton.UpEnabled,
        obj && obj.selectedRows && obj.selectedRows.length === 1
      );
      updateActionButtonsState(
        ActionButton.DownEnabled,
        obj && obj.selectedRows && obj.selectedRows.length === 1
      );
    } else {
      setFun(false);
      updateActionButtonsState(ActionButton.UpEnabled, false);
      updateActionButtonsState(ActionButton.DownEnabled, false);
    }
  };

  const getIteratorOrParametersArray = () => {
    return generationStepName === "CHOOSE_PARAMETERS" ? parameters : iterators;
  };

  const isParametersWizard = () => {
    return generationStepName === "CHOOSE_PARAMETERS";
  };

  //This method uses only source table on row select
  //Temporarily store until move destination table
  //It should be removed after data move
  const onSourceTableSelectRow = (rows: any, generationData: any) => {
    updateActionButtonsState(
      ActionButton.RightEnabled,
      rows && rows.length > 0
    );
    if (generationData.generationStepName === "CHOOSE_PARAMETERS") {
      selectedSourceParametersRows.current = {
        ...selectedSourceParametersRows.current,
        [generationData.stepIndex]: {
          ...generationData,
          selectedRows: rows,
        },
      };
    } else {
      selectedSourceIteratorsRows.current = {
        ...selectedSourceIteratorsRows.current,
        [generationData.stepIndex]: {
          ...generationData,
          selectedRows: rows,
        },
      };
    }
  };

  //This method uses only destination table on row select
  //Temporarily store until move source table
  //It should be removed after data move
  const onDestinationTableSelectRow = (rows: any, generationData: any) => {
    updateActionButtonsState(ActionButton.LeftEnabled, rows && rows.length > 0);
    currentSelectedRows.current = rows;

    if (generationData.type === ReportParameterType.OFFSET) {
      rows = rows.filter((row: any) => row.name?.trim().length > 0);
    }

    if (generationData.type === ReportParameterType.BANK) {
      let isRowActive =
        rows && rows.filter((row: any) => row.level !== 0).length === 1;
      updateActionButtonsState(ActionButton.UpEnabled, isRowActive);
      updateActionButtonsState(ActionButton.DownEnabled, isRowActive);
    } else {
      updateActionButtonsState(
        ActionButton.UpEnabled,
        rows && rows.length === 1
      );
      updateActionButtonsState(
        ActionButton.DownEnabled,
        rows && rows.length === 1
      );
    }

    let isParam = generationStepName === "CHOOSE_PARAMETERS";

    if (rows && rows.length === 1) {
      configureUpDownActions(
        rows,
        isParam
          ? selectedSourceParametersRows?.current?.[activeStep]
          : selectedSourceIteratorsRows.current[activeStep],
        currentSelectedDestinationSelectedRows,
        updateActionButtonsState
      );
    }

    if (generationData.generationStepName === "CHOOSE_PARAMETERS") {
      selectedDestinationParametersRows.current = {
        ...selectedDestinationParametersRows.current,
        [generationData.stepIndex]: {
          ...generationData,
          selectedRows: rows,
        },
      };
    } else {
      selectedDestinationIteratorsRows.current = {
        ...selectedDestinationIteratorsRows.current,
        [generationData.stepIndex]: {
          ...generationData,
          selectedRows: rows,
        },
      };
    }

    if (generationData.type === ReportParameterType.OFFSET) {
      onDataMoveAction(true);
    }
  };

  const onDataMoveAction = (leftToRight: boolean) => {
    let isParam = generationStepName === "CHOOSE_PARAMETERS";

    if (!leftToRight) {
      updateActionButtonsState(ActionButton.LeftEnabled, false);
      updateActionButtonsState(ActionButton.UpEnabled, false);
      updateActionButtonsState(ActionButton.DownEnabled, false);
    }

    onDataMove(
      leftToRight,
      isParam
        ? selectedSourceParametersRows?.current?.[activeStep]
        : selectedSourceIteratorsRows.current[activeStep],
      isParam
        ? leftToRight
          ? []
          : selectedDestinationParametersRows.current[activeStep]
        : selectedDestinationIteratorsRows.current
        ? selectedDestinationIteratorsRows.current[activeStep]
        : [],
      isParam
    );
  };

  const sequenceChange = (up: boolean) => {
    let isParam = generationStepName === "CHOOSE_PARAMETERS";
    const destinationData = isParam
      ? selectedDestinationParametersRows.current[activeStep]
      : selectedDestinationIteratorsRows.current[activeStep];

    onDataSequenceChange(up, destinationData, isParam);

    if (
      currentSelectedRows.current &&
      currentSelectedRows.current.length === 1
    ) {
      configureUpDownActions(
        currentSelectedRows.current,
        destinationData,
        currentSelectedDestinationSelectedRows,
        updateActionButtonsState
      );
    }
  };

  const onDraggableFunc = (rows: any, key: string) => {
    if (
      generationStepName === "CHOOSE_PARAMETERS" &&
      selectedParameters?.current
    ) {
      selectedParameters.current[key].selectedRows = rows;
    } else if (selectedIterators?.current) {
      selectedIterators.current[key].selectedRows = rows;
    }
  };

  const GetMemoizedToolbar = useMemo(() => {
    return (
      <StyledRoot
        display={"flex"}
        flex={1}
        flexDirection={"row"}
        height={"100%"}
        data-testid={"wizard-header"}
      >
        <StyledStepContainer
          display={"flex"}
          flex={1}
          justifyContent={"center"}
          width={"100%"}
        >
          {generatedReports.storedReports.length > 0 ? (
            <StyledGeneratedReportHeader
              display={"flex"}
              justifyContent={"center"}
            >
              {t("generatedReportInfo")}
            </StyledGeneratedReportHeader>
          ) : (
            <Box width={"100%"}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{ justifyContent: "center" }}
              >
                {getIteratorOrParametersArray().map((p, index) => {
                  return (
                    <StyledStep key={index} data-testid={p.name}>
                      <StyledStepContentBox
                        onClick={() => {
                          /*setActiveStep(index);*/
                        }}
                      >
                        <StyledStepLabel
                          StepIconComponent={(props) => {
                            const newProps = { ...props, item: p };
                            return <CustomStepIcon {...newProps} />;
                          }}
                        >
                          {p.name}
                        </StyledStepLabel>
                      </StyledStepContentBox>
                    </StyledStep>
                  );
                })}
              </Stepper>
            </Box>
          )}
        </StyledStepContainer>
        <Box display={"flex"} alignItems={"center"}>
          <CloseBtn
            onClick={handleClose}
            size={"default"}
            style={{ color: "#9AA7BE" }}
          />
        </Box>
      </StyledRoot>
    );
  }, [generationStepName, activeStep, parameters, iterators, generatedReports]);

  const singleGridCheck = () => {
    if (generationStepName === "CHOOSE_PARAMETERS") {
      if (parameters[activeStep].type === ReportParameterType.SCHEDULE) {
        return true;
      }
      return (
        parameters[activeStep].type === ReportParameterType.OFFSET ||
        generatedReports.storedReports.length > 0
      );
    } else {
      return iterators[activeStep].type === ReportParameterType.OFFSET;
    }
  };

  const getPaperStyles = () => {
    if (generatedReports.storedReports.length > 0) {
      return paperSmallStyles;
    }
    if (isReportScheduller && activeStep === 0) {
      return paperSmallStyles;
    }

    return paperStyles;
  };

  const validateRestrictions = () => {
    const selectedParameter = getIteratorOrParametersArray()[activeStep];

    if (selectedParameter?.name?.includes("$")) {
      let selectedSourceRef = isParametersWizard()
        ? selectedSourceParametersRows.current
        : selectedSourceIteratorsRows.current;
      const selectedRows = selectedSourceRef[activeStep].selectedRows;

      const parameterValidation = validate(
        selectedParameter as Parameter,
        selectedRows,
        currentSelectedDestinationSelectedRows
      );

      if (parameterValidation.isValid) {
        onDataMoveAction(true);
        setWarningIconInfo({});
      } else {
        setWarningIconInfo({
          visibility: true,
          title: parameterValidation.message ? parameterValidation.message : "",
        });
      }
    } else {
      onDataMoveAction(true);
    }
  };

  return (
    <Dialog
      disableEscapeKeyDown={true}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          // Set 'open' to false, however you would do that with your particular code.
          setOpen(false);
          handleClose();
        }
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        sx: {
          ...getPaperStyles(),
        },
      }}
    >
      {loading ? (
        <ReportGenerationLoader loading={loading} />
      ) : (
        <Box display={"flex"} height={"100%"} flexDirection={"column"}>
          <StyledToolbar>{GetMemoizedToolbar}</StyledToolbar>
          <DialogContent
            style={{
              height: "100%",
              padding: "0px",
            }}
            data-testid={"wizard-body"}
          >
            {generatedReports.storedReports.length > 0 ? (
              <GeneratedReportsContainer
                data={generatedReports}
                fileType={fileType}
              />
            ) : (
              <Grid
                container
                flexDirection={"row"}
                width={"100%"}
                height={"100%"}
              >
                <Grid
                  style={{
                    visibility: singleGridCheck() ? "hidden" : "visible",
                  }}
                  item
                  flex={singleGridCheck() ? 0 : 1}
                  height={"100%"}
                  overflow={"auto"}
                >
                  <ReportGenerationWizardSourceContainer
                    onSourceTableSelectRow={onSourceTableSelectRow}
                    activeStep={activeStep}
                    generationStepName={generationStepName}
                    parameters={parameters}
                    iterators={iterators}
                    reportGenerationTypesData={reportGenerationTypesData}
                  />
                </Grid>
                <Grid
                  style={{
                    visibility: singleGridCheck() ? "hidden" : "visible",
                  }}
                  item
                  width={singleGridCheck() ? 0 : "48px"}
                  height={"100%"}
                >
                  <ReportGenerationWizardMovementContainer
                    arrowDownActive={
                      actionButtonsState[ActionButton.DownEnabled]
                    }
                    arrowLeftActive={
                      actionButtonsState[ActionButton.LeftEnabled]
                    }
                    arrowRightActive={
                      actionButtonsState[ActionButton.RightEnabled]
                    }
                    arrowUpActive={actionButtonsState[ActionButton.UpEnabled]}
                    onVerticalMove={sequenceChange}
                    onHorizontalMove={(moveRight) => {
                      if (moveRight) {
                        validateRestrictions();
                      } else {
                        onDataMoveAction(moveRight);
                      }
                    }}
                    warningIconInfo={warningIconInfo}
                  />
                </Grid>
                <Grid item flex={1} height={"100%"} overflow={"auto"}>
                  <ReportGenerationWizardDestinationContainer
                    currentSelectedDestinationSelectedRows={
                      currentSelectedDestinationSelectedRows
                    }
                    generationStepName={generationStepName}
                    parameters={parameters}
                    iterators={iterators}
                    activeStep={activeStep}
                    onDestinationTableSelectRow={onDestinationTableSelectRow}
                    currentOperationName={currentOperationName}
                    onDraggableFunc={onDraggableFunc}
                    setSchedules={setSchedules}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <ReportGenerationWizardFooter
            activeStep={activeStep}
            generationStepName={generationStepName}
            parameters={parameters}
            iterators={iterators}
            currentSelectedDestinationSelectedRows={
              currentSelectedDestinationSelectedRows
            }
            setActiveStep={setActiveStep}
            setGenerationStepName={setGenerationStepName}
            setCurrentSelectedDestinationTableRows={
              setCurrentSelectedDestinationTableRows
            }
            onReviewOrReGenerate={(reportIds: number[], regenate: boolean) => {
              onReviewOrReGenerate(reportIds, regenate, generatedReports?.key);
            }}
            generatedReports={generatedReports.storedReports}
            onFinish={onFinish}
            setWarningIconInfo={setWarningIconInfo}
          />
        </Box>
      )}
    </Dialog>
  );
};

export default memo(ReportGenerationWizard);
