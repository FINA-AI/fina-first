import React, { useState } from "react";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import isSameDay from "date-fns/isSameDay";
import format from "date-fns/format";
import isWithinInterval from "date-fns/isWithinInterval";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface PeriodPickerModalProps {
  onRangeChange: (start: Date | null, end: Date | null) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  popoverClose: VoidFunction;
}

const StyledClearButton = styled(Button)({
  paddingTop: "15px",
  paddingBottom: "15px",
  width: "100px",
  fontSize: "12px",
  height: "32px",
});

const StyledFilterButton = styled(Button)(({ theme }: { theme: any }) => ({
  width: "120px",
  height: "32px",
  ...theme.primaryBtn,
}));

const StyledButtonBox = styled(Box)(({ theme }: { theme: any }) => ({
  borderTop: theme.palette.borderColor,
  background: theme.palette.paperBackground,
  padding: "8px 16px",
}));

const StyledRoot = styled(Grid)(({ theme }: { theme: any }) => ({
  "& .MuiPickersLayout-root": {
    background: theme.palette.paperBackground,
  },
  "& .MuiPickersLayout-actionBar": {
    display: "none !important",
  },
  "& .MuiPickersToolbar-root": {
    display: "none !important",
  },
}));

const PeriodPickerModal: React.FC<PeriodPickerModalProps> = ({
  onRangeChange,
  startDate = null,
  endDate = null,
  popoverClose,
}) => {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const { t } = useTranslation();

  const makeJSDateObject = (d: Date) => new Date(d.getTime());

  const clear = () => {
    setStart(null);
    setEnd(null);
    onRangeChange(null, null);
  };

  const renderWrappedWeekDay = (
    date: Date,
    selectedDate: Date,
    dayInCurrentMonth: boolean
  ) => {
    let dateClone = makeJSDateObject(date);

    const isFirstDay = start != null ? isSameDay(dateClone, start) : false;
    const isLastDay = end != null ? isSameDay(dateClone, end) : false;
    const dayIsBetween =
      isFirstDay ||
      isLastDay ||
      (start != null && end != null && start <= end
        ? isWithinInterval(dateClone, { start, end }) || isFirstDay
        : false);

    return (
      <Box
        sx={(theme) => ({
          ...(dayIsBetween && {
            background: theme.palette.primary.main,
            color: theme.palette.common.white,
          }),
          ...((isFirstDay || isLastDay) && {
            extend: "highlight",
            borderTopLeftRadius: "50%",
            borderBottomLeftRadius: "50%",
          }),
        })}
      >
        <IconButton
          size="large"
          sx={{
            width: 36,
            height: 36,
            fontSize: 16,
            margin: "0 2px",
            color:
              !dayInCurrentMonth && dayIsBetween
                ? "black"
                : !dayInCurrentMonth
                ? "red"
                : "inherit",
          }}
        >
          <span> {format(dateClone, "d")} </span>
        </IconButton>
      </Box>
    );
  };

  return (
    <>
      <Grid container direction={"row"}>
        <StyledRoot item>
          <StaticDatePicker
            value={start}
            onChange={(date) => {
              setStart(date);
              onRangeChange(date, end);
            }}
            // @ts-ignore
            renderDay={renderWrappedWeekDay}
            slots={{
              toolbar: () => null,
            }}
          />
        </StyledRoot>
        <StyledRoot item>
          <StaticDatePicker
            value={end}
            onChange={(date) => {
              setEnd(date);
              onRangeChange(start, date);
            }}
            // @ts-ignore
            renderDay={renderWrappedWeekDay}
            slots={{
              toolbar: () => null,
            }}
          />
        </StyledRoot>
      </Grid>
      <StyledButtonBox display="flex" flexDirection="row-reverse">
        <StyledFilterButton
          variant={"contained"}
          size={"large"}
          onClick={popoverClose}
          style={{ boxShadow: "none" }}
        >
          {t("save")}
        </StyledFilterButton>
        <StyledClearButton variant={"text"} size={"small"} onClick={clear}>
          {t("clear")}
        </StyledClearButton>
      </StyledButtonBox>
    </>
  );
};

export default PeriodPickerModal;
