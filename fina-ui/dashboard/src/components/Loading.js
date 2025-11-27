import React from "react";

import { Panel } from "@sencha/ext-react-modern";
import { useTranslation } from "react-i18next";

const Loading = () => {
  const { t } = useTranslation();

  const styles = {
    display: "inline-block",
    marginLeft: "40%",
    marginTop: "10%",
    fontSize: "2em",
  };

  return (
    <Panel>
      <div style={styles}>{t("pleaseWait")}</div>
    </Panel>
  );
};

export default Loading;
