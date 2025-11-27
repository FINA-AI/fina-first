import React, { useEffect, useState } from "react";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { useTranslation } from "react-i18next";
import { loadManagementFormTypes } from "../../../../api/services/fi/fiService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { LegalFormEntityInfo } from "../../../../types/fi.type";

interface ManagementFormTypeAutoCompleteProps {
  selectedItem?: LegalFormEntityInfo | null;
  onChange: (item: LegalFormEntityInfo) => void;
  size?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  isError?: boolean;
  onClear?: () => void;
  allowInvalidInputSelection?: boolean;
}

const ManagementFormTypeAutoComplete: React.FC<
  ManagementFormTypeAutoCompleteProps
> = ({
  selectedItem,
  onChange,
  size,
  hideLabel,
  disabled,
  isError,
  onClear,
  allowInvalidInputSelection,
}) => {
  const [data, setData] = useState<LegalFormEntityInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    setLoading(true);
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

  const loadData = async () => {
    await loadManagementFormTypes()
      .then((resp) => {
        let types = resp.data.map((item: LegalFormEntityInfo) => {
          return { ...item, description: t(item.code) };
        });
        setData(types);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
    setLoading(false);
  };

  return (
    <CustomAutoComplete
      disabled={disabled}
      label={!hideLabel ? t("managementForm") : undefined}
      data={data}
      selectedItem={selectedItem}
      displayFieldName={"description"}
      valueFieldName={"id"}
      onChange={onChange}
      size={size}
      loading={loading}
      isError={isError}
      onClear={onClear}
      fieldName={"fi-management-form"}
      allowInvalidInputSelection={allowInvalidInputSelection}
    />
  );
};

export default ManagementFormTypeAutoComplete;
