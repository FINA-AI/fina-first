import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import React from "react";
import { useTranslation } from "react-i18next";
import menuLink from "../../../api/ui/menuLink";
import { FITabs } from "../../FI/fiTabs";
import LinkButton from "./LinkButton";
interface LegalPersonLinkButtonProps {
  id: number;
}
const LegalPersonLinkButton: React.FC<LegalPersonLinkButtonProps> = ({
  id,
}) => {
  const { t } = useTranslation();
  return (
    <LinkButton
      title={t("personInformation")}
      icon={<WorkOutlineIcon />}
      url={`${menuLink.configuration}/${FITabs.LEGALPERSON}/${id}`}
    />
  );
};

export default LegalPersonLinkButton;
