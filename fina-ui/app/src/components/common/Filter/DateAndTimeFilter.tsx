import React, { useState } from "react";
import { Box, styled } from "@mui/system";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import TextField from "../Field/TextField";
import useConfig from "../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../util/appUtil";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../Button/PrimaryBtn";
import TodayIcon from "@mui/icons-material/Today";
import InputAdornment from "@mui/material/InputAdornment";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface DateAndTimeFilterProps {
  closeFilter: (val: DefaultValueType) => void;
  onClickFunction: (val: DefaultValueType) => void;
  defaultValue: DefaultValueType;
}

interface DefaultValueType {
  name: string;
  start?: number;
  end?: number;
  type: string;
}

type PickerVisibleType = { from: boolean; to: boolean };
type PickerKeyType = "from" | "to";

const StyledDateTimePickerBox = styled(Box)(({ theme }) => ({
  "& .MuiStack-root": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#344258" : theme.palette.paperBackground,
    position: "fixed",
    marginTop: "22px",
    borderRadius: "4px",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px 0px rgba(0, 0, 0, 0.22)"
        : "0px 5px 5px -3px rgba(80, 80, 80, 0.2), 0px 8px 10px 1px rgba(80, 80, 80, 0.14), 0px 3px 14px 2px rgba(80, 80, 80, 0.12)",
  },
  "& .MuiPickersToolbar-root": {
    "& .MuiTypography-overline": {
      display: "none",
    },
  },
  "& .MuiTabs-root": {
    "& .MuiButtonBase-root": {
      backgroundColor: theme.palette.mode === "dark" && "rgb(60,77,104)",
    },
  },
  "& .MuiPickersLayout-root": {
    backgroundColor: theme.palette.mode === "dark" && "#344258",
  },
  "& .MuiPickersLayout-actionBar, & .MuiDialogActions-root": {
    display: "none",
  },
}));

const StyledActionButtonsBox = styled(Box)(() => ({
  margin: "0px !important",
  display: "flex",
  marginLeft: "auto !important",
  gap: "10px",
  padding: "0px 5px 5px 0px",
}));

const StyledInputAdornment = styled(InputAdornment)(() => ({
  marginLeft: "0px",
  "& svg": {
    top: 0,
  },
}));

const StyledTodayIcon = styled(TodayIcon)(() => ({
  cursor: "pointer",
  margin: "0px",
}));

const DateAndTimeFilter: React.FC<DateAndTimeFilterProps> = ({
  closeFilter,
  onClickFunction,
  defaultValue,
}) => {
  const { getDateFormat, config }: any = useConfig();
  const { t } = useTranslation();

  const [activeFilterBtn, setActiveFilterBtn] = useState<boolean>(false);
  const [isPickerVisible, setPickerVisible] = useState<PickerVisibleType>({
    from: false,
    to: false,
  });
  const [selectedDate, setSelectedDate] =
    useState<DefaultValueType>(defaultValue);

  const handleTogglePicker = (key: PickerKeyType) => {
    if (isPickerVisible[key]) return;

    setPickerVisible({
      from: key === "from",
      to: key === "to",
    });
  };

  const handleDateChange = (newValue: Date | null) => {
    if (!newValue) return;

    const isFromPicker = isPickerVisible.from;

    let date = {
      name: selectedDate.name,
      type: selectedDate.type,
      start: isFromPicker ? newValue.valueOf() : selectedDate.start,
      end: !isFromPicker ? newValue.valueOf() : selectedDate.end,
    };

    setSelectedDate(date);
    setActiveFilterBtn(Boolean(date.start || date.end));
  };

  const handleDone = () => {
    setPickerVisible({ from: false, to: false });
  };

  const shouldDisableDate = (date: Date) => {
    if (isPickerVisible.to && selectedDate.start) {
      const disabledDateBefore = new Date(selectedDate.start);
      return date < disabledDateBefore;
    }
    return false;
  };

  const getDateTimeValue = () => {
    return isPickerVisible.from
      ? selectedDate.start
        ? new Date(selectedDate.start)
        : null
      : selectedDate.end
      ? new Date(selectedDate.end)
      : null;
  };

  return (
    <Box
      sx={{
        padding: "0px 10px",
        width: "100%",
        display: "flex",
        gap: "5px",
      }}
    >
      <span onClick={() => handleTogglePicker("from")}>
        <TextField
          readOnly={true}
          label={t("from")}
          value={
            selectedDate.start
              ? getFormattedDateValue(selectedDate.start, getDateFormat(false))
              : config.dateTimeFormat
          }
          InputProps={{
            endAdornment: (
              <StyledInputAdornment position="end">
                <StyledTodayIcon />
              </StyledInputAdornment>
            ),
          }}
          data-testid={"from-field"}
        />
      </span>
      <span onClick={() => handleTogglePicker("to")}>
        <TextField
          readOnly={true}
          label={t("to")}
          value={
            selectedDate.end
              ? getFormattedDateValue(selectedDate.end, getDateFormat(false))
              : config.dateTimeFormat
          }
          InputProps={{
            endAdornment: (
              <StyledInputAdornment position="end">
                <StyledTodayIcon />
              </StyledInputAdornment>
            ),
          }}
          data-testid={"to-field"}
        />
      </span>
      <StyledDateTimePickerBox sx={{ position: "absolute", left: 0 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {(isPickerVisible.from || isPickerVisible.to) && (
            <DemoContainer components={["StaticDateTimePicker"]}>
              <DemoItem>
                <StaticDateTimePicker
                  value={getDateTimeValue()}
                  onChange={handleDateChange}
                  shouldDisableDate={shouldDisableDate}
                  data-testid={"static-date-time-input"}
                />
                <StyledActionButtonsBox>
                  <PrimaryBtn onClick={handleDone} data-testid={"done-button"}>
                    {t("done")}
                  </PrimaryBtn>
                </StyledActionButtonsBox>
              </DemoItem>
            </DemoContainer>
          )}
        </LocalizationProvider>
      </StyledDateTimePickerBox>
      <Box sx={{ display: "flex" }}>
        <span
          style={{
            cursor: activeFilterBtn ? "pointer" : "",
            opacity: activeFilterBtn ? "1" : "0.5",
            paddingRight: "10px",
            display: "flex",
          }}
          onClick={() => activeFilterBtn && onClickFunction(selectedDate)}
          data-testid={"filter-button"}
        >
          <FilterIcon />
        </span>
        <GridFilterCloseButton
          disabled={!activeFilterBtn}
          onClose={() => closeFilter(selectedDate)}
        />
      </Box>
    </Box>
  );
};

export default DateAndTimeFilter;
