import { useTranslation } from "react-i18next";
import AddNewCatalogItemForm from "./AddNewCatalogItemForm";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import ClosableModal from "../../common/Modal/ClosableModal";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CatalogForm,
  CatalogItemWithUIProps,
} from "../../../types/catalog.type";

interface AddNewCatalogItemModalProps {
  open: boolean;
  handClose: VoidFunction;
  saveCatalogItem: (data: CatalogItemWithUIProps) => Promise<void>;
  catalogModalForm: CatalogForm;
  catalogModalData: Partial<CatalogItemWithUIProps>;
  currCatalogItem: CatalogItemWithUIProps | null;
  isEdit?: boolean;
}

const StyledItemsContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  height: "100%",
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  padding: 10,
  justifyContent: "flex-end",
  ...theme.modalFooter,
}));

const AddNewCatalogItemModal: React.FC<AddNewCatalogItemModalProps> = ({
  open,
  handClose,
  saveCatalogItem,
  catalogModalData,
  catalogModalForm,
  currCatalogItem,
  isEdit = false,
}) => {
  const { t } = useTranslation();
  const [isLeafChecked, setLeafChecked] = useState<boolean>(false);
  const [isActiveSaveBtn, setIsActiveSaveBtn] = useState(false);
  const [tmpCatalogData, setTmpCatalogData] = useState<CatalogItemWithUIProps>(
    {} as CatalogItemWithUIProps
  );

  useEffect(() => {
    setTmpCatalogData(JSON.parse(JSON.stringify(catalogModalData)));
    setLeafChecked(catalogModalData?.leaf ?? false);
  }, [catalogModalData]);

  const addNewCatalogItem = () => {
    saveCatalogItem(tmpCatalogData);
    handClose();
  };

  const validateFields = () => {
    let isOk = true;
    if (tmpCatalogData.rowItems) {
      for (let item of tmpCatalogData.rowItems) {
        if (
          (item?.column?.isRequired || item?.column?.key) &&
          (!item.value || String(item.value).trim() === "")
        ) {
          isOk = false;
          break;
        }
      }
    }
    setIsActiveSaveBtn(isOk);
  };

  useEffect(() => {
    validateFields();
  }, [tmpCatalogData]);

  const setChangedCatalogItems = (index: number, value: string) => {
    let newCatalog: CatalogItemWithUIProps = {
      ...tmpCatalogData,
      parentRowId: currCatalogItem ? currCatalogItem.parentRowId : 0,
      level: currCatalogItem ? currCatalogItem.level + 1 : 0,
    };
    newCatalog.rowItems[index].value = value;
    setTmpCatalogData(newCatalog);
  };

  const handleIsLeafCheckboxChange = () => {
    setLeafChecked(!isLeafChecked);
    setTmpCatalogData({ ...tmpCatalogData, leaf: !isLeafChecked });
  };

  return (
    <>
      <ClosableModal
        onClose={handClose}
        open={open}
        width={852}
        height={400}
        includeHeader={true}
        padding={0}
        title={isEdit ? t("edit") : t("addNewItem")}
      >
        <StyledItemsContainer>
          <AddNewCatalogItemForm
            catalogModalForm={catalogModalForm}
            catalogModalData={tmpCatalogData}
            isLeafChecked={isLeafChecked}
            handleIsLeafCheckboxChange={handleIsLeafCheckboxChange}
            setChangedCatalogItems={setChangedCatalogItems}
          />
          <StyledFooter>
            <Box>
              <GhostBtn
                onClick={() => handClose()}
                data-testid={"cancel-button"}
              >
                {t("cancel")}
              </GhostBtn>
              <PrimaryBtn
                disabled={!isActiveSaveBtn}
                style={{ marginLeft: 5 }}
                onClick={addNewCatalogItem}
                data-testid={"save-button"}
              >
                {t("save")}
              </PrimaryBtn>
            </Box>
          </StyledFooter>
        </StyledItemsContainer>
      </ClosableModal>
    </>
  );
};

export default AddNewCatalogItemModal;
