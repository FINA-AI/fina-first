import React, { useEffect, useState } from "react";
import { loadFiTypes } from "../../../../api/services/fi/fiService";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { FiType } from "../../../../types/fi.type";
import { FieldSize } from "../../../../types/common.type";

interface FiTypeSelectProps {
  selectedItem?: FiType;
  onChange: (item: any, items: any[]) => void;
  isError?: boolean;
  disabled?: boolean;
  enableSelectAll?: boolean;
  size?: FieldSize;
  onClear?: () => void;
  allowInvalidInputSelection?: boolean;
}

const FiTypeSelect: React.FC<FiTypeSelectProps> = ({
  selectedItem,
  onChange,
  isError = false,
  disabled,
  size = FieldSize.DEFAULT,
  onClear,
  enableSelectAll = false,
  allowInvalidInputSelection,
}: FiTypeSelectProps) => {
  const [data, setData] = useState<FiType[]>([]);
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiTypesData();
  }, []);

  const loadFiTypesData = async () => {
    setLoading(true);
    try {
      const resp = await loadFiTypes(false);
      setData(resp.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  const prependedData = enableSelectAll
    ? [{ id: 0, code: t("all"), name: t("all") }, ...data]
    : data;

  return (
    <CustomAutoComplete
      fieldName={"fi-type"}
      disabled={disabled}
      label={t("fiTypes")}
      data={prependedData}
      selectedItem={selectedItem}
      displayFieldName="code"
      displayFieldFunction={(item) => {
        return `${item.code} / ${item.name}`;
      }}
      valueFieldName="id"
      onChange={(item) => {
        onChange(item, data);
      }}
      isError={isError}
      size={size}
      loading={loading}
      onClear={() => {
        if (onClear) {
          onClear();
        }
      }}
      allowInvalidInputSelection={allowInvalidInputSelection}
    />
  );
};

export default FiTypeSelect;
