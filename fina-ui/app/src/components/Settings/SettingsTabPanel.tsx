import React from "react";
import EmailContainer from "../../containers/Settings/EmailContainer";
import SecurityContainer from "../../containers/Settings/SecurityContainer";
import LanguagesContainer from "../../containers/Settings/LanguagesContainer";
import { Language, Property } from "../../types/settings.type";

/* eslint-disable react/prop-types */
interface SettingsTabPanelProps {
  activeList: string;
  data: Property[];
  onChange: (key: string, value: string) => void;
  onChangeSecurity: (key: string, value: string) => void;
  onSaveLanguage: (key: string, activeLang: Partial<Language>) => void;
  languages: Partial<Language>[];
  setLanguages: (languages: Partial<Language>[]) => void;
}

const SettingsTabPanel: React.FC<SettingsTabPanelProps> = React.memo(
  ({
    activeList,
    data,
    onChange,
    onChangeSecurity,
    onSaveLanguage,
    languages,
    setLanguages,
  }) => {
    const getComponent = () => {
      if (data.length > 0) {
        switch (activeList) {
          case "security":
            return (
              <SecurityContainer
                data={data}
                onChangeSecurity={onChangeSecurity}
              />
            );
          case "email":
            return <EmailContainer data={data} onChange={onChange} />;
          case "languages":
            return (
              <LanguagesContainer
                data={data}
                onSaveLanguage={onSaveLanguage}
                languages={languages}
                setLanguages={setLanguages}
              />
            );
          default:
            return <SecurityContainer data={data} />;
        }
      }
      return <></>;
    };
    return getComponent();
  }
);

export default SettingsTabPanel;
