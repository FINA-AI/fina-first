import i18n from "../../../locale/i18n";

export const EmsResultList = () => {
  return [
    {
      label: i18n.t("conclusion"),
      value: "CONCLUSION",
    },
    {
      label: i18n.t("termextension"),
      value: "TERM_EXTENSION",
    },
    {
      label: i18n.t("fine"),
      value: "FINED",
    },
    {
      label: i18n.t("lettersent"),
      value: "SENT_LETTER",
    },
    {
      label: i18n.t("meeting"),
      value: "MEETING",
    },
    {
      label: i18n.t("onsiteinspection"),
      value: "ONSITE_INSPECTION",
    },
    {
      label: i18n.t("needsrespond"),
      value: "NEEDS_RESPOND",
    },
    {
      label: i18n.t("pending"),
      value: "PENDING",
    },
    {
      label: i18n.t("other"),
      value: "OTHER",
    },
    {
      label: i18n.t("notaccepted"),
      value: "NOT_ACCEPTED",
    },
    {
      label: i18n.t("done"),
      value: "DONE",
    },
  ];
};
