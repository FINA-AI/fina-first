import React, { useEffect, useState } from "react";
import DateTimePicker from "../../../common/Field/DateTimePicker";
import {
  getFormattedDateValue,
  getTimeStampFromDateString,
} from "../../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { MiTableRowItem } from "../../../../types/manualInput.type";

interface ManualInputTableDateTimeFieldProps {
  rowItem: MiTableRowItem;
  formatPattern: string;
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

const ManualInputTableDateTimeField: React.FC<
  ManualInputTableDateTimeFieldProps
> = ({ rowItem, formatPattern }) => {
  const [rItem, setRItem] = useState<MiTableRowItem>();

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

  const onChangeHandler = (dateValue: Date | null) => {
    if (dateValue) {
      const tempValue = dateValue.getTime();
      rowItem.value = getFormattedDateValue(tempValue, formatPattern);
      setRItem({ ...rowItem, value: tempValue });
    }
  };

  const dateTimeValue =
    rItem?.value && typeof rItem?.value === "number" ? rItem?.value : null;

  return (
    <StyledBox>
      <DateTimePicker
        value={dateTimeValue}
        format={formatPattern}
        onChange={onChangeHandler}
      />
    </StyledBox>
  );
};

export default ManualInputTableDateTimeField;
