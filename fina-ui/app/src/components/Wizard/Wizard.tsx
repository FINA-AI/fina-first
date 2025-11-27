import React, { ReactElement, useEffect, useState } from "react";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseBtn from "../common/Button/CloseBtn";
import GhostBtn from "../common/Button/GhostBtn";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import SubmitBtn from "../common/Button/SubmitBtn";
import { useTranslation } from "react-i18next";
import { Box, Paper } from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import { styled } from "@mui/material/styles";

interface WizardProps {
  steps: string[];
  children: ReactElement[];
  onCancel: VoidFunction;
  onSubmit: any;
  onNext?: (prevStep: number, currStep: number) => void;
  onBack?: (currStep: number, prevStep: number) => void;
  isSubmitDisabled?: boolean;
  hideStepper?: boolean;
  title?: string;
  hideHeader?: boolean;
  activeStepCallBack?: (step: number) => void;
  hasPreview?: boolean;
  onPrevClick?: VoidFunction;
  isCurrStepValid?: boolean;
  cancelBtn?: boolean;
  isNextStepValid?: boolean;
  showBackButton?: boolean;
  allStepsValidation?: Array<{
    [key: number]: boolean;
  }>;
  submissionFooter?(handleBack: VoidFunction): JSX.Element;
}

const StyledRoot = styled(Box)({
  height: "100%",
  "& .MuiStepLabel-root": {
    cursor: "pointer !Important",
  },
});

const StyledStepsContainer = styled(Box)(({ theme }: any) => ({
  ...theme.modalHeader,
  padding: "8px 16px",
  "& .MuiStepConnector-line": {
    display: "none",
  },
}));

const StyledContent = styled(Box)({
  height: "100%",
  overflow: "hidden",
});

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  ...theme.modalHeader,
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  float: "right",
  padding: "8px 12px",
  alignItems: "center",
  ...theme.modalFooter,
}));

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
  },
});

const StyledStepContent = styled(Box)({
  borderRadius: "4px",
  cursor: "pointer !important",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  maxWidth: "150px",
  "& .MuiStepLabel-iconContainer, & .MuiStepLabel-iconContainer.Mui-active": {
    background: "inherit !important",
  },
});

const StyledStep = styled(Step)({
  padding: "0px 10px",
  minWidth: "150",
  maxWidth: "150px",
});

const StyledBackBtnBox = styled(Box)({
  marginRight: "10px",
  "& .MuiButton-root": {
    height: "32px",
    paddingTop: "8px",
    paddingBottom: "8px",
  },
});

const Wizard: React.FC<WizardProps> = ({
  children,
  steps,
  onCancel,
  onSubmit,
  onNext,
  onBack,
  isSubmitDisabled = false,
  hideStepper = false,
  title,
  hideHeader = false,
  submissionFooter,
  activeStepCallBack,
  hasPreview = false,
  onPrevClick,
  isCurrStepValid,
  cancelBtn,
  isNextStepValid = true,
  allStepsValidation,
  showBackButton = false,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [stepValidation, setStepValidation] = useState(
    steps.map((s, index) => {
      return { [index]: true };
    })
  );

  useEffect(() => {
    if (allStepsValidation && allStepsValidation?.length > 0) {
      setStepValidation(allStepsValidation);
    }
  }, [allStepsValidation]);

  useEffect(() => {
    activeStepCallBack && activeStepCallBack(activeStep);
  }, [activeStep]);

  const stepValidationHandler = (currentStep: number) => {
    if (onNext) {
      const isValid = onNext(activeStep, currentStep);
      if (isValid !== undefined) {
        setStepValidation(
          stepValidation.map((item) =>
            item.hasOwnProperty(activeStep) ? { [activeStep]: isValid } : item
          )
        );
      }
    }
  };

  const handleNext = () => {
    if (onNext) {
      stepValidationHandler(activeStep + 1);
    }
    if (isNextStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack(activeStep, activeStep - 1);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <StyledRoot
      display={"flex"}
      flex={1}
      flexDirection={"column"}
      component={Paper}
    >
      {hideStepper && !hideHeader && (
        <StyledHeader>
          <span style={{ width: "100%" }}>{title}</span>
          <CloseBtn
            onClick={onCancel}
            size={"default"}
            data-testid={"closeBtn"}
          />
        </StyledHeader>
      )}
      {!hideStepper && (
        <StyledStepsContainer>
          {!hideHeader && (
            <Box>
              <span style={{ width: "100%" }}>{title}</span>
              <CloseBtn
                onClick={onCancel}
                size={"default"}
                style={{ marginTop: "14px", color: "#9AA7BE" }}
                data-testid={"closeBtn"}
              />
            </Box>
          )}
          <Stepper
            sx={{ justifyContent: "center" }}
            activeStep={activeStep}
            alternativeLabel
          >
            {steps.map((label, index) => {
              return (
                <StyledStep key={index} data-testid={`step-${index}`}>
                  <StyledStepContent
                    onClick={() => {
                      if (isNextStepValid) {
                        setActiveStep(index);
                        stepValidationHandler(index);
                      }
                    }}
                  >
                    <StyledStepLabel
                      sx={{
                        "& .Mui-completed": {
                          color: !stepValidation?.find((step) =>
                            step.hasOwnProperty(index)
                          )?.[index]
                            ? "red"
                            : "",
                        },
                        "& .MuiStepLabel-iconContainer": {},
                      }}
                    >
                      {label}
                    </StyledStepLabel>
                  </StyledStepContent>
                </StyledStep>
              );
            })}
          </Stepper>
        </StyledStepsContainer>
      )}
      <StyledContent display={"flex"} flex={1}>
        {children.map((item, index) => {
          return (
            <Box
              key={index}
              style={{
                display: item !== children[activeStep] ? "none" : "",
                width: "100%",
              }}
            >
              {item}
            </Box>
          );
        })}
      </StyledContent>
      {activeStep === steps.length - 1 && submissionFooter ? (
        submissionFooter(handleBack)
      ) : (
        <StyledFooter
          display={"flex"}
          justifyContent={
            hasPreview && activeStep === 0 ? "space-between " : "flex-end"
          }
        >
          {hasPreview && activeStep === 0 && (
            <Box>
              <GhostBtn
                onClick={() => onPrevClick?.()}
                startIcon={
                  <PreviewIcon
                    sx={{
                      width: "16px",
                      height: "16px",
                      color: "#98A7BC",
                    }}
                  />
                }
                data-testid={"preview-button"}
              >
                {t("preview")}
              </GhostBtn>
            </Box>
          )}
          {(showBackButton || activeStep !== 0) && (
            <StyledBackBtnBox>
              <GhostBtn onClick={handleBack} datat-testid={"backBtn"}>
                {t("back")}
              </GhostBtn>
            </StyledBackBtnBox>
          )}

          {cancelBtn && (
            <Box
              sx={{
                marginRight: "12px",
              }}
            >
              <GhostBtn
                padding={"8px 21px"}
                onClick={onCancel}
                data-testid={"backBtn"}
              >
                {t("cancel")}
              </GhostBtn>
            </Box>
          )}

          {activeStep !== steps.length - 1 && (
            <PrimaryBtn
              onClick={handleNext}
              disabled={
                isCurrStepValid || isNextStepValid === null
                  ? false
                  : !isNextStepValid
              }
              data-testid={"nextBtn"}
              endIcon={<ChevronRightIcon />}
            >
              {t("next")}
            </PrimaryBtn>
          )}

          {activeStep === steps.length - 1 && !submissionFooter && (
            <SubmitBtn
              disabled={isSubmitDisabled}
              onClick={onSubmit}
              style={{ marginLeft: "0px" }}
              data-testid={"submitBtn"}
              endIcon={<DoneRoundedIcon fontSize={"small"} />}
            >
              {t("save")}
            </SubmitBtn>
          )}
        </StyledFooter>
      )}
    </StyledRoot>
  );
};

export default Wizard;
