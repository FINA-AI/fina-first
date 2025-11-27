import { Box } from "@mui/system";
import FIGroupPage from "../../../../components/FI/Configuration/FiStructure/FIGroupPage";
import { useEffect, useState } from "react";
import {
  deleteChild,
  deleteParent,
  load,
  loadChildren,
  makeDefaultCriterion,
  save,
} from "../../../../api/services/fi/fiStructureService";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { FiStructureDataType } from "../../../../types/fi.type";

const FIStructureConfigurationContainer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [selectedCriterion, setSelectedCriterion] =
    useState<FiStructureDataType>();
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState<FiStructureDataType[]>([]);
  const [addNewFormOpen, setAddNewFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [data, setData] = useState<FiStructureDataType[]>([]);
  const [isParentDelModalOpen, setIsParentDelModalOpen] = useState(false);
  const [listAddNewFormOpen, setListAddNewFormOpen] = useState(false);
  const [listEditMode, setListEditMode] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);

  useEffect(() => {
    loadGroupsByCriterion();
  }, [selectedCriterion]);

  useEffect(() => {
    loadCriterions();
  }, []);

  const loadCriterions = () => {
    setLoading(true);
    load()
      .then((resp) => {
        setData(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("Warning"), true, "warning");
      })
      .finally(() => setLoading(false));
  };

  const makeDefault = (criterion: FiStructureDataType) => {
    makeDefaultCriterion(criterion.id)
      .then(() => {
        setAddNewFormOpen(false);
        loadCriterions();
      })
      .catch((err) => {
        openErrorWindow(err, t("Warning"), true, "warning");
      });
  };

  const deleteFiParentFunction = () => {
    if (!selectedCriterion) return;
    deleteParent(selectedCriterion.id)
      .then(() => {
        let tmp = [...data];
        tmp = tmp.filter((licenses) => licenses.id !== selectedCriterion.id);
        setData(tmp);
        setIsParentDelModalOpen(false);
        setGroupData([]);
      })
      .catch((err) => {
        setIsParentDelModalOpen(false);
        openErrorWindow(err, t("Warning"), true);
      });
  };

  const loadGroupsByCriterion = () => {
    if (selectedCriterion) {
      setGroupLoading(true);
      loadChildren(selectedCriterion.id)
        .then((resp) => {
          setGroupData(resp.data);
          setGroupLoading(false);
        })
        .catch((err) => {
          openErrorWindow(err, t("Warning"), true, "warning");
        })
        .finally(() => setGroupLoading(false));
    }
  };

  const onSaveGroup = (group: FiStructureDataType) => {
    group.type = "CHILD";
    group.parentId = selectedCriterion?.id ?? 0;

    save(group)
      .then((res) => {
        if (!group.id) {
          setGroupData([...groupData, res.data]);
        } else {
          const updated = groupData.map((item) =>
            item.id === res.data.id ? res.data : item
          );
          setGroupData(updated);
        }
        setAddNewFormOpen(false);
      })
      .catch((err) => {
        enqueueSnackbar(err.response?.data?.code ?? "Error", {
          variant: "error",
        });
      });
  };

  const deleteFiFunction = (selectedItem: FiStructureDataType) => {
    deleteChild(selectedItem.id)
      .then(() => {
        const updated = groupData.filter((item) => item.id !== selectedItem.id);
        setGroupData(updated);
        setIsDeleteConfirmOpen(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onSaveCriterion = (criterion: FiStructureDataType) => {
    criterion.type = "PARENT";

    save(criterion)
      .then((resp) => {
        if (criterion.id && criterion.id > 0) {
          setData(
            data.map((item) => (item.id === resp.data.id ? resp.data : item))
          );
        } else {
          setData([...data, resp.data]);
        }
        setAddNewFormOpen(false);
        setListEditMode(false);
        setSelectedCriterion(resp.data);
        setListAddNewFormOpen(false);
      })
      .catch((err) => {
        if (err.response?.data?.code === "GENERAL_ERROR") {
          openErrorWindow(err, t("Warning"));
          setAddNewFormOpen(false);
          const tmp = [...data];
          const criterionFound = tmp.find((el) => el.id === criterion.id);
          if (criterionFound) {
            criterionFound.code = criterion.code;
            criterionFound.name = criterion.name;
            setData(tmp);
          }
          setSelectedCriterion(criterionFound);
        } else {
          openErrorWindow(err, t("error"), true);
        }
      });
  };

  return (
    <Box height={"100%"}>
      <FIGroupPage
        loading={loading}
        groupData={groupData}
        selectedCriterion={selectedCriterion}
        setSelectedCriterion={setSelectedCriterion}
        onSaveGroup={onSaveGroup}
        deleteFiFunction={deleteFiFunction}
        addNewFormOpen={addNewFormOpen}
        setAddNewFormOpen={setAddNewFormOpen}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        onSaveCriterion={onSaveCriterion}
        makeDefault={makeDefault}
        deleteFiParentFunction={deleteFiParentFunction}
        data={data}
        isParentDelModalOpen={isParentDelModalOpen}
        setIsParentDelModalOpen={setIsParentDelModalOpen}
        listAddNewFormOpen={listAddNewFormOpen}
        setListAddNewFormOpen={setListAddNewFormOpen}
        listEditMode={listEditMode}
        setListEditMode={setListEditMode}
        groupLoading={groupLoading}
      />
    </Box>
  );
};

export default FIStructureConfigurationContainer;
