import React from "react";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation();

  return <h2>&nbsp;{t("pageNotFound")}</h2>;
};

export default PageNotFound;
