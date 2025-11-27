import React, { useEffect, useRef, useState } from "react";
import FullCalendar, { EventClickArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ClickAwayListener, Popover, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CalendarEventCreate from "./CalendarEventCreate";
import { Box } from "@mui/system";
import ClosableModal from "../common/Modal/ClosableModal";
import { getFormattedDateValue } from "../../util/appUtil";
import {
  CALENDAR_DELETE_CONSTANTS,
  CALENDAR_DELETE_TYPES,
} from "../../containers/Calendar/CalendarContainer";
import DeleteBtn from "../common/Button/DeleteBtn";
import CheckboxForm from "../common/Checkbox/CheckboxForm";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../styles/FullCalendar.css";
import CalendarToolbar from "./CalendarToolbar";
import {
  CalendarDataType,
  CalendarPeriodType,
} from "../../types/calendar.type";
import styled from "@mui/system/styled";

const StyledMainLayout = styled(Box)(() => ({
  padding: "32px 32px 25px 32px",
  backgroundColor: "inherit",
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  "& .fc-header-toolbar": {
    display: "none !important",
  },
}));

const StyledContentContainer = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  border: theme.palette.borderColor,
  boxSizing: "border-box",
  padding: 20,
  overflow: "hidden",
}));

const StyledRoot = styled("div")({
  boxSizing: "border-box",
  margin: "auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: "0px",
  height: "100%",
});

const StyledMenu = styled(Popover)({
  "& .MuiPopover-paper": {
    backgroundColor: "#2A3341 !important",
  },
  color: "#FFFFFF",
});

const StyledPopoverContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "200px",
  height: "60px",
  borderRadius: 2,
  padding: 10,
  color: "#FFFFFF",
  backgroundColor: "#2A3341",
  zIndex: 99,
});

const StyledDeleteModalRoot = styled(Box)({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  justifyContent: "space-between",
  margin: "0px 20px 0px 20px",
});

const iconStyles = {
  fontSize: 16,
  color: "#8695B1",
  "&:hover": {
    cursor: "pointer",
    color: "#8695B1",
  },
  marginRight: 2,
};

const StyledDeleteIcon = styled(DeleteIcon)({
  ...iconStyles,
});

const StyledEventName = styled(Typography)({
  marginLeft: 5,
  fontSize: 12,
  fontWeight: 400,
});

const StyledComment = styled(Typography)({
  marginLeft: 15,
  fontSize: 10,
  fontWeight: 400,
});

const StyledDate = styled(Typography)(({ theme }: any) => ({
  opacity: 0.6,
  color: theme.palette.textColor,
  marginLeft: 15,
  marginTop: 2,
  marginBottom: 2,
  fontSize: 9,
  fontWeight: 400,
}));

const StyledCircleIcon = styled(CircleIcon)(
  ({ selectedEvent }: { selectedEvent: CalendarDataType }) => ({
    color:
      selectedEvent?.eventType === "EVENT"
        ? "#FF8D00"
        : selectedEvent?.eventType === "HOLIDAY"
        ? "#2962FF"
        : selectedEvent?.eventType === "DAY_OFF"
        ? "#006400"
        : "#DC143C",
    fontSize: 12,
  })
);

const StyledCalendarBox = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: "0px",
  height: "100%",
  overflow: "auto",
});

interface CalendarProps {
  events: CalendarDataType[];
  onSubmit: (data: CalendarDataType) => void;
  onCancel: (event: CalendarDataType) => void;
  onDelete: (id: string, eventDeleteType: string) => void;
  setSelectedPeriod: (period: CalendarPeriodType) => void;
  setSelectedEvent: (event: CalendarDataType) => void;
  selectedEvent: CalendarDataType;
}

const eventDidMount = (info: any) => {
  const eventEl = info.el;

  const dayCell = eventEl.closest(".fc-daygrid-day");
  const popoverBody = eventEl.closest(".fc-popover-body");

  if (dayCell) {
    const allEventsInDay = dayCell.querySelectorAll(".fc-daygrid-event");
    const localIndex = Array.from(allEventsInDay).indexOf(eventEl);

    eventEl.setAttribute("data-testid", `event-button-${localIndex}`);
  } else if (popoverBody) {
    const allEventsInPopover =
      popoverBody.querySelectorAll(".fc-daygrid-event");
    const localIndex = Array.from(allEventsInPopover).indexOf(eventEl);

    eventEl.setAttribute("data-testid", `popover-event-button-${localIndex}`);
  } else {
    eventEl.setAttribute("data-testid", "event-button");
  }
};

const Calendar: React.FC<CalendarProps> = ({
  events,
  onSubmit,
  onCancel,
  onDelete,
  setSelectedPeriod,
  selectedEvent,
  setSelectedEvent,
}) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const [deleteChecked, setDeleteChecked] = useState(
    CALENDAR_DELETE_CONSTANTS.DELETE
  );
  const calendarRef = useRef<FullCalendar>(null);
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const { getDateFormat } = useConfig();

  useEffect(() => {
    if (open) setSelectedEvent({});
  }, [open]);

  const handleEventClick = (arg: EventClickArg) => {
    setSelectedEvent(arg.event._def.extendedProps.eProps);
    popoverOpenHandler(arg.jsEvent);
  };

  const openMenu = Boolean(anchorEl);

  const popoverOpenHandler = (event: MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(() => event.target as Element);
  };
  const popoverCloseHandler = () => {
    setAnchorEl(null);
  };
  const onCancelClick = () => {
    onCancel(selectedEvent);
    setAnchorEl(null);
  };

  const onDeleteClick = () => {
    setOpenDelete(true);
    setAnchorEl(null);
  };

  const handleTypeChange = (val: string) => {
    setDeleteChecked(val);
  };

  const onDeleteSubmit = () => {
    if (selectedEvent?.id) {
      onDelete(selectedEvent.id, deleteChecked);
      setOpenDelete(false);
      setDeleteChecked(CALENDAR_DELETE_CONSTANTS.DELETE);
    }
  };

  return (
    <StyledMainLayout>
      <StyledContentContainer>
        <StyledRoot>
          <CalendarToolbar
            setSelectedPeriod={setSelectedPeriod}
            setOpen={setOpen}
            calendarRef={calendarRef}
          />
          <StyledCalendarBox>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              eventClick={handleEventClick}
              events={events}
              contentHeight={"auto"}
              datesSet={(e) => setSelectedPeriod({ from: e.start, to: e.end })}
              customButtons={{
                addBtn: {
                  text: t("addNew"),
                  click: () => setOpen(true),
                },
              }}
              headerToolbar={{
                left: "prevYear,prev title next,nextYear",
                center: "",
                right: hasPermission(PERMISSIONS.FINA_CALENDAR_AMEND)
                  ? "today addBtn"
                  : "today",
              }}
              dayMaxEventRows={2}
              themeSystem={"standard"}
              dayCellDidMount={(info) => {
                info.el.setAttribute(
                  "data-testid",
                  info.date.toLocaleDateString()
                );
              }}
              viewDidMount={() => {
                const rows = document.querySelectorAll(".fc-daygrid-body tr");

                rows.forEach((row, index) => {
                  row.setAttribute("data-testid", `tr-week-${index}`);
                });
              }}
              eventContent={(arg) => {
                return (
                  <div data-testid={`event-${arg.event.title}`}>
                    {arg.event.title}
                  </div>
                );
              }}
              eventDidMount={eventDidMount}
            />
          </StyledCalendarBox>
        </StyledRoot>
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={popoverCloseHandler}
        >
          <StyledMenu
            open={openMenu}
            anchorEl={anchorEl}
            onClose={popoverCloseHandler}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <StyledPopoverContent data-testid={"event-popover-content"}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                  <StyledCircleIcon
                    onClick={onCancelClick}
                    selectedEvent={selectedEvent}
                  />
                  <StyledEventName data-testid={"type"}>
                    {selectedEvent?.eventType && t(selectedEvent.eventType)}
                  </StyledEventName>
                </Box>

                <Box display={"flex"} alignItems={"center"}>
                  {hasPermission(PERMISSIONS.FINA_CALENDAR_DELETE) && (
                    <Tooltip title={t("delete")}>
                      <StyledDeleteIcon onClick={onDeleteClick} />
                    </Tooltip>
                  )}
                </Box>
              </Box>
              <StyledDate data-testid={"date"}>
                {getFormattedDateValue(
                  selectedEvent?.date,
                  getDateFormat(true)
                )}
              </StyledDate>
              <StyledComment data-testid={"comment"}>
                {selectedEvent?.comment}
              </StyledComment>
            </StyledPopoverContent>
          </StyledMenu>
        </ClickAwayListener>
        <CalendarEventCreate
          onSubmit={onSubmit}
          open={open}
          setOpen={setOpen}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
        <ClosableModal
          onClose={() => setOpenDelete(false)}
          open={openDelete}
          width={452}
          height={240}
          includeHeader={true}
          disableBackdropClick={true}
        >
          <StyledDeleteModalRoot>
            <Box flexGrow={1}>
              <CheckboxForm
                list={CALENDAR_DELETE_TYPES.map((e) => ({
                  name: t(e),
                  value: e,
                }))}
                handleChange={handleTypeChange}
                initValue={CALENDAR_DELETE_CONSTANTS.DELETE}
              />
            </Box>
            <Box alignSelf={"flex-end"} mb={"20px"}>
              <DeleteBtn onClick={onDeleteSubmit} data-testid={"delete-button"}>
                {t("delete")}
              </DeleteBtn>
            </Box>
          </StyledDeleteModalRoot>
        </ClosableModal>
      </StyledContentContainer>
    </StyledMainLayout>
  );
};

export default Calendar;
