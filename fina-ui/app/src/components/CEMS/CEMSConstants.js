import i18n from "../../locale/i18n";
export const CEMSStatusList = () => {
  return [
    {
      label: i18n.t("IN_PROGRESS"),
      value: "IN_PROGRESS",
    },
    {
      label: i18n.t("HALF_REALIZED"),
      value: "HALF_REALIZED",
    },
    {
      label: i18n.t("COMPLETED_OUT_OF_DATE"),
      value: "COMPLETED_OUT_OF_DATE",
    },
    {
      label: i18n.t("COMPLETED"),
      value: "COMPLETED",
    },
    {
      label: i18n.t("NOT_COMPLETED"),
      value: "NOT_COMPLETED",
    },
    {
      label: i18n.t("DISMISSED_BY_CHAIRMAN"),
      value: "DISMISSED_BY_CHAIRMAN",
    },
    {
      label: i18n.t("DISMISSED_BY_BOARD"),
      value: "DISMISSED_BY_BOARD",
    },
    {
      label: i18n.t("DISMISSED_BY_COMMITTEE"),
      value: "DISMISSED_BY_COMMITTEE",
    },
    {
      label: i18n.t("COURT_CASE"),
      value: "COURT_CASE",
    },
    {
      label: i18n.t("POSTPONED"),
      value: "POSTPONED",
    },
  ];
};
