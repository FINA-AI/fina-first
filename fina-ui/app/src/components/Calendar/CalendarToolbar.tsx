import { Box } from "@mui/system";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import React, { useState } from "react";
import GhostBtn from "../common/Button/GhostBtn";
import { CALENDAR_MONTHS } from "../../containers/Calendar/CalendarContainer";
import Popover from "@mui/material/Popover";
import MiniCalendar from "./MiniCalendar";
import { CalendarPeriodType } from "../../types/calendar.type";
import FullCalendar from "@fullcalendar/react";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box)({
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  marginBottom: "15px",
  maxHeight: "32px",
  "& .MuiPaper-elevation": {
    display: "none",
  },
});

const StyledLeftSide = styled(Box)(({ theme }: any) => ({
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "16px",
}));

const StyledRightSide = styled(Box)({
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "flex-end",
  "& .MuiSvgIcon-root": {
    marginLeft: "5px",
  },
});

const StyledArrowLeftBtn = styled("span")(({ theme }: any) => ({
  marginRight: "10px",
  borderRadius: "10px",
  background: theme.palette.mode === "light" ? "#F9F9F9" : "#4f5c68",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "light" ? "#8695B1" : "#b5c9dc",
    display: "flex",
    alignItems: "center",
  },
}));

const StyledArrowRightBtn = styled("span")(({ theme }: any) => ({
  marginLeft: "10px",
  borderRadius: "10px",
  background: theme.palette.mode === "light" ? "#F9F9F9" : "#4f5c68",
  alignItems: "center",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "light" ? "#8695B1" : "#b5c9dc",
    display: "flex",
    alignItems: "center",
  },
}));

const StyledDate = styled("span")({
  cursor: "pointer",
  minWidth: "130px",
  display: "flex",
  justifyContent: "center",
});

interface CalendarToolbarProps {
  setSelectedPeriod: (period: CalendarPeriodType) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  calendarRef: React.RefObject<FullCalendar>;
}
const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  setSelectedPeriod,
  setOpen,
  calendarRef,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [date, setDate] = useState(new Date());

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onDateChange = (newDateFirstDay: Date, newDateLastDay: Date) => {
    setDate(newDateFirstDay);
    setSelectedPeriod({ from: newDateFirstDay, to: newDateLastDay });
    calendarRef.current &&
      calendarRef.current.getApi().gotoDate(new Date(newDateFirstDay));
  };

  const onDateRowChange = (type: string) => {
    if (type === "prev") {
      let newDateFirstDay = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1
      );
      let newDateLastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      onDateChange(newDateFirstDay, newDateLastDay);
    } else if (type === "next") {
      let newDateFirstDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      );
      let newDateLastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
      onDateChange(newDateFirstDay, newDateLastDay);
    } else {
      let newDateFirstDay = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1
      );
      let newDateLastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      setDate(new Date());
      setSelectedPeriod({ from: newDateFirstDay, to: newDateLastDay });
      calendarRef.current && calendarRef.current.getApi().gotoDate(new Date());
    }
  };

  const miniCalendarOnChange = (month: number, year: number) => {
    let nDate = new Date(`${month + 1}/1/${year}`);
    setDate(nDate);
    setSelectedPeriod({ from: nDate, to: new Date(year, month + 1, 0) });
    calendarRef.current &&
      calendarRef.current.getApi().gotoDate(new Date(nDate));
  };

  return (
    <StyledRoot data-testid={"toolbar"}>
      <StyledLeftSide>
        <StyledArrowLeftBtn
          onClick={() => onDateRowChange("prev")}
          data-testid={"prev-button"}
        >
          <KeyboardArrowLeftIcon />
        </StyledArrowLeftBtn>
        <StyledDate onClick={handleClick}>
          <span>{t(CALENDAR_MONTHS[date.getMonth()])}</span>
          <span style={{ marginLeft: "10px" }}>{date.getFullYear()}</span>
        </StyledDate>
        <StyledArrowRightBtn
          onClick={() => onDateRowChange("next")}
          data-testid={"next-button"}
        >
          <KeyboardArrowRightIcon />
        </StyledArrowRightBtn>
      </StyledLeftSide>
      <StyledRightSide>
        <GhostBtn
          onClick={() => onDateRowChange("")}
          style={{ marginRight: "8px" }}
          data-testid={"today-button"}
        >
          {t("today")}
        </GhostBtn>
        {hasPermission(PERMISSIONS.FINA_CALENDAR_AMEND) && (
          <PrimaryBtn
            onClick={() => setOpen(true)}
            endIcon={<AddIcon />}
            data-testid={"create-event-button"}
          >
            {t("addNew")}
          </PrimaryBtn>
        )}
      </StyledRightSide>
      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          marginTop: "15px",
        }}
        open={open}
      >
        <MiniCalendar onChange={miniCalendarOnChange} currentDate={date} />
      </Popover>
    </StyledRoot>
  );
};

export default CalendarToolbar;
