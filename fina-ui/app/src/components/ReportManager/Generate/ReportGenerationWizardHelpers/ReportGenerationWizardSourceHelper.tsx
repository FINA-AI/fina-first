import ReportGenerationFITree from "../ReportGenerationWizardSteps/ReportGenerationFITree";
import MDTContainer from "../../../../containers/MDT/MDTContainer";
import ReturnVersionGridContainer from "../../../../containers/ReturnVersionsContainer/ReturnVersionGridContainer";
import ReportGenerationGroupContainer from "../../../../containers/ReportManager/Generate/ReportGenerationGroupContainer";
import { Box } from "@mui/system";
import { ReportParameterType } from "../ParameterTypeNames";
import PeriodsVirtualizedGridContainer from "../../../../containers/PeriodDefinition/PeriodVirtualizedGridContainer";
import { getCurrentYearLastDate } from "./ReportGenerationWizardHelper";
import React from "react";
import { Iterator, Parameter } from "../../../../types/reportGeneration.type";
import { ReturnVersion } from "../../../../types/importManager.type";

interface Props {
  onSourceTableSelectRow: any;
  reportGenerationTypesData: any;
  obj: Iterator | Partial<Parameter>;
}

const ReportGenerationWizardSourceHelper: React.FC<Props> = ({
  obj,
  onSourceTableSelectRow,
  reportGenerationTypesData,
}) => {
  const getFIlteredDataByPattern = () => {
    let name = obj.name;

    if (name && !name.includes("$")) {
      return reportGenerationTypesData;
    } else if (name) {
      name = "$" + name.split("$")[1];

      const regex = /\$([^#]+)(?:#(\d+))?/;
      const match = name.match(regex);
      let filteredCodes: string[] = [];

      if (match) {
        filteredCodes = match[1].split(",");
      }

      const bankKey = ReportParameterType.BANK;
      const periodKey = ReportParameterType.PERIOD;

      return Object.fromEntries(
        Object.entries(reportGenerationTypesData).map(
          ([key, value]: [string, any]) => {
            if (key === bankKey) {
              return [
                key,
                value?.filter((item: any) =>
                  filteredCodes.includes(item?.parent?.code)
                ),
              ];
            } else if (key === periodKey) {
              return [
                key,
                {
                  ...value,
                  periods: value.periods.filter((item: any) => {
                    return filteredCodes.some(
                      (code) =>
                        code.toUpperCase() ===
                        item?.periodType?.periodType?.toUpperCase()
                    );
                  }),
                },
              ];
            } else {
              return [key, value];
            }
          }
        )
      );
    }
  };

  const getSourceComponent = (generationData: Parameter) => {
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
        return null;
      case ReportParameterType.BANK:
        return (
          <Box
            display={"flex"}
            overflow={"hidden"}
            width={"100%"}
            height={"100%"}
            data-testid={`source-${generationData?.name}-fi-tree`}
          >
            <ReportGenerationFITree
              onSelectRowFun={(selectedRows) =>
                onSourceTableSelectRow(selectedRows, generationData)
              }
              isDestinationGrid={false}
              reportGenerationTypesData={getFIlteredDataByPattern()}
              rManagerHelperType={"source"}
            />
          </Box>
        );
      case ReportParameterType.NODE:
        return (
          <div
            data-testid={`source-${generationData?.name}-node-tree`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <MDTContainer
              hideHeader={true}
              onNodeSelectionChange={(row, selectedRows) =>
                onSourceTableSelectRow(selectedRows, generationData)
              }
              allMDTCODE={reportGenerationTypesData["Node"]}
              showSkeleton={true}
            />
          </div>
        );
      case ReportParameterType.PEER:
        return (
          <div
            data-testid={`source-${generationData?.name}-peer-tree`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <ReportGenerationGroupContainer
              onCheckFunc={(selectedRows) => {
                onSourceTableSelectRow(selectedRows, generationData);
              }}
              isDestination={false}
              reportGenerationTypesData={reportGenerationTypesData}
            />
          </div>
        );
      case ReportParameterType.PERIOD:
        return (
          <div
            data-testid={`source-${generationData?.name}-periods-grid`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <PeriodsVirtualizedGridContainer
              onCheckFunc={(selectedRows) => {
                onSourceTableSelectRow(selectedRows, generationData);
              }}
              selectedRows={[]}
              periodPredefinedData={getFIlteredDataByPattern()?.Period}
              defaultFilter={{ toDate: getCurrentYearLastDate() }}
            />
          </div>
        );
      case ReportParameterType.OFFSET:
        return null;
      case ReportParameterType.VERSION:
        return (
          <div
            data-testid={`source-${generationData?.name}-versions-grid`}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            <ReturnVersionGridContainer
              onCheckFunc={(selectedRows) => {
                onSourceTableSelectRow(selectedRows, generationData);
              }}
              defaultData={reportGenerationTypesData?.Version}
              rowOnCLick={(
                _row: ReturnVersion,
                _checked: boolean,
                checkedRows: ReturnVersion[]
              ) => {
                onSourceTableSelectRow(checkedRows, generationData);
              }}
            />
          </div>
        );
      default:
        return <div>Not Implemented Yet!</div>;
    }
  };

  return getSourceComponent(obj as Parameter);
};

export default ReportGenerationWizardSourceHelper;
