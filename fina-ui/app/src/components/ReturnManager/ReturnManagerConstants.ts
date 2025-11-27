import i18n from "../../locale/i18n";
import { ReturnStatus } from "../../types/returnManager.type";

export const returnManagerConstants = [
  {
    label: i18n.t(ReturnStatus.STATUS_SCHEDULED),
    value: ReturnStatus.STATUS_SCHEDULED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_SCHEDULED),
    value: ReturnStatus.STATUS_SCHEDULED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_AMENDED),
    value: ReturnStatus.STATUS_AMENDED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_IMPORTED),
    value: ReturnStatus.STATUS_IMPORTED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_PROCESSED),
    value: ReturnStatus.STATUS_PROCESSED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_VALIDATED),
    value: ReturnStatus.STATUS_VALIDATED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_RESETED),
    value: ReturnStatus.STATUS_RESETED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_ACCEPTED),
    value: ReturnStatus.STATUS_ACCEPTED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_REJECTED),
    value: ReturnStatus.STATUS_REJECTED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_ERRORS),
    value: ReturnStatus.STATUS_ERRORS,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_LOADED),
    value: ReturnStatus.STATUS_LOADED,
  },
  {
    label: i18n.t(ReturnStatus.STATUS_QUEUED),
    value: ReturnStatus.STATUS_QUEUED,
  },
];
