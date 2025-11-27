import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { loadPaths } from "../../../../api/services/regionService";
import { useTranslation } from "react-i18next";
import { CountryDataTypes } from "../../../../types/common.type";

interface FiRegionSelectProps {
  selectedItem?: CountryDataTypes | null;
  onChange: (item: CountryDataTypes | null) => void;
  isError?: boolean;
  size?: string;
  countryData?: CountryDataTypes[];
  disabled?: boolean;
  onClear?: () => void;
  allowInvalidInputSelection?: boolean;
}

const FiRegionSelect: React.FC<FiRegionSelectProps> = ({
  selectedItem,
  onChange,
  isError,
  size,
  countryData,
  disabled,
  onClear,
  allowInvalidInputSelection,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [data, setData] = useState<CountryDataTypes[]>([]);

  useEffect(() => {
    if (!countryData && !disabled) {
      loadRegionsData();
    }
  }, [countryData, disabled]);

  useEffect(() => {
    if (countryData) setData([...countryData]);
  }, [countryData]);

  const loadRegionsData = () => {
    loadPaths()
      .then((resp) => {
        setData(resp.data);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  return (
    <CustomAutoComplete
      disabled={disabled}
      label={`${t("country")}/${t("branchFieldregion")}`}
      data={data}
      selectedItem={selectedItem}
      displayFieldName="name"
      valueFieldName="id"
      onChange={onChange}
      isError={isError}
      size={size}
      onClear={onClear}
      fieldName="region-select"
      allowInvalidInputSelection={allowInvalidInputSelection}
    />
  );
};

export default FiRegionSelect;
