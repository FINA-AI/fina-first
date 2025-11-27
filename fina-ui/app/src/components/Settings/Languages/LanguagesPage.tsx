import LanguagesCard from "./LanguagesCard";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { Language } from "../../../types/settings.type";
import React from "react";

interface LanguagesPageProps {
  languages: Partial<Language>[];
  onSaveLanguage: (key: string, activeLang: Partial<Language>) => void;
  onCancelFunc(card: Partial<Language>, cardIndex: number): void;
  addNewLanguageFunc(newLanguage: Partial<Language>, langIndex: number): void;
  onEditLanguage(lang: Partial<Language>): Promise<void>;
  onDeleteLanguage(id?: number, data?: Partial<Language>): Promise<void>;
  changeSelected(lang?: string): void;
}

const StyledLangDetailsContainer = styled(Box)({
  height: "100%",
  boxSizing: "border-box",
  display: "flex",
  padding: 15,
  minHeight: 0,
  flexDirection: "column",
  width: "100%",
  overflow: "auto",
});

const LanguagesPage: React.FC<LanguagesPageProps> = ({
  languages,
  changeSelected,
  onSaveLanguage,
  onDeleteLanguage,
  onEditLanguage,
  addNewLanguageFunc,
  onCancelFunc,
}) => {
  return (
    <StyledLangDetailsContainer>
      {languages.map((item, index) => {
        return (
          <LanguagesCard
            data={item}
            key={index}
            changeSelected={changeSelected}
            onSaveLanguage={onSaveLanguage}
            onDeleteLanguage={onDeleteLanguage}
            onEditLanguage={onEditLanguage}
            addNewLanguageFunc={addNewLanguageFunc}
            onCancelFunc={onCancelFunc}
            index={index}
          />
        );
      })}
    </StyledLangDetailsContainer>
  );
};

export default LanguagesPage;
