import { useContext } from "react";
import { ConfigContext } from "./ConfigProvider";
import { getDefaultDateFormat } from "../../util/appUtil";
import { Config } from "../../types/config.type";

const useConfig = () => {
  const configContext: Config = useContext(ConfigContext) as Config;

  const getDateFormat = (isOnlyDate: boolean) => {
    return configContext.dateFormat
      ? configContext.dateFormat + (isOnlyDate ? "" : " HH:mm")
      : getDefaultDateFormat() + (isOnlyDate ? "" : " HH:mm");
  };

  const hasPermission = (permission: string) => {
    return (
      configContext.permissions &&
      configContext.permissions.includes(permission)
    );
  };

  const countNewMessages = () => {
    return configContext.newMessages ? configContext.newMessages : 0;
  };

  return {
    getDateFormat,
    hasPermission,
    countNewMessages,
    config: configContext,
  };
};

export default useConfig;
