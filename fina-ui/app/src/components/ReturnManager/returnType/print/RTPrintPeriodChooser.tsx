import PeriodsVirtualizedGridContainer from "../../../../containers/PeriodDefinition/PeriodVirtualizedGridContainer";
import { FieldSize } from "../../../../types/common.type";
import React from "react";

interface ReturnTypePrintPeriodContainerProps {
  onChange: (value: number[]) => void;
}
const RTPrintPeriodChooser: React.FC<ReturnTypePrintPeriodContainerProps> = ({
  onChange,
}) => {
  return (
    <PeriodsVirtualizedGridContainer
      onCheckFunc={(rows) => onChange(rows.map((row) => row.id))}
      size={FieldSize.SMALL}
      singleRowSelect={true}
    />
  );
};

export default RTPrintPeriodChooser;
