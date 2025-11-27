import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { loadDefault } from "../../../../api/services/fi/fiStructureService";
import { useTranslation } from "react-i18next";
import { FiGroupModelType } from "../../../../types/fi.type";

interface FiGroupSelectProps {
  selectedItem?: FiGroupModelType;
  onChange: (item: FiGroupModelType) => void;
  onClear: () => void;
  isError: boolean;
  height?: number;
  allowInvalidInputSelection: boolean;
}

const FiGroupSelect: React.FC<FiGroupSelectProps> = ({
  selectedItem,
  onChange,
  isError,
  onClear,
  allowInvalidInputSelection,
}) => {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiGroupsData();
  }, []);

  const loadFiGroupsData = async () => {
    setLoading(true);
    await loadDefault()
      .then((resp) => {
        setData(resp.data);
      })
      .catch(() => {
        enqueueSnackbar("Error Loading Fi Groups", { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <CustomAutoComplete
      fieldName={"fi-group-select"}
      disabled={false}
      label={t("defaultGroup")}
      data={data}
      displayFieldName={"code"}
      selectedItem={selectedItem}
      displayFieldFunction={(item: FiGroupModelType) => {
        if (item) {
          return `${item.code}/${item.name}`;
        }
        return "";
      }}
      valueFieldName={"id"}
      onChange={onChange}
      isError={isError}
      loading={loading}
      onClear={onClear}
      allowInvalidInputSelection={allowInvalidInputSelection}
    />
  );
};

export default FiGroupSelect;
