import { Grid } from "@mui/material";
import CatalogDataItem from "../Data/CatalogDataItem";
import { useTranslation } from "react-i18next";
import CheckboxBtn from "../../common/Checkbox/CheckboxBtn";
import { styled } from "@mui/material/styles";
import {
  CatalogForm,
  CatalogItemWithUIProps,
} from "../../../types/catalog.type";
import React from "react";

interface AddNewCatalogItemFormProps {
  isLeafChecked: boolean;
  handleIsLeafCheckboxChange: (event: any) => void;
  catalogModalForm: CatalogForm;
  catalogModalData: Partial<CatalogItemWithUIProps>;
  setChangedCatalogItems: (index: number, value: any) => void;
}

const StyledRoot = styled(Grid)(({ theme }: any) => ({
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  ...theme.ModalBody,
}));

const AddNewCatalogItemForm: React.FC<AddNewCatalogItemFormProps> = ({
  catalogModalForm,
  catalogModalData,
  isLeafChecked,
  handleIsLeafCheckboxChange,
  setChangedCatalogItems,
}) => {
  const { t } = useTranslation();
  const isEditMode = !!catalogModalData.rowId;

  return (
    <StyledRoot>
      {catalogModalForm.fields.map((item: any, index: number) => {
        switch (item.type) {
          case "field":
            let value =
              (catalogModalData?.rowItems &&
                catalogModalData.rowItems[index]?.value) ||
              "";
            return (
              <Grid key={"ITEM_" + index} pb={"12px"}>
                <CatalogDataItem
                  item={item}
                  index={index}
                  setChangedCatalogItems={setChangedCatalogItems}
                  isDisabled={isEditMode && item.key}
                  value={value}
                />
              </Grid>
            );
          case "checkbox":
            return (
              <Grid key={"ITEM_" + index}>
                <CheckboxBtn
                  onClick={(event) => handleIsLeafCheckboxChange(event)}
                  checked={isLeafChecked}
                  disabled={isEditMode}
                  label={t("leaf")}
                  data-testid={"leaf-checkbox"}
                />
              </Grid>
            );
        }
      })}
    </StyledRoot>
  );
};

export default AddNewCatalogItemForm;
