import { Parameter } from "../../../types/reportGeneration.type";
import React, { useMemo } from "react";
import { ReportParameterType } from "../Generate/ParameterTypeNames";
import { Box } from "@mui/system";
import ReportFiTree from "./ReportFiTree";
import PeriodsVirtualizedGridContainer from "../../../containers/PeriodDefinition/PeriodVirtualizedGridContainer";
import ReportEditPeriodGrid from "./ReportEditPeriodGrid";
import { PeriodDefinitionType } from "../../../types/period.type";
import { FiType } from "../../../types/fi.type";
import FiGroupTree from "../../FI/Configuration/FiStructure/FiGroupTree";
import MDTContainer from "../../../containers/MDT/MDTContainer";
import ReportGenerationDestinationNodeGrid from "../Generate/ReportGenerationWizardSteps/ReportGenerationDestinationNodeGrid";
import { MdtNode } from "../../../types/mdt.type";
import ReturnVersionGridContainer from "../../../containers/ReturnVersionsContainer/ReturnVersionGridContainer";
import { ReturnVersion } from "../../../types/importManager.type";

interface ReportEditDataChooserProps {
  parameter: Parameter;
  data: any;
  checkedRows?: any[];
  isDestination: boolean;
  onSelect: (selectedItems?: any[]) => void;
}

const ReportEditDataChooser: React.FC<ReportEditDataChooserProps> = ({
  parameter,
  data,
  checkedRows,
  isDestination = false,
  onSelect,
}) => {
  const onSelectionChange = (selectedRows?: any[]) => {
    onSelect(selectedRows);
  };

  const Component = useMemo(() => {
    switch (parameter.type) {
      case ReportParameterType.PEER:
        return (
          <FiGroupTree
            initialData={data}
            checkedRows={checkedRows ? checkedRows : []}
            onCheckboxClick={(_, checkedRows: any[]) => {
              onSelectionChange(checkedRows);
            }}
          />
        );
      case ReportParameterType.NODE:
        if (isDestination)
          return (
            <ReportGenerationDestinationNodeGrid
              rows={data as MdtNode[]}
              checkedRows={checkedRows}
              onCheckboxClick={(selectedRows: any) => {
                onSelectionChange(selectedRows);
              }}
              virtualized={false}
              draggable={true}
              onDraggableFunc={() => {}}
              type={""}
            />
          );
        return (
          <MDTContainer
            hideHeader={true}
            onNodeSelectionChange={(row, selectedRows) => {
              onSelectionChange(selectedRows);
            }}
            allMDTCODE={[]}
            showSkeleton={true}
          />
        );
      case ReportParameterType.PERIOD:
        if (isDestination) {
          return (
            <ReportEditPeriodGrid
              rows={data as PeriodDefinitionType[]}
              onCheckboxClick={(selectedRows) => {
                onSelectionChange(selectedRows);
              }}
              virtualized={true}
              draggable={true}
              onDraggableFunc={() => {}}
              selectedRows={checkedRows}
            />
          );
        }

        return (
          <PeriodsVirtualizedGridContainer
            onCheckFunc={(selectedRows) => {
              onSelectionChange(selectedRows);
            }}
            periodPredefinedData={data && data.length > 0 && { periods: data }}
            selectedRows={checkedRows}
          />
        );
      case ReportParameterType.VERSION:
        return (
          <ReturnVersionGridContainer
            onCheckFunc={(selectedRows) => {
              onSelectionChange(selectedRows);
            }}
            defaultData={data}
            rowOnCLick={(
              _row: ReturnVersion,
              _checked: boolean,
              checkedRows: ReturnVersion[]
            ) => {
              onSelectionChange(checkedRows);
            }}
            checkedRows={checkedRows}
          />
        );
      case ReportParameterType.BANK:
        return (
          <Box
            display={"flex"}
            overflow={"hidden"}
            width={"100%"}
            height={"100%"}
          >
            <ReportFiTree
              data={data}
              expanded={isDestination}
              checkedFis={checkedRows as FiType[]}
              onSelectionChange={(selectedRows) => {
                onSelect(selectedRows);
              }}
            />
          </Box>
        );
    }

    return <div>Not Implemented Yet!</div>;
  }, [data]);

  return (
    <Box display={"flex"} overflow={"hidden"} width={"100%"} height={"100%"}>
      {Component}
    </Box>
  );
};

export default ReportEditDataChooser;
