import React, { FC, useState } from "react";
import { FieldSize } from "../../types/common.type";
import PeriodsVirtualizedGridContainer from "../PeriodDefinition/PeriodVirtualizedGridContainer";
import { PeriodType } from "../../types/period.type";

interface SchedulePeriodsContainerProps {
  onNewScheduleChange: (key: string, value: any) => void;
  periodTypes: PeriodType[];
}

const SchedulePeriodsContainer: FC<SchedulePeriodsContainerProps> = ({
  onNewScheduleChange,
  periodTypes = [],
}) => {
  const [selectedRows, setSelectedRows] = useState<PeriodType[]>([]);

  const onCheckFunc = (val: PeriodType[]) => {
    setSelectedRows(val);
    onNewScheduleChange(
      "periods",
      val.map((v) => v.id)
    );
  };

  return (
    <PeriodsVirtualizedGridContainer
      selectedRows={selectedRows}
      onCheckFunc={onCheckFunc}
      periodTypes={periodTypes}
      size={FieldSize.SMALL}
    />
  );
};

export default SchedulePeriodsContainer;
