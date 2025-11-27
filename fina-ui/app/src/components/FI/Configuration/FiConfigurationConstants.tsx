import i18n from "../../../locale/i18n";
import { ResidentStatusOptionEnum } from "../../../types/fi.type";

export type ResidentStatusOption = {
  label: string;
  value: ResidentStatusOptionEnum;
};

export const physicalPersonResidentStatus = (): ResidentStatusOption[] => {
  return [
    {
      label: i18n.t("PHYSICAL_PERSONS_RESIDENT"),
      value: ResidentStatusOptionEnum.PHYSICAL_PERSONS_RESIDENT,
    },
    {
      label: i18n.t("PHYSICAL_PERSONS_NO_RESIDENT"),
      value: ResidentStatusOptionEnum.PHYSICAL_PERSONS_NO_RESIDENT,
    },
    {
      label: i18n.t("SOLE_PROPRIETOR_RESIDENT"),
      value: ResidentStatusOptionEnum.SOLE_PROPRIETOR_RESIDENT,
    },
    {
      label: i18n.t("SOLE_PROPRIETOR_NO_RESIDENT"),
      value: ResidentStatusOptionEnum.SOLE_PROPRIETOR_NO_RESIDENT,
    },
  ];
};

export const legalPersonResidentStatus = (): ResidentStatusOption[] => {
  return [
    {
      label: i18n.t("LEGAL_ENTITY_RESIDENT"),
      value: ResidentStatusOptionEnum.LEGAL_ENTITY_RESIDENT,
    },
    {
      label: i18n.t("LEGAL_ENTITY_NO_RESIDENT"),
      value: ResidentStatusOptionEnum.LEGAL_ENTITY_NO_RESIDENT,
    },
  ];
};
