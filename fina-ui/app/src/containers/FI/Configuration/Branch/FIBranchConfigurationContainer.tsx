import {
  deleteBranchType,
  loadBranchTypes,
} from "../../../../api/services/fi/fiBranchTypeService";
import React, { memo, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import FIBranchConfigurationPage from "../../../../components/FI/Configuration/Branch/FIBranchConfigurationPage";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { FI_BRANCH_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import {
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../../../api/ui/localStorageHelper";
import { BranchTypes } from "../../../../types/fi.type";

const FIBranchConfigurationContainer: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [branchTypes, setBranchTypes] = useState<BranchTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { openErrorWindow } = useErrorWindow();

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = () => {
    setLoading(true);
    loadBranchTypes()
      .then((result) => {
        const types = result.data.sort((x: BranchTypes, y: BranchTypes) => {
          return x.id! - y.id!;
        });
        setBranchTypes(types);
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const addNewType = (data: BranchTypes, type: "add" | "edit") => {
    if (type === "add") {
      setBranchTypes([...branchTypes, data]);
    } else if (type === "edit") {
      const temp = branchTypes.map((item) => {
        if (item.id === data.id) {
          return data;
        }
        return item;
      });
      setBranchTypes(temp);
    }
  };

  const deleteType = (branchTypeId: number) => {
    deleteBranchType(branchTypeId)
      .then(() => {
        let tmp = [...branchTypes];
        tmp = tmp.filter((bt) => bt.id !== branchTypeId);
        setBranchTypes(tmp);
        let state = getStateFromLocalStorage();
        let fiBranchState = state[`${FI_BRANCH_TABLE_KEY}${branchTypeId}`];
        if (
          state &&
          fiBranchState?.columns &&
          fiBranchState?.columns.length !== 0
        ) {
          const updatedColumns = { ...state };
          delete updatedColumns[`${FI_BRANCH_TABLE_KEY}${branchTypeId}`];
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
    <FIBranchConfigurationPage
      branchTypes={branchTypes}
      afterSubmitSuccess={addNewType}
      onDelete={deleteType}
      loading={loading}
    />
  );
};

export default memo(FIBranchConfigurationContainer);
