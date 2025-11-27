import { Box, Divider, ListItemText } from "@mui/material";
import React, { useState } from "react";
import List from "@mui/material/List";
import ToolbarPopover from "./ToolbarPopover";
import RegionalStructureCreateCountry from "./Create/RegionalStructureCreateCountry";
import DeleteForm from "../../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { CountryItemType } from "../../../../containers/FI/Configuration/RegionalStructure/RegionalStructureContainer";
import MuiListItem from "@mui/material/ListItem";
import { CountryDataTypes } from "../../../../types/common.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
}));

const StyledList = styled(List)({
  width: "100%",
  overflowX: "hidden",
  overflowY: "auto",
});

const StyledListItem = styled((props: any) => (
  <MuiListItem {...props} button />
))(({ theme }) => ({
  width: "100%",
  padding: 12,
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  cursor: "pointer",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    "& p": {
      color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    },
    "& span": {
      color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    },
    "&.MuiListItem-button:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledToolbarWrapper = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  padding: 12,
  backgroundColor: theme.palette.paperBackground,
  borderBottom: theme.palette.borderColor,
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontSize: "13px",
    color: theme.palette.mode === "dark" ? "#FFF" : "#000000DE",
    fontWeight: 500,
    lineHeight: "20px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginBottom: 4,
  },
  "& .MuiListItemText-secondary": {
    fontSize: "11px",
    color: theme.palette.mode === "dark" ? "#FFF" : "#4F5863",
    fontWeight: 400,
    lineHeight: "16px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

interface Props {
  countries: CountryDataTypes[];
  selectedItem: CountryItemType | null;
  setSelectedItem: (item: CountryItemType) => void;
  deleteCountryFunction: (data: CountryItemType) => void;
  addCountryFunction: (data: CountryItemType) => void;
  setSelectedCountryItems: (items: CountryItemType[]) => void;
  setCountryItems: (items: CountryItemType[]) => void;
}

const RegionalStructureCountryList: React.FC<Props> = ({
  countries,
  selectedItem,
  setSelectedItem,
  deleteCountryFunction,
  addCountryFunction,
  setSelectedCountryItems,
  setCountryItems,
}) => {
  const { t } = useTranslation();

  const [addNewFormOpen, setAddNewFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const deleteCountry = () => {
    if (selectedItem) deleteCountryFunction(selectedItem);
    setIsDeleteConfirmOpen(false);
  };

  const handleCloseModal = () =>
    editMode ? setEditMode(false) : setAddNewFormOpen(false);

  const ToolBar = () => {
    return (
      <div style={{ height: "56px" }}>
        <StyledToolbarWrapper>
          <StyledToolbar>
            <ToolbarPopover
              selectedItem={selectedItem}
              addFunction={() => setAddNewFormOpen(true)}
              editFunction={() => setEditMode(true)}
              deleteFunction={() => setIsDeleteConfirmOpen(true)}
            />
            {(addNewFormOpen || editMode) && (
              <RegionalStructureCreateCountry
                selectedItem={selectedItem}
                open={editMode ? editMode : addNewFormOpen}
                title={editMode ? t("editCountry") : t("addCountry")}
                onSaveClick={(country) => {
                  addCountryFunction(country);
                }}
                handClose={handleCloseModal}
                editMode={editMode}
                isCountryItem={false}
              />
            )}
            {isDeleteConfirmOpen && (
              <DeleteForm
                headerText={t("delete")}
                bodyText={t("deleteWarning")}
                additionalBodyText={t("country")}
                isDeleteModalOpen={isDeleteConfirmOpen}
                setIsDeleteModalOpen={setIsDeleteConfirmOpen}
                onDelete={() => {
                  deleteCountry();
                }}
              />
            )}
          </StyledToolbar>
        </StyledToolbarWrapper>
      </div>
    );
  };

  return (
    <Box display={"flex"} flex={1} width={"100%"} height={"100%"}>
      <StyledRoot
        display={"flex"}
        width={"100%"}
        flexDirection={"column"}
        overflow={"hidden"}
      >
        {ToolBar()}
        <Box
          style={{
            overflowX: "hidden",
          }}
        >
          <StyledList disablePadding data-testid={"regionalStructureList"}>
            {countries.map((item: CountryDataTypes, index: number) => (
              <React.Fragment key={index}>
                <StyledListItem
                  data-testid={`regStructListItem-${index}`}
                  selected={item.id === selectedItem?.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setSelectedCountryItems([]);
                    setCountryItems([item]);
                  }}
                  autoFocus={item.id === selectedItem?.id}
                >
                  <Box
                    display={"flex"}
                    alignItems={"flex-start"}
                    width={"100%"}
                  >
                    <Box style={{ overflow: "hidden" }}>
                      <StyledListItemText
                        primary={item.code}
                        secondary={item.name}
                      />
                    </Box>
                  </Box>
                </StyledListItem>
                <Divider />
              </React.Fragment>
            ))}
          </StyledList>
        </Box>
      </StyledRoot>
    </Box>
  );
};

export default RegionalStructureCountryList;
