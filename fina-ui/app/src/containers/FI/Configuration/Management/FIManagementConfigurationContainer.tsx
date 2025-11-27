import { memo, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import {
  deleteManagementType,
  loadManagementTypes,
} from "../../../../api/services/fi/fiManagementTypeService";
import FIManagementConfigurationPage from "../../../../components/FI/Configuration/Management/FIManagementConfigurationPage";
import {
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../../../api/ui/localStorageHelper";
import { FI_MANAGEMENT_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import { BranchTypes } from "../../../../types/fi.type";

const FIManagementConfigurationContainer = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [managementTypes, setManagementTypes] = useState<BranchTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = () => {
    setLoading(true);
    loadManagementTypes()
      .then((result) => {
        let types = result.data.sort((x: BranchTypes, y: BranchTypes) => {
          if (x.id && y.id) {
            return x.id - y.id;
          }
        });
        setManagementTypes(types);
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const addNewType = (data: BranchTypes, type: "add" | "edit") => {
    if (type === "add") {
      setManagementTypes([...managementTypes, data]);
    } else if (type === "edit") {
      const temp = managementTypes.map((item) => {
        if (item.id === data.id) {
          return data;
        }
        return item;
      });
      setManagementTypes(temp);
    }
  };

  const deleteType = (managementTypeId: number) => {
    deleteManagementType(managementTypeId)
      .then(() => {
        let tmp = [...managementTypes];
        tmp = tmp.filter((bt) => bt.id !== managementTypeId);
        setManagementTypes(tmp);
        let state = getStateFromLocalStorage();
        let fiManagementState =
          state[`${FI_MANAGEMENT_TABLE_KEY}${managementTypeId}`];
        if (
          state &&
          fiManagementState?.columns &&
          fiManagementState?.columns.length !== 0
        ) {
          const updatedColumns = { ...state };
          delete updatedColumns[
            `${FI_MANAGEMENT_TABLE_KEY}${managementTypeId}`
          ];
          setStateToLocalStorage(
            "fiManagementTableCustomization",
            updatedColumns
          );
        }
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    <FIManagementConfigurationPage
      managementTypes={managementTypes}
      afterSubmitSuccess={addNewType}
      onDelete={deleteType}
      loading={loading}
    />
  );
};

export default memo(FIManagementConfigurationContainer);
