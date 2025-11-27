import { Box, Checkbox, Divider, ListItem, ListItemText } from "@mui/material";
import React from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import AddNewFiStructureModal from "./AddNewFiStructureModal";
import DeleteForm from "../../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import ToolbarPopover from "../RegionalStructure/ToolbarPopover";
import { styled } from "@mui/material/styles";
import { FiStructureDataType } from "../../../../types/fi.type";

const StyledList = styled(Box)(({ theme }: any) => ({
  overflowX: "hidden",
  overflowY: "auto",
  background: theme.palette.paperBackground,
  border: "none",
  padding: 0,
}));

const StyledListItemText = styled(ListItemText)(({ theme }: any) => ({
  "& .MuiListItemText-primary": {
    fontSize: "13px",
    color: theme.palette.textColor,
    lineHeight: "20px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 4,
  },
  "& .MuiListItemText-secondary": {
    fontSize: "11px",
    color: theme.palette.textColor,
    lineHeight: "16px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  width: "100%",
  padding: "12px 12px 12px 10px",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  cursor: "pointer",
  "&.Mui-selected": {
    "&:hover": {
      background: theme.palette.buttons.primary.hover,
    },
    color: theme.palette.mode === "light" ? "#F5F7FA" : "#1F2532",
    "& p": {
      color: theme.palette.mode === "light" ? "#F5F7FA" : "#1F2532",
    },
    "& span": {
      color: theme.palette.mode === "light" ? "#F5F7FA" : "#1F2532",
    },
  },
  borderBottom: theme.palette.borderColor,
}));

const StyledToolbarWrapper = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  padding: 12,
  borderBottom: theme.palette.borderColor,
}));

const StyledToolbar = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
});

const StyledDivider = styled(Divider)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0",
}));

interface FiCriterionListProps {
  selectedItem?: FiStructureDataType;
  setSelectedItem: (item: FiStructureDataType) => void;
  onSaveCriterion: (criterion: FiStructureDataType) => void;
  makeDefault: (criterion: FiStructureDataType) => void;
  deleteFiParentFunction: () => void;
  data: FiStructureDataType[];
  isParentDelModalOpen: boolean;
  setIsParentDelModalOpen: (value: boolean) => void;
  listAddNewFormOpen: boolean;
  setListAddNewFormOpen: (value: boolean) => void;
  listEditMode: boolean;
  setListEditMode: (value: boolean) => void;
}

const FiCriterionList: React.FC<FiCriterionListProps> = ({
  selectedItem,
  setSelectedItem,
  onSaveCriterion,
  makeDefault,
  deleteFiParentFunction,
  data,
  isParentDelModalOpen,
  setIsParentDelModalOpen,
  listAddNewFormOpen,
  setListAddNewFormOpen,
  listEditMode,
  setListEditMode,
}) => {
  const { t } = useTranslation();

  const ToolBar = () => {
    return (
      <div>
        <StyledToolbarWrapper>
          <StyledToolbar>
            <ToolbarPopover
              addFunction={() => {
                setListEditMode(false);
                setListAddNewFormOpen(true);
              }}
              editFunction={() => {
                setListEditMode(true);
                setListAddNewFormOpen(true);
              }}
              deleteFunction={() => setIsParentDelModalOpen(true)}
              selectedItem={selectedItem}
            />
            {listAddNewFormOpen && (
              <AddNewFiStructureModal
                title={listEditMode ? "Edit Criterion" : "Add Criterion"}
                open={listAddNewFormOpen}
                handClose={() => {
                  setListAddNewFormOpen(false);
                }}
                onSaveClick={onSaveCriterion}
                selectedItem={listEditMode ? selectedItem : null}
              />
            )}
            {isParentDelModalOpen && (
              <DeleteForm
                headerText={t("delete")}
                bodyText={t("deleteWarning")}
                isDeleteModalOpen={isParentDelModalOpen}
                setIsDeleteModalOpen={setIsParentDelModalOpen}
                onDelete={deleteFiParentFunction}
              />
            )}
          </StyledToolbar>
        </StyledToolbarWrapper>
      </div>
    );
  };

  return (
    <Box display={"flex"} flex={1} width={"100%"} height={"100%"}>
      <Box
        display={"flex"}
        width={"100%"}
        flexDirection={"column"}
        overflow={"hidden"}
      >
        {ToolBar()}
        <Box
          style={{
            overflow: "auto",
            height: "100%",
          }}
        >
          <StyledList component="nav" data-test={"criterion-list"}>
            {data?.map((item, index) => (
              <React.Fragment key={item.id}>
                <StyledListItem
                  data-testid={`criterion-${index}`}
                  selected={item.code === selectedItem?.code}
                  autoFocus={item.code === selectedItem?.code}
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                >
                  <Box
                    display={"flex"}
                    alignItems={"flex-start"}
                    width={"100%"}
                  >
                    <Checkbox
                      style={{
                        padding: 2,
                        color: "#98A7BC",
                      }}
                      icon={<StarOutlineIcon />}
                      checked={item.isDefault}
                      checkedIcon={<StarIcon style={{ color: "#FF8D00" }} />}
                      onChange={(event, checked) => {
                        event.stopPropagation();

                        if (checked) {
                          makeDefault({
                            ...item,
                            isDefault: true,
                          });
                        }
                      }}
                    />
                    <Box pl={"5px"} style={{ overflow: "hidden" }}>
                      <StyledListItemText
                        primary={item.code}
                        secondary={item.name}
                      />
                    </Box>
                  </Box>
                </StyledListItem>
              </React.Fragment>
            ))}
          </StyledList>
        </Box>
      </Box>
      <Box display={"flex"}>
        <StyledDivider orientation="vertical" flexItem />
      </Box>
    </Box>
  );
};

export default FiCriterionList;
