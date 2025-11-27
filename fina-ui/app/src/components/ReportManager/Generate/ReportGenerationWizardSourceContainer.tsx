import ReportGenerationMemoizedContainer from "./ReportGenerationMemoizedContainer";
import { Box } from "@mui/material";
import ReportGenerationWizardSourceHelper from "./ReportGenerationWizardHelpers/ReportGenerationWizardSourceHelper";
import {} from "./ParameterTypeNames";
import React from "react";
import { Iterator, Parameter } from "../../../types/reportGeneration.type";

interface Props {
  generationStepName: string;
  parameters: Partial<Parameter>[];
  iterators: Iterator[];
  activeStep: number;
  reportGenerationTypesData: any;
  onSourceTableSelectRow(rows: any, generationData: any): void;
}

const ReportGenerationWizardSourceContainer: React.FC<Props> = ({
  generationStepName,
  parameters,
  iterators,
  activeStep,
  onSourceTableSelectRow,
  reportGenerationTypesData,
}) => {
  const isVisible = (key?: string) => {
    const arr =
      generationStepName === "CHOOSE_PARAMETERS" ? parameters : iterators;
    return arr[activeStep].key === key;
  };

  return (
    <Box aria-label={"left container"} flex={1} height={"100%"}>
      {parameters.map((p, index) => {
        return (
          <Box
            height={"100%"}
            width={"100%"}
            style={{
              display: isVisible(p.key) ? "block" : "none",
            }}
            key={index}
          >
            {reportGenerationTypesData &&
              reportGenerationTypesData[p.type as string] && (
                <ReportGenerationMemoizedContainer
                  currentStepName={p.key}
                  activeStepName={`${p.name}_${p.type}_${activeStep}_CHOOSE_PARAMETERS`}
                  isDestinationContainer={false}
                  generationStepName={generationStepName}
                  data={p}
                >
                  <ReportGenerationWizardSourceHelper
                    obj={p}
                    onSourceTableSelectRow={onSourceTableSelectRow}
                    reportGenerationTypesData={reportGenerationTypesData}
                  />
                </ReportGenerationMemoizedContainer>
              )}
          </Box>
        );
      })}
      {iterators.map((p, index) => {
        return (
          <Box
            height={"100%"}
            width={"100%"}
            style={{
              display: isVisible(p.key) ? "block" : "none",
            }}
            key={index}
          >
            {reportGenerationTypesData && (
              <ReportGenerationMemoizedContainer
                currentStepName={p.key}
                activeStepName={`${p.name}_${p.type}_${activeStep}_CHOOSE_ITERATORS`}
                isDestinationContainer={false}
                generationStepName={generationStepName}
                data={p}
              >
                <ReportGenerationWizardSourceHelper
                  obj={p}
                  onSourceTableSelectRow={onSourceTableSelectRow}
                  reportGenerationTypesData={reportGenerationTypesData}
                />
              </ReportGenerationMemoizedContainer>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ReportGenerationWizardSourceContainer;
