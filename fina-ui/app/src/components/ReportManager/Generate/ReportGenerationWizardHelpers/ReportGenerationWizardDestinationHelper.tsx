import ReportGenerationFITree from "../ReportGenerationWizardSteps/ReportGenerationFITree";
import ReportGenerationDestinationNodeGrid from "../ReportGenerationWizardSteps/ReportGenerationDestinationNodeGrid";
import ReportGenerationDestinationPeriodGrid from "../ReportGenerationWizardSteps/ReportGenerationDestinationPeriodGrid";
import { Box } from "@mui/material";
import OffsetContainer from "../../../../containers/ReportManager/Generate/offsetContainer";
import ReportGenerationDestinationVersionGrid from "../ReportGenerationWizardSteps/ReportGenerationDestinationVersionGrid";
import ReportGenerationGroupContainer from "../../../../containers/ReportManager/Generate/ReportGenerationGroupContainer";
import ReportGenerationSchedulePage from "../ReportGenerationSchedule/ReportGenerationSchedulePage";
import React from "react";
import {
  Parameter,
  ReportSchedule,
} from "../../../../types/reportGeneration.type";
import { ReportParameterType } from "../ParameterTypeNames";

interface Props {
  obj: Parameter;
  currentSelectedDestinationSelectedRows: any;
  onDestinationTableSelectRow: (rows: any, generationData: any) => void;
  currentOperationName: React.MutableRefObject<string | undefined>;
  onDraggableFunc: (rows: any, key?: string) => void;
  setSchedules?(schedule: ReportSchedule): void;
}

const ReportGenerationWizardDestinationHelper: React.FC<Props> = ({
  currentSelectedDestinationSelectedRows,
  onDestinationTableSelectRow,
  obj,
  currentOperationName,
  onDraggableFunc,
  setSchedules,
}) => {
  const getDestinationComponent = (generationData: Parameter) => {
    let type = generationData.type;
    if (
      (type === ReportParameterType.VCT ||
        type === ReportParameterType.PLAIN_VCT) &&
      generationData.vctIteratorInfo !== null
    ) {
      type = generationData.vctIteratorInfo.type;
    }

    switch (type) {
      case ReportParameterType.SCHEDULE:
        return <ReportGenerationSchedulePage setSchedules={setSchedules} />;
      case ReportParameterType.BANK:
        return (
          <Box
            display={"flex"}
            overflow={"hidden"}
            width={"100%"}
            height={"100%"}
            data-testid={`destination-${generationData?.name}-fi-tree`}
          >
            <ReportGenerationFITree
              data={currentSelectedDestinationSelectedRows}
              onSelectRowFun={(selectedRows) =>
                onDestinationTableSelectRow(selectedRows, generationData)
              }
              isDestinationGrid={true}
              rManagerHelperType={"destination"}
            />
          </Box>
        );
      case ReportParameterType.NODE:
        return (
          <div
            data-testid={`destination-${generationData?.name}-node-grid`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <ReportGenerationDestinationNodeGrid
              rows={currentSelectedDestinationSelectedRows}
              onCheckboxClick={(selectedRows: any) => {
                onDestinationTableSelectRow(selectedRows, generationData);
              }}
              virtualized={false}
              draggable={true}
              onDraggableFunc={onDraggableFunc}
              type={generationData.name}
            />
          </div>
        );
      case ReportParameterType.PERIOD:
        return (
          <div
            data-testid={`destination-${generationData?.name}-periods-grid`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <ReportGenerationDestinationPeriodGrid
              rows={currentSelectedDestinationSelectedRows}
              onCheckboxClick={(selectedRows) => {
                onDestinationTableSelectRow(selectedRows, generationData);
              }}
              virtualized={true}
              draggable={true}
              currentOperationName={currentOperationName}
              onDraggableFunc={onDraggableFunc}
              type={generationData.name}
            />
          </div>
        );
      case ReportParameterType.OFFSET:
        return (
          <OffsetContainer
            onAddNew={(selectedRows) => {
              onDestinationTableSelectRow(selectedRows, generationData);
            }}
          />
        );
      case ReportParameterType.VERSION:
        return (
          <div
            data-testid={`destination-${generationData?.name}-versions-grid`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <ReportGenerationDestinationVersionGrid
              rows={currentSelectedDestinationSelectedRows}
              onCheckboxClick={(selectedRows) => {
                onDestinationTableSelectRow(selectedRows, generationData);
              }}
              virtualized={false}
              draggable={true}
              onDraggableFunc={onDraggableFunc}
              type={generationData.name}
            />
          </div>
        );
      case ReportParameterType.PEER:
        return (
          <div
            data-testid={`destination-${generationData?.name}-peer-tree`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <ReportGenerationGroupContainer
              onCheckFunc={(selectedRows) => {
                onDestinationTableSelectRow(selectedRows, generationData);
              }}
              rows={currentSelectedDestinationSelectedRows}
              isDestination={true}
            />
          </div>
        );
      default:
        return <div>Return Specific component</div>;
    }
  };
  return getDestinationComponent(obj);
};

export default ReportGenerationWizardDestinationHelper;
