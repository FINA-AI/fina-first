import React, { useEffect, useMemo, useState } from "react";
import TextField from "../common/Field/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "../common/Tooltip/Tooltip";
import UndoIcon from "@mui/icons-material/Undo";
import { useTranslation } from "react-i18next";
import { LanguageType } from "../../types/common.type";

interface LanguageColumnsProps {
  editMode: boolean;
  highlightBracesHandler: {
    (text: string): React.JSX.Element[] | string;
  };
  value: string;
  language: LanguageType;
  row: LanguageType;
  onChangeValue: (id: number, name: string, value: string) => boolean;
  undoFunc: (id: number, name: string, value: string) => boolean;
  setIsSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const LanguageColumns: React.FC<LanguageColumnsProps> = ({
  editMode,
  highlightBracesHandler,
  value,
  language,
  row,
  onChangeValue,
  undoFunc,
  setIsSaveDisabled,
}) => {
  const { t } = useTranslation();
  const [hasUndo, setHasUndo] = useState(false);
  const [originalValue, setOriginalValue] = useState(value);

  useEffect(() => {
    setOriginalValue(value);
    setHasUndo(false);
  }, [value, editMode]);

  const undoFunction = (rowId: number, languageName: string, value: string) => {
    setHasUndo(!undoFunc(rowId, languageName, value));
    setOriginalValue(value);
  };

  const undo = (rowId: number, languageName: string, value: string) => {
    return (
      <Tooltip title={t("Undo")}>
        <UndoIcon
          style={{
            cursor: "pointer",
            fontSize: "18px",
            color: "#2962FF",
          }}
          onClick={() => {
            undoFunction(rowId, languageName, value);
          }}
        />
      </Tooltip>
    );
  };

  const onChange = (rowId: number, languageCode: string, value: string) => {
    setOriginalValue(value);
    setHasUndo(!onChangeValue(rowId, languageCode, value));
    setIsSaveDisabled(false);
  };

  const memoizedTextField = useMemo(
    () => (
      <TextField
        size={"small"}
        width={200}
        value={originalValue}
        onChange={(value: string) => onChange(row.id, language.code, value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {hasUndo && undo(row.id, language.code, value)}
            </InputAdornment>
          ),
        }}
      />
    ),
    [originalValue, editMode]
  );

  return editMode ? (
    memoizedTextField
  ) : (
    <span>{highlightBracesHandler(value)}</span>
  );
};

export default LanguageColumns;
