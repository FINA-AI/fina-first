import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import { DateRange } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import format from "date-fns/format";
import PeriodPickerModal from "./PeriodPickerModal";
import TextField from "../../../common/Field/TextField";

interface PeriodPickerProps {
  value?: { start: Date | null; end: Date | null };
  setValue: (value: { start: Date | null; end: Date | null }) => void;
  label: string;
  dateFormat: string;
}

const PeriodPicker: React.FC<PeriodPickerProps> = ({
  value,
  setValue,
  label,
  dateFormat,
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const popupOpen = Boolean(anchorEl);

  const getLabel = (start: Date, end: Date) => {
    if (start && end) {
      const startString =
          start && !isNaN(start.getTime()) ? format(start, dateFormat) : "",
        endString = end ? format(end, dateFormat) : "";
      return !start && !end ? "" : startString + " - " + endString;
    }
  };

  const displayValue =
    value?.start && value?.end ? getLabel(value?.start, value?.end) : "";

  return (
    <div>
      <TextField
        label={label}
        placeholder={dateFormat + " - " + dateFormat}
        value={displayValue}
        onChange={() => {}}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="start"
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                }}
                style={{ padding: 4 }}
                size="large"
              >
                <DateRange style={{ color: "primary" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        open={popupOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <PeriodPickerModal
          onRangeChange={(start: Date | null, end: Date | null) => {
            setValue({ start: start, end: end });
          }}
          startDate={value?.start}
          endDate={value?.end}
          popoverClose={() => setAnchorEl(null)}
        />
      </Popover>
    </div>
  );
};

export default PeriodPicker;
