import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Calendar from "../../components/Calendar/Calendar";
import {
  deleteEvent,
  load,
  save,
  saveMultiple,
} from "../../api/services/calendarService";
import { calendarDateFormat } from "../../util/appUtil";
import { useTranslation } from "react-i18next";
import {
  CalendarDataType,
  CalendarPeriodType,
} from "../../types/calendar.type";
import { Box, styled } from "@mui/system";

export const CALENDAR_PERIOD_CONSTRAINTS = {
  FIXED: "FIXED",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  ANNUAL: "ANNUAL",
};
export const CALENDAR_PERIOD_TYPES = [
  CALENDAR_PERIOD_CONSTRAINTS.FIXED,
  CALENDAR_PERIOD_CONSTRAINTS.WEEKLY,
  CALENDAR_PERIOD_CONSTRAINTS.MONTHLY,
  CALENDAR_PERIOD_CONSTRAINTS.ANNUAL,
];

export const CALENDAR_MONTH_CONSTANTS = {
  JANUARY: "JANUARY",
  FEBRUARY: "FEBRUARY",
  MARCH: "MARCH",
  APRIL: "APRIL",
  MAY: "MAY",
  JUNE: "JUNE",
  JULY: "JULY",
  AUGUST: "AUGUST",
  SEPTEMBER: "SEPTEMBER",
  OCTOBER: "OCTOBER",
  NOVEMBER: "NOVEMBER",
  DECEMBER: "DECEMBER",
};
export const CALENDAR_MONTHS = [
  CALENDAR_MONTH_CONSTANTS.JANUARY,
  CALENDAR_MONTH_CONSTANTS.FEBRUARY,
  CALENDAR_MONTH_CONSTANTS.MARCH,
  CALENDAR_MONTH_CONSTANTS.APRIL,
  CALENDAR_MONTH_CONSTANTS.MAY,
  CALENDAR_MONTH_CONSTANTS.JUNE,
  CALENDAR_MONTH_CONSTANTS.JULY,
  CALENDAR_MONTH_CONSTANTS.AUGUST,
  CALENDAR_MONTH_CONSTANTS.SEPTEMBER,
  CALENDAR_MONTH_CONSTANTS.OCTOBER,
  CALENDAR_MONTH_CONSTANTS.NOVEMBER,
  CALENDAR_MONTH_CONSTANTS.DECEMBER,
];

export const CALENDAR_WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
export const CALENDAR_EVENT_TYPES = ["HOLIDAY", "DAY_OFF", "EVENT"];

export const CALENDAR_DELETE_CONSTANTS = {
  DELETE: "DELETE",
  DELETE_ALL: "DELETE_ALL",
  DELETE_AFTER: "DELETE_AFTER",
};
export const CALENDAR_DELETE_TYPES = [
  CALENDAR_DELETE_CONSTANTS.DELETE,
  CALENDAR_DELETE_CONSTANTS.DELETE_ALL,
  CALENDAR_DELETE_CONSTANTS.DELETE_AFTER,
];

const StyledEvent = styled(Box)(() => ({
  display: "flex",
  height: "100%",
  "& .event": {
    padding: "2px 8px",
    margin: "8px !important",
    minHeight: 30,
  },
}));

const CalendarContainer = () => {
  const [events, setEvents] = useState<CalendarDataType[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<CalendarPeriodType>(
    {} as CalendarPeriodType
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarDataType>(
    {} as CalendarDataType
  );
  const { t } = useTranslation();

  useEffect(() => {
    let d = new Date();
    let from = new Date(d.getFullYear(), d.getMonth() - 1, 15);
    let to = new Date(d.getFullYear(), d.getMonth() + 1, 15);
    setSelectedPeriod({ from, to });
  }, []);

  useEffect(() => {
    if (selectedPeriod && selectedPeriod.from && selectedPeriod.to) {
      fetchData(selectedPeriod.from, selectedPeriod.to);
    }
  }, [selectedPeriod]);

  const fetchData = async (from: Date, to: Date) => {
    let resp = await load(from.getTime(), to.getTime());
    setEvents([
      ...resp.data.map((e: CalendarDataType) => ({
        eProps: e,
        title: e.eventType && t(e.eventType),
        description: e.comment ? e.comment : "",
        date: calendarDateFormat(e.date),
        textColor: getTextColor(e.eventType),
        backgroundColor: getBackgroundColor(e.eventType),
        borderColor: getBackgroundColor(e.eventType),
        className: "event",
        extendedProps: {},
      })),
    ]);
  };

  const onCancel = async (event: CalendarDataType) => {
    if (event) {
      event.eventType = "CANCELED";
    }
    await save(event);
    if (selectedPeriod?.from && selectedPeriod?.to) {
      await fetchData(selectedPeriod.from, selectedPeriod.to);
    }
    setSelectedEvent({});
  };

  const onDelete = async (id: string, eventDeleteType: string) => {
    await deleteEvent(id, eventDeleteType);
    if (selectedPeriod?.from && selectedPeriod?.to) {
      await fetchData(selectedPeriod.from, selectedPeriod.to);
    }
    setSelectedEvent({});
  };

  const onSubmit = async (data: CalendarDataType) => {
    if (data.calendarPeriodType === CALENDAR_PERIOD_CONSTRAINTS.FIXED) {
      await save({
        id: data.id,
        comment: data.comment,
        date: data.date,
        eventType: data.eventType,
      });
    } else {
      await saveMultiple(data);
    }
    if (selectedPeriod?.from && selectedPeriod?.to) {
      await fetchData(selectedPeriod.from, selectedPeriod.to);
    }
  };

  const getBackgroundColor = (eventType?: string) => {
    switch (eventType) {
      case "HOLIDAY":
        return "#F0F4FF";
      case "DAY_OFF":
        return "#dbe8d7";
      case "CANCELED":
        return "#FFE4E1";
      case "EVENT":
        return "#FFF4E5";
      default:
        return "#FFF4E5";
    }
  };

  const getTextColor = (eventType?: string) => {
    switch (eventType) {
      case "HOLIDAY":
        return "#2962FF";
      case "DAY_OFF":
        return "#006400";
      case "CANCELED":
        return "#DC143C";
      case "EVENT":
        return "#FF8D00";
      default:
        return "#FF8D00";
    }
  };

  return (
    <StyledEvent>
      <Calendar
        events={events}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        setSelectedPeriod={setSelectedPeriod}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </StyledEvent>
  );
};

const mapStateToProps = () => ({});

const dispatchToProps = () => ({});

export default connect(mapStateToProps, dispatchToProps)(CalendarContainer);
