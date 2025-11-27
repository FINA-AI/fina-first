import React, { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import List from "@mui/material/List";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNewFiStructureModal from "./AddNewFiStructureModal";
import DeleteForm from "../../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import withLoading from "../../../../hoc/withLoading";
import FIGroupGridSkeleton from "../../Skeleton/Configuration/FIStructure/FIGroupGridSkeleton";
import NoRecordIndicator from "../../../common/NoRecordIndicator/NoRecordIndicator";
import { styled } from "@mui/material/styles";
import { FiStructureDataType } from "../../../../types/fi.type";

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
}));

const StyledList = styled(List)(({ theme }: any) => ({
  width: "100%",
  height: "100%",
  overflow: "auto",
  background: theme.palette.paperBackground,
  border: "none",
  boxSizing: "border-box",
  cursor: "pointer",
  "&.MuiListItem-button:hover": {
    backgroundColor: "#157AFF",
    height: 0,
  },
}));

const StyledListItemText = styled(ListItemText)({
  "& .MuiListItemText-primary": {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const StyledIconButton = styled(IconButton)({
  margin: 5,
  backgroundColor: "inherit",
  height: 32,
  width: 32,
  border: "0.5px solid rgba(104, 122, 158, 0.08)",
});

const StyledAddIcon = styled(AddIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0",
}));

interface FiGroupsListProps {
  data: FiStructureDataType[];
  selectedCriterion?: FiStructureDataType;
  deleteFiFunction: (item: FiStructureDataType | undefined) => void;
  onSaveGroup: (item: FiStructureDataType) => void;
  addNewFormOpen: boolean;
  setAddNewFormOpen: (val: boolean) => void;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (val: boolean) => void;
  groupLoading: boolean;
}

const FiGroupsList: React.FC<FiGroupsListProps> = ({
  data,
  selectedCriterion,
  deleteFiFunction,
  onSaveGroup,
  addNewFormOpen,
  setAddNewFormOpen,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  groupLoading,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<number>();
  const [selectedItem, setSelectedItem] = useState<FiStructureDataType>();
  const [editMode, setEditMode] = useState(false);
  const [loading] = useState(true);

  const { t } = useTranslation();

  const ToolBar = () => {
    return (
      <Box display={"flex"} flexDirection={"column"}>
        <StyledToolbar
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pr={"10px"}
        >
          <PrimaryBtn
            data-testid={"addNewBtn"}
            style={{
              textTransform: "none",
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: 12,
              marginLeft: "auto",
            }}
            onClick={() => {
              setEditMode(false);
              setAddNewFormOpen(true);
            }}
            disabled={!selectedCriterion}
            endIcon={<StyledAddIcon />}
          >
            <>{t("addNew")}</>
          </PrimaryBtn>
          {addNewFormOpen && (
            <AddNewFiStructureModal
              title={editMode ? "Edit Group" : "Add Group"}
              open={addNewFormOpen}
              handClose={() => {
                setAddNewFormOpen(false);
              }}
              onSaveClick={onSaveGroup}
              selectedItem={editMode ? selectedItem : null}
            />
          )}
          {isDeleteConfirmOpen && (
            <DeleteForm
              headerText={t("delete")}
              bodyText={t("deleteWarning")}
              additionalBodyText={t("group")}
              isDeleteModalOpen={isDeleteConfirmOpen}
              setIsDeleteModalOpen={setIsDeleteConfirmOpen}
              onDelete={() => {
                deleteFiFunction(selectedItem);
                setIsDeleteConfirmOpen(false);
              }}
            />
          )}
        </StyledToolbar>
        <StyledDivider />
      </Box>
    );
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      height={"100%"}
    >
      <ToolBar />
      {groupLoading ? (
        <FIGroupGridSkeleton />
      ) : (
        <Box
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          <StyledList disablePadding data-tetid={"group-list"}>
            {!loading && data.length === 0 && <NoRecordIndicator />}
            {data.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  data-testid={`group-${index}`}
                  button
                  onMouseOver={() => {
                    if (item) setSelectedItemId(item.id);
                  }}
                  onMouseLeave={() => {
                    setSelectedItemId(undefined);
                  }}
                  sx={{ height: "48px" }}
                >
                  <StyledListItemText primary={item.code + " / " + item.name} />
                  <Box
                    display={"flex"}
                    style={{
                      display: selectedItemId === item.id ? "block" : "none",
                    }}
                  >
                    <StyledIconButton
                      edge="start"
                      onClick={() => {
                        if (item) setSelectedItem(item);
                        setEditMode(true);
                        setAddNewFormOpen(true);
                      }}
                      data-testid={`rowEditFunction-${item.id}`}
                      size="large"
                    >
                      <EditIcon
                        sx={{
                          fontSize: 21,
                          cursor: "pointer",
                          color: "#7589A5",
                        }}
                      />
                    </StyledIconButton>
                    <StyledIconButton
                      edge="start"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDeleteConfirmOpen(true);
                      }}
                      data-testid={`rowDeleteFunction-${item.id}`}
                      size="large"
                    >
                      <DeleteIcon
                        sx={{
                          fontSize: 21,
                          cursor: "pointer",
                          color: "#FF735A",
                        }}
                      />
                    </StyledIconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </StyledList>
        </Box>
      )}
    </Box>
  );
};

export default withLoading(FiGroupsList);
