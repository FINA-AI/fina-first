import { Box } from "@mui/system";
import FIMainStructure from "../../../../components/FI/Main/Detail/FISturcture/FIMainStructure";
import {
  getCheckedValues,
  loadChildren,
  setCheckedValues,
} from "../../../../api/services/fi/fiStructureService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";
import { FiStructureDataType } from "../../../../types/fi.type";
import { CancelIcon } from "../../../../api/ui/icons/CancelIcon";

interface FIStructureContainer {
  fiId: number;
}

const FIStructureContainer: React.FC<FIStructureContainer> = ({ fiId }) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [checkedItemsData, setCheckedItemsData] = useState<
    FiStructureDataType[]
  >([]);
  const [originalCheckedItems, setOriginalCheckedItems] = useState<
    FiStructureDataType[]
  >([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState<FiStructureDataType[]>([]);
  const [selectedItem, setSelectedItem] = useState<FiStructureDataType>();
  const [groupLoading, setGroupLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadGroupsByCriterion();
  }, [selectedItem]);

  useEffect(() => {
    getCheckedItems();
  }, [fiId]);

  const handleCancel = () => {
    setCheckedItemsData(originalCheckedItems);
    setIsCancelModalOpen(false);
    setEditMode(false);
  };

  const getCheckedItems = async () => {
    setLoading(true);
    try {
      let res = await getCheckedValues(fiId);
      setCheckedItemsData(res.data);
      setOriginalCheckedItems(res.data);
      setLoading(false);
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  const loadGroupsByCriterion = () => {
    if (selectedItem) {
      setGroupLoading(true);
      loadChildren(selectedItem.id)
        .then((resp) => {
          setGroupData(resp.data);
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        })
        .finally(() => setGroupLoading(false));
    }
  };

  const setCheckedItems = async () => {
    try {
      await setCheckedValues(fiId, checkedItemsData);
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  return (
    <Box height={"100%"}>
      <FIMainStructure
        setCheckedItems={setCheckedItems}
        checkedItemsData={checkedItemsData}
        setCheckedItemsData={setCheckedItemsData}
        setIsCancelModalOpen={setIsCancelModalOpen}
        loading={loading}
        groupData={groupData}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        groupLoading={groupLoading}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <ConfirmModal
        isOpen={isCancelModalOpen}
        setIsOpen={setIsCancelModalOpen}
        onConfirm={handleCancel}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        additionalBodyText={t("changes")}
        bodyText={t("cancelBodyText")}
        icon={<CancelIcon />}
      />
    </Box>
  );
};

export default FIStructureContainer;
