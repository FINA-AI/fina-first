import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TreeGrid from "../../../common/TreeGrid/TreeGrid";
import DeleteForm from "../../../common/Delete/DeleteForm";
import RegionalStructureCreateCountry from "./Create/RegionalStructureCreateCountry";
import ActionBtn from "../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { styled } from "@mui/material/styles";
import { CountryItemType } from "../../../../containers/FI/Configuration/RegionalStructure/RegionalStructureContainer";
import {
  TreeGridColumnType,
  TreeGridStateType,
  TreeState,
} from "../../../../types/common.type";

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.toolbar.padding,
  borderBottom: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  borderTopRightRadius: "2px",
}));

interface RegionalStructureTreeProps {
  saveCountryItemFunction: (
    data: CountryItemType,
    parent: CountryItemType
  ) => void;
  getChildren: (id: number) => void;
  countryItems: CountryItemType[];
  columns: TreeGridColumnType[];
  countryItemDeleteFunction: (items: CountryItemType[]) => void;
  maxLevel: number;
  regionProperties: { name: string }[];
  setSelectedCountryItems: (items: CountryItemType[]) => void;
  selectedCountryItems: CountryItemType[];
  defaultExpandedRowIds: number[];
  expandToPath: (item: any) => void;
  regionTree: CountryItemType[];
  filterOnClear: () => void;
  selectedCountry: CountryItemType;
  filterSelectedItem: {
    name: string;
  };
  treeState: TreeState;
  setTreeState: React.Dispatch<React.SetStateAction<TreeGridStateType>>;
}

const RegionalStructureTree: React.FC<RegionalStructureTreeProps> = ({
  treeState,
  setTreeState,
  saveCountryItemFunction,
  getChildren,
  countryItems,
  columns,
  countryItemDeleteFunction,
  maxLevel,
  regionProperties,
  setSelectedCountryItems,
  selectedCountryItems,
  defaultExpandedRowIds,
  expandToPath,
  regionTree,
  filterOnClear,
  selectedCountry,
  filterSelectedItem,
}) => {
  const { t } = useTranslation();
  const [isDeleteConfirmOpen, setDeleteFormConfirmOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addBtnDisable, setAddBtnDisable] = useState(true);
  const rowSelectHandler = (
    row: CountryItemType,
    rows: CountryItemType[],
    isKeyboardShortcutKeyClicked: boolean
  ) => {
    if (isKeyboardShortcutKeyClicked) {
      setSelectedCountryItems(rows);
      setAddBtnDisable(true);
    } else {
      setAddBtnDisable(!(row.level < maxLevel - 2));
      setSelectedCountryItems(rows);
    }
  };

  const rowDelete = (item: CountryItemType) => {
    setDeleteFormConfirmOpen(true);
    setSelectedCountryItems([item]);
  };

  const deleteFunction = () => {
    countryItemDeleteFunction(selectedCountryItems);
    setDeleteFormConfirmOpen(false);
  };

  const rowEdit = (item: CountryItemType) => {
    setEditModalOpen(true);
    setSelectedCountryItems([item]);
  };

  const getFieldLevelName = () => {
    if (editModalOpen) {
      return regionProperties[selectedCountryItems[0]?.level + 1]?.name;
    } else {
      return regionProperties[selectedCountryItems[0]?.level + 2].name;
    }
  };

  let actionButtons = (row: CountryItemType, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => rowEdit(row)}
          children={<EditIcon />}
          rowIndex={index}
          buttonName={"edit"}
        />

        <ActionBtn
          onClick={() => rowDelete(row)}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
          buttonName={"delete"}
        />
      </>
    );
  };

  const closeModal = () => {
    if (editModalOpen) setEditModalOpen(false);
    else setAddModalOpen(false);
  };

  return (
    <Box height={"100%"}>
      <StyledToolbar>
        <div style={{ flex: 0.5 }}>
          <CustomAutoComplete
            data={regionTree}
            disabled={!selectedCountry?.id}
            selectedItem={filterSelectedItem}
            label={`${t("country")}/${t("branchFieldregion")}`}
            valueFieldName={"id"}
            onChange={(value) => {
              if (value) {
                expandToPath(value);
              }
            }}
            displayFieldName={"name"}
            size={"default"}
            onClear={filterOnClear}
          />
        </div>

        <PrimaryBtn
          data-testid={"addNewBtn"}
          onClick={() => setAddModalOpen(true)}
          fontSize={12}
          disabled={addBtnDisable || selectedCountryItems.length !== 1}
          endIcon={<AddIcon />}
        >
          {t("addNew")}
        </PrimaryBtn>
      </StyledToolbar>
      <Box
        height={"100%"}
        style={{ backgroundColor: "#FFFFFF", borderBottomRightRadius: "2px" }}
      >
        <TreeGrid
          treeState={treeState}
          setTreeState={setTreeState}
          fetchFunction={getChildren}
          data={countryItems}
          columns={columns}
          rowSelectHandler={rowSelectHandler}
          idName={"id"}
          parentIdName={"parentId"}
          rootId={0}
          hideHeader={true}
          hideCheckBox={true}
          singleSelect={true}
          actionButtons={actionButtons}
          defaultExpandedRowsIds={defaultExpandedRowIds}
        />
      </Box>
      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("region")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setDeleteFormConfirmOpen}
          onDelete={() => deleteFunction()}
        />
      )}
      {(addModalOpen || editModalOpen) && (
        <RegionalStructureCreateCountry
          selectedItem={selectedCountryItems[0]}
          open={editModalOpen ? editModalOpen : addModalOpen}
          title={editModalOpen ? t("edit") : t("add")}
          onSaveClick={(data) => {
            saveCountryItemFunction(data, selectedCountryItems[0]);
          }}
          handClose={closeModal}
          editMode={editModalOpen}
          isCountryItem={true}
          getFieldLevelName={getFieldLevelName}
        />
      )}
    </Box>
  );
};

export default RegionalStructureTree;
