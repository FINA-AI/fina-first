import { useTranslation } from "react-i18next";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import menuLink from "../../../api/ui/menuLink";
import { FITabs } from "../../FI/fiTabs";
import React from "react";
import LinkButton from "./LinkButton";

interface PhysicalPersonLinkButtonProps {
  id: number;
}

const PhysicalPersonLinkButton: React.FC<PhysicalPersonLinkButtonProps> = ({
  id,
}) => {
  const { t } = useTranslation();
  return (
    <LinkButton
      title={t("personInformation")}
      icon={<PermIdentityIcon />}
      url={`${menuLink.configuration}/${FITabs.PHYSYCALPERSON}/${id}`}
    />
  );
};

export default PhysicalPersonLinkButton;
