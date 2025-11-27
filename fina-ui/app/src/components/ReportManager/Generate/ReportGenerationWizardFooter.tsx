import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import { Box, DialogActions } from "@mui/material";
import React, { useRef } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import SourceIcon from "@mui/icons-material/Source";
import { styled } from "@mui/material/styles";
import { Iterator, Parameter } from "../../../types/reportGeneration.type";
import { WarningInfo } from "./ReportGenerationWizard";
import { StoredRootReport } from "../../../types/report.type";

interface ReportGenerationWizardFooterProps {
  activeStep: number;
  generationStepName: string;
  setGenerationStepName: (step: string) => void;
  setActiveStep: (page: number) => void;
  currentSelectedDestinationSelectedRows: any;
  parameters: Partial<Parameter>[];
  iterators: Iterator[];
  onReviewOrReGenerate: (reportIds: number[], regenate: boolean) => void;
  onFinish: VoidFunction;
  generatedReports: StoredRootReport[];
  setWarningIconInfo: (info: WarningInfo | {}) => void;
  setCurrentSelectedDestinationTableRows(rows: any[]): void;
}

const StyledTitleWrapper = styled("span")({
  width: "100%",
  color: "#98A7BC",
  fontWeight: 400,
  lineHeight: "16px",
  fontSize: "11px",
});

const StyledGeneratedReportFooter = styled(DialogActions)(
  ({ theme }: { theme: any }) => ({
    background: theme.palette.paperBackground,
    borderTop: theme.palette.borderColor,
    display: "flex",
    justifyContent: "space-between",
  })
);

const ReportGenerationWizardFooter: React.FC<
  ReportGenerationWizardFooterProps
> = ({
  activeStep,
  generationStepName,
  parameters,
  iterators,
  setGenerationStepName,
  setActiveStep,
  setCurrentSelectedDestinationTableRows,
  currentSelectedDestinationSelectedRows,
  onReviewOrReGenerate,
  generatedReports = [],
  onFinish,
  setWarningIconInfo,
}) => {
  const { t } = useTranslation();
  const nextButtonName = useRef<any>();

  const getNextButtonText = () => {
    if (generationStepName === "CHOOSE_PARAMETERS") {
      if (parameters.length === activeStep + 1) {
        if (iterators.length !== 0) {
          return "Select Iterators";
        }
        nextButtonName.current = "finish";
        return "Finish";
      }
      return "Next";
    } else {
      if (iterators.length === activeStep + 1) {
        nextButtonName.current = "finish";
        return "Finish";
      }

      return "Next";
    }
  };

  const onNextPage = () => {
    if (nextButtonName.current === "finish") {
      onFinish();
    } else {
      if (generationStepName === "CHOOSE_PARAMETERS") {
        if (parameters.length === activeStep + 1) {
          setGenerationStepName("CHOOSE_ITERATORS");
          setActiveStep(0);
        } else {
          setActiveStep(activeStep + 1);
        }
      } else {
        setActiveStep(activeStep + 1);
      }
      setCurrentSelectedDestinationTableRows([]);
      setWarningIconInfo({});
    }
  };

  const onPreviousPage = () => {
    nextButtonName.current = "";
    if (generationStepName === "CHOOSE_ITERATORS" && activeStep === 0) {
      setGenerationStepName("CHOOSE_PARAMETERS");
      setActiveStep(parameters.length - 1);
    } else {
      setActiveStep(activeStep - 1);
    }
    setCurrentSelectedDestinationTableRows([]);
    setWarningIconInfo({});
  };

  const nextButtonDisableFunc = () => {
    return !Boolean(
      currentSelectedDestinationSelectedRows &&
        currentSelectedDestinationSelectedRows.length > 0
    );
  };

  return (
    <StyledGeneratedReportFooter data-testid={"wizard-footer"}>
      {generatedReports.length > 0 ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
        >
          <GhostBtn
            onClick={() => {
              onReviewOrReGenerate(
                generatedReports.map((gr) => gr.reportPkModel.reportId),
                false
              );
            }}
            style={{ marginRight: "8px" }}
          >
            <SourceIcon />
            {t("review")}
          </GhostBtn>

          <GhostBtn
            onClick={() =>
              onReviewOrReGenerate(
                generatedReports.map((gr) => gr.reportPkModel.reportId),
                true
              )
            }
          >
            <SettingsIcon /> {t("regenerate")}
          </GhostBtn>
        </Box>
      ) : (
        <>
          <StyledTitleWrapper>{t(generationStepName)}</StyledTitleWrapper>
          <DialogActions>
            {(Boolean(activeStep && activeStep > 0) ||
              (generationStepName === "CHOOSE_ITERATORS" &&
                parameters.length !== 0)) && (
              <GhostBtn onClick={onPreviousPage} data-testid={"back-button"}>
                {generationStepName === "CHOOSE_ITERATORS" && activeStep === 0
                  ? "Back To Parameters"
                  : "Back"}
              </GhostBtn>
            )}
            <PrimaryBtn
              onClick={onNextPage}
              disabled={nextButtonDisableFunc()}
              data-testid={"next-button"}
            >
              {getNextButtonText()}
            </PrimaryBtn>
          </DialogActions>
        </>
      )}
    </StyledGeneratedReportFooter>
  );
};

export default ReportGenerationWizardFooter;
