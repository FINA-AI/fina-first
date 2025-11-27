import React, { useEffect, useState } from "react";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { useTranslation } from "react-i18next";
import { loadEconomicEntityTypes } from "../../../../api/services/fi/fiService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { LegalFormEntityInfo } from "../../../../types/fi.type";

interface EconomicEntityTypeAutoCompleteProps {
  selectedItem?: LegalFormEntityInfo | null;
  onChange: (item: LegalFormEntityInfo) => void;
  size?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  isError?: boolean;
  data?: LegalFormEntityInfo[];
  onClear?: () => void;
  allowInvalidInputSelection?: boolean;
}

const EconomicEntityTypeAutoComplete: React.FC<
  EconomicEntityTypeAutoCompleteProps
> = ({
  selectedItem,
  onChange,
  size,
  hideLabel,
  disabled,
  isError,
  data,
  onClear,
  allowInvalidInputSelection,
}) => {
  const [economicEntities, setEconomicEntities] = useState<
    LegalFormEntityInfo[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    if (data && data.length) {
      setEconomicEntities(data);
    } else {
      setLoading(true);
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (economicEntities) {
      setEconomicEntities([
        ...economicEntities.map((item) => {
          if (item?.id === selectedItem?.id)
            selectedItem.description = item.code;
          return { ...item, description: t(item.code) };
        }),
      ]);
    }
  }, [t]);

  const loadData = async () => {
    await loadEconomicEntityTypes()
      .then((resp) => {
        let types = resp.data.map((item: LegalFormEntityInfo) => {
          return { ...item, description: t(item.code) };
        });
        setEconomicEntities(types);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
    setLoading(false);
  };

  return (
    <CustomAutoComplete
      disabled={disabled}
      label={!hideLabel ? t("legalEntityStatus") : undefined}
      data={economicEntities}
      selectedItem={selectedItem}
      displayFieldName="description"
      valueFieldName="id"
      onChange={onChange}
      size={size}
      loading={loading}
      isError={isError}
      onClear={onClear}
      fieldName="fi-economic-entity"
      allowInvalidInputSelection={allowInvalidInputSelection}
    />
  );
};

export default EconomicEntityTypeAutoComplete;
