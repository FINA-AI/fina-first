import React, { useEffect, useState } from "react";
import DatePicker from "../../../common/Field/DatePicker";
import {
  getFormattedDateValue,
  getTimeStampFromDateString,
} from "../../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import {
  MiProcess,
  MiTable,
  MiTableRowItem,
} from "../../../../types/manualInput.type";
import { Tooltip } from "@mui/material";

interface ManualInputTableDateFieldProps {
  rowItem: MiTableRowItem;
  formatPattern: string;
  miProcess: MiProcess;
  table: MiTable;
}

const StyledBox = styled(Box)({
  "& input": {
    height: "31px !important",
  },
  "& .MuiOutlinedInput-root": {
    height: "31px !important",
  },
  width: 200,
});

const ManualInputTableDateField: React.FC<ManualInputTableDateFieldProps> = ({
  rowItem,
  formatPattern,
  miProcess,
  table,
}) => {
  const [rItem, setRItem] = useState<MiTableRowItem>();
  const invalid = !!rowItem.processMessage?.comparisonError;

  useEffect(() => {
    setRItem({
      ...rowItem,
      value:
        rowItem.value &&
        typeof rowItem.value === "string" &&
        rowItem.value.trim()
          ? getTimeStampFromDateString(rowItem.value, formatPattern)
          : null,
    });
  }, [rowItem]);

  const onChangeHandler = (dateValue: Date) => {
    const tempValue = dateValue.getTime();
    rowItem.value = getFormattedDateValue(tempValue, formatPattern);
    setRItem({ ...rowItem, value: tempValue });
    miProcess.recalculate(rowItem, table);
  };

  return (
    <Tooltip arrow title={invalid && rowItem.processMessage?.message}>
      <StyledBox>
        <DatePicker
          value={rItem?.value}
          format={formatPattern}
          onChange={onChangeHandler}
          isError={invalid}
        />
      </StyledBox>
    </Tooltip>
  );
};

export default ManualInputTableDateField;
