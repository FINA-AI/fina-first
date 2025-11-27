import React, { useEffect, useState } from "react";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { useTranslation } from "react-i18next";
import { loadLegalFormTypes } from "../../../../api/services/fi/fiService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { LegalFormEntityInfo } from "../../../../types/fi.type";

interface LegalFormTypeAutoCompleteProps {
  selectedItem?: LegalFormEntityInfo | null;
  onChange: (item: LegalFormEntityInfo) => void;
  size?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  isError?: boolean;
  onClear?: () => void;
  allowInvalidInputSelection?: boolean;
}

const LegalFormTypeAutoComplete: React.FC<LegalFormTypeAutoCompleteProps> = ({
  selectedItem,
  onChange,
  size,
  hideLabel = false,
  disabled = false,
  isError,
  onClear,
  allowInvalidInputSelection,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [data, setData] = useState<LegalFormEntityInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data) {
      setData([
        ...data.map((item) => {
          if (item?.id === selectedItem?.id)
            selectedItem.description = item.code;
          return { ...item, description: t(item.code) };
        }),
      ]);
    }
  }, [t]);

  const loadData = () => {
    setLoading(true);
    loadLegalFormTypes()
      .then((resp) => {
        let types = resp.data.map((item: LegalFormEntityInfo) => {
          return { ...item, description: t(item.code) };
        });
        setData(types);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <CustomAutoComplete
      disabled={disabled}
      label={!hideLabel ? t("legalForm") : undefined}
      data={data}
      selectedItem={selectedItem}
      displayFieldName={"description"}
      valueFieldName={"id"}
      onChange={onChange}
      size={size}
      loading={loading}
      isError={isError}
      onClear={onClear}
      fieldName={"fi-legal-type"}
      allowInvalidInputSelection={allowInvalidInputSelection}
    />
  );
};

export default LegalFormTypeAutoComplete;
