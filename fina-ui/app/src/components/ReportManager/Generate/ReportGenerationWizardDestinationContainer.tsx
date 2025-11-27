import ReportGenerationMemoizedContainer from "./ReportGenerationMemoizedContainer";
import { Box } from "@mui/material";
import ReportGenerationWizardDestinationHelper from "./ReportGenerationWizardHelpers/ReportGenerationWizardDestinationHelper";
import {
  Iterator,
  Parameter,
  ReportSchedule,
} from "../../../types/reportGeneration.type";
import React from "react";

interface Props {
  parameters: Partial<Parameter>[];
  iterators: Iterator[];
  activeStep: number;
  currentSelectedDestinationSelectedRows: any;
  generationStepName: string;
  currentOperationName: React.MutableRefObject<string | undefined>;
  setSchedules?(schedule: ReportSchedule): void;
  onDraggableFunc(rows: any, key?: string): void;
  onDestinationTableSelectRow(rows: any, generationData: any): void;
}

const ReportGenerationWizardDestinationContainer: React.FC<Props> = ({
  parameters,
  iterators,
  activeStep,
  currentSelectedDestinationSelectedRows,
  generationStepName,
  onDestinationTableSelectRow,
  currentOperationName,
  onDraggableFunc,
  setSchedules,
}) => {
  const isVisible = (key?: string) => {
    const arr =
      generationStepName === "CHOOSE_PARAMETERS" ? parameters : iterators;
    return arr[activeStep].key === key;
  };
  return (
    <Box aria-label={"right container"} flex={1} height={"100%"}>
      {parameters.map((p, index) => {
        return (
          <Box
            height={"100%"}
            width={"100%"}
            style={{
              display: isVisible(p?.key) ? "block" : "none",
            }}
            key={index}
          >
            <ReportGenerationMemoizedContainer
              currentStepName={p.key}
              activeStepName={`${p.name}_${p.type}_${activeStep}_CHOOSE_PARAMETERS`}
              isDestinationContainer={true}
              currentSelectedDestinationSelectedRows={
                currentSelectedDestinationSelectedRows
              }
              data={p}
              generationStepName={generationStepName}
            >
              <ReportGenerationWizardDestinationHelper
                obj={p as Parameter}
                onDestinationTableSelectRow={onDestinationTableSelectRow}
                currentSelectedDestinationSelectedRows={
                  currentSelectedDestinationSelectedRows
                }
                currentOperationName={currentOperationName}
                onDraggableFunc={onDraggableFunc}
                setSchedules={setSchedules}
              />
            </ReportGenerationMemoizedContainer>
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
            <ReportGenerationMemoizedContainer
              currentStepName={p.key}
              activeStepName={`${p.name}_${p.type}_${activeStep}_CHOOSE_ITERATORS`}
              isDestinationContainer={true}
              currentSelectedDestinationSelectedRows={
                currentSelectedDestinationSelectedRows
              }
              generationStepName={generationStepName}
              data={p}
            >
              <ReportGenerationWizardDestinationHelper
                obj={p}
                onDestinationTableSelectRow={onDestinationTableSelectRow}
                currentSelectedDestinationSelectedRows={
                  currentSelectedDestinationSelectedRows
                }
                currentOperationName={currentOperationName}
                onDraggableFunc={onDraggableFunc}
              />
            </ReportGenerationMemoizedContainer>
          </Box>
        );
      })}
    </Box>
  );
};

export default ReportGenerationWizardDestinationContainer;
