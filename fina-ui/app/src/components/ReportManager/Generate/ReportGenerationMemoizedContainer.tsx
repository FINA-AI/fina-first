import React, { memo, ReactElement } from "react";
import { Parameter } from "../../../types/reportGeneration.type";

interface Props {
  currentStepName?: string;
  activeStepName: string;
  isDestinationContainer: boolean;
  generationStepName: string;
  currentSelectedDestinationSelectedRows?: any;
  data: Partial<Parameter>;
  children: ReactElement | null;
}

const ReportGenerationMemoizedContainer: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default memo(
  ReportGenerationMemoizedContainer,
  (prevProps: any, nextProps: any) => {
    if (!nextProps.isDestinationContainer) {
      return true;
    } else {
      if (
        nextProps.currentStepName === nextProps.activeStepName &&
        nextProps.generationStepName === nextProps.data.generationStepName
      ) {
        return (
          prevProps.currentSelectedDestinationSelectedRows ===
          nextProps.currentSelectedDestinationSelectedRows
        );
      }
      return true;
    }
  }
);
