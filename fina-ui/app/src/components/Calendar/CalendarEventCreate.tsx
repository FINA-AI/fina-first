import React, { Fragment, useEffect, useState } from "react";
import ClosableModal from "../common/Modal/ClosableModal";
import Wizard from "../Wizard/Wizard";
import { Box } from "@mui/material";
import {
  CALENDAR_EVENT_TYPES,
  CALENDAR_MONTH_CONSTANTS,
  CALENDAR_MONTHS,
  CALENDAR_PERIOD_CONSTRAINTS,
  CALENDAR_PERIOD_TYPES,
  CALENDAR_WEEK_DAYS,
} from "../../containers/Calendar/CalendarContainer";
import { useTranslation } from "react-i18next";
import DatePicker from "../common/Field/DatePicker";
import Select from "../common/Field/Select";
import NumberField from "../common/Field/NumberField";
import TextField from "../common/Field/TextField";
import CheckboxForm from "../common/Checkbox/CheckboxForm";
import { CalendarDataType } from "../../types/calendar.type";
import styled from "@mui/system/styled";

const StyledField = styled(Box)(() => ({
  marginBottom: "10px",
  padding: "0px 20px",
}));

const StyledWizardWrapper = styled(Box)(() => ({
  height: "100%",
}));

const StyledPage = styled(Box)(() => ({
  paddingTop: "10px",
  overflowX: "hidden",
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));

interface CalendarEventCreateProps {
  onSubmit: (data: CalendarDataType) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent: (event: CalendarDataType) => void;
  selectedEvent: CalendarDataType;
}

const CalendarEventCreate: React.FC<CalendarEventCreateProps> = ({
  onSubmit,
  open,
  setOpen,
  selectedEvent,
  setSelectedEvent,
}) => {
  const [checked, setChecked] = useState(CALENDAR_PERIOD_CONSTRAINTS.FIXED);
  const [model, setModel] = useState<CalendarDataType>({} as CalendarDataType);
  const [pattern, setPattern] = useState(/^(^$|[1-9]|[12][0-9]|3[01])$/);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(!open);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedEvent) {
      setModel({
        ...selectedEvent,
        calendarPeriodType: CALENDAR_PERIOD_CONSTRAINTS.FIXED,
      });
    }
  }, [selectedEvent]);

  useEffect(() => {
    let isValid = false;
    switch (checked) {
      case CALENDAR_PERIOD_CONSTRAINTS.FIXED:
        isValid = Boolean(model.eventType && model.date);
        break;
      case CALENDAR_PERIOD_CONSTRAINTS.WEEKLY:
        isValid = Boolean(
          model.eventType && model.calendarWeekDay && model.from && model.to
        );
        break;
      case CALENDAR_PERIOD_CONSTRAINTS.MONTHLY:
        isValid = Boolean(
          model.eventType && model.day && model.from && model.to
        );
        break;
      case CALENDAR_PERIOD_CONSTRAINTS.ANNUAL:
        isValid = Boolean(
          model.eventType && model.month && model.day && model.from && model.to
        );
        break;
    }
    setIsSubmitDisabled(!isValid);
  }, [model]);

  useEffect(() => {
    setModel({ ...model, calendarPeriodType: checked });
  }, [checked]);

  const handleTypeChange = (val: string) => {
    setChecked(val);
  };

  const annualMonthChange = (month: string) => {
    switch (month) {
      case CALENDAR_MONTH_CONSTANTS.JANUARY:
      case CALENDAR_MONTH_CONSTANTS.MARCH:
      case CALENDAR_MONTH_CONSTANTS.MAY:
      case CALENDAR_MONTH_CONSTANTS.JULY:
      case CALENDAR_MONTH_CONSTANTS.AUGUST:
      case CALENDAR_MONTH_CONSTANTS.OCTOBER:
      case CALENDAR_MONTH_CONSTANTS.DECEMBER:
        setPattern(/^(^$|[1-9]|[12][0-9]|3[01])$/);
        break;
      case CALENDAR_MONTH_CONSTANTS.FEBRUARY:
        setPattern(/^(^$|[1-9]|[12][0-8])$/);
        break;
      default:
        setPattern(/^(^$|[1-9]|[12][0-9]|30)$/);
        break;
    }
    setModel({ ...model, month, day: "" });
  };

  const getSecondPage = () => {
    switch (checked) {
      case CALENDAR_PERIOD_CONSTRAINTS.FIXED:
        return (
          <StyledField>
            <DatePicker
              label={t("date")}
              onChange={(date) => setModel({ ...model, date: date?.getTime() })}
              value={model.date}
              data-testid={"date"}
            />
          </StyledField>
        );
      case CALENDAR_PERIOD_CONSTRAINTS.WEEKLY:
        return (
          <StyledField>
            <Select
              label={t("day")}
              onChange={(calendarWeekDay) =>
                setModel({ ...model, calendarWeekDay })
              }
              data={CALENDAR_WEEK_DAYS.map((e) => ({ label: e, value: e }))}
              value={model.calendarWeekDay}
              data-testid={"day-input"}
            />
          </StyledField>
        );
      case CALENDAR_PERIOD_CONSTRAINTS.MONTHLY:
        return (
          <StyledField>
            <NumberField
              label={t("day")}
              onChange={(day) => setModel({ ...model, day })}
              pattern={/^(^$|[1-9]|[12][0-9]|3[01])$/}
              value={model.day as number}
              fieldName={"day-input"}
            />
          </StyledField>
        );
      case CALENDAR_PERIOD_CONSTRAINTS.ANNUAL:
        return (
          <div>
            <StyledField>
              <Select
                label={t("month")}
                onChange={annualMonthChange}
                data={CALENDAR_MONTHS.map((e) => ({ label: e, value: e }))}
                value={model.month}
                data-testid={"month-input"}
              />
            </StyledField>
            <StyledField>
              <NumberField
                label={t("day")}
                value={model.day as number}
                onChange={(day) => setModel({ ...model, day })}
                pattern={pattern}
                data-testid={"day-input"}
              />
            </StyledField>
          </div>
        );
    }
  };

  const getAdditionalFields = () => {
    if (checked !== CALENDAR_PERIOD_CONSTRAINTS.FIXED) {
      return (
        <div>
          <StyledField>
            <DatePicker
              label={t("from")}
              onChange={(date) => setModel({ ...model, from: date?.getTime() })}
              data-testid={"from"}
            />
          </StyledField>
          <StyledField>
            <DatePicker
              label={t("to")}
              onChange={(date) => setModel({ ...model, to: date?.getTime() })}
              data-testid={"to"}
            />
          </StyledField>
        </div>
      );
    }
  };

  const close = () => {
    setOpen(false);
    setSelectedEvent({ calendarPeriodType: CALENDAR_PERIOD_CONSTRAINTS.FIXED });
    setChecked(CALENDAR_PERIOD_CONSTRAINTS.FIXED);
    setModel({ calendarPeriodType: CALENDAR_PERIOD_CONSTRAINTS.FIXED });
  };

  return (
    <Fragment>
      <ClosableModal
        onClose={() => close()}
        open={open}
        width={452}
        height={378}
        includeHeader={true}
        disableBackdropClick={true}
      >
        <StyledWizardWrapper>
          <Wizard
            steps={["1", "2"]}
            hideStepper={true}
            hideHeader={true}
            onCancel={() => close()}
            onSubmit={() => {
              onSubmit(model);
              close();
            }}
            onBack={() => setModel({ calendarPeriodType: checked })}
            isSubmitDisabled={isSubmitDisabled}
          >
            <StyledPage>
              <CheckboxForm
                handleChange={handleTypeChange}
                list={CALENDAR_PERIOD_TYPES.map((e) => ({
                  name: t(e),
                  value: e,
                }))}
                initValue={checked}
              />
            </StyledPage>
            <StyledPage>
              <StyledField>
                <Select
                  label={t("type")}
                  onChange={(eventType) => setModel({ ...model, eventType })}
                  data={CALENDAR_EVENT_TYPES.map((e) => ({
                    label: t(e),
                    value: e,
                  }))}
                  value={model.eventType}
                  data-testid={"type-input"}
                />
              </StyledField>
              {getSecondPage()}
              <StyledField>
                <TextField
                  label={t("comment")}
                  onChange={(comment: string) =>
                    setModel({ ...model, comment })
                  }
                  value={model.comment}
                  fieldName={"comment"}
                />
              </StyledField>
              {getAdditionalFields()}
            </StyledPage>
          </Wizard>
        </StyledWizardWrapper>
      </ClosableModal>
    </Fragment>
  );
};

export default CalendarEventCreate;
