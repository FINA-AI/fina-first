import { Box, Typography } from "@mui/material";
import React, { FC, MutableRefObject, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FAQPageRightSide from "./FAQPageRightSide";
import FAQList from "./FAQList";
import ClosableModal from "../common/Modal/ClosableModal";
import FAQListAddModal from "./Modal/FAQListAddModal";
import DeleteForm from "../common/Delete/DeleteForm";
import {
  FaqCategoryDataType,
  FaqDataType,
  FaqListDataType,
} from "../../types/faq.type";
import { GridColumnType, TreeGridStateType } from "../../types/common.type";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import SimpleLoadMask from "../common/SimpleLoadMask";
import { styled } from "@mui/material/styles";
import { TableRefType } from "../../containers/FAQ/FAQContainer";

interface FAQPageProps {
  treeState: TreeGridStateType;
  setTreeState: React.Dispatch<React.SetStateAction<TreeGridStateType>>;
  columns: GridColumnType[];
  pagingPage: number;
  setActivePage: (value: number) => void;
  setRowPerPage: (value: number) => void;
  initialRowsPerPage: number;
  dataLength: number;
  listData: any;
  fetchListData: (
    rowId: number,
    data: FaqListDataType[],
    row: FaqListDataType
  ) => void;
  onCategorySelect: (row: FaqListDataType) => void;
  data: any;
  loading: boolean;
  deleteCategory: (
    row: FaqListDataType,
    setSelectedListItem: React.Dispatch<
      React.SetStateAction<FaqListDataType | undefined>
    >
  ) => void;
  deleteCategoryItem: (category: FaqCategoryDataType, row: FaqDataType) => void;
  changeFAQSequence: (
    faqId: number | undefined,
    onArrowDisableFn: (value: boolean) => void,
    moveUp: boolean
  ) => void;
  addCategory: (data: FaqListDataType, parentRow: FaqListDataType) => void;
  addQuestion: (id: number, item: FaqDataType) => void;
  editCategory: (
    id: number,
    listItem: FaqListDataType,
    selectedRow: FaqListDataType
  ) => void;
  editQuestion: (id: number, item: FaqDataType) => void;
  onFilter: (searchText: string) => void;
  loadMask: boolean;
  scrollToIndex: number;
  faqCategoryLoading: boolean;
  tableRef: MutableRefObject<TableRefType | null>;
  setSearchValue: (txt: string) => void;
}

const StyledMainLayout = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

const StyledContainer = styled(Box)(({ theme }: any) => ({
  ...theme.page,
}));

const StyledPageContent = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
  ...theme.pageTitle,
}));

const StyledDivider = styled(Box)(({ theme }: any) => ({
  background: theme.palette.mode === "dark" ? "rgb(125,129,157)" : "#EAEBF0",
  width: "1px",
  height: "20px",
}));

const StyledSideToolbar = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "8px 12px",
  borderBottom: theme.palette.borderColor,
  position: "sticky",
  zIndex: 99,
  top: 0,
}));

const StyledSideToolbarItem = styled(Box)({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
    marginRight: "8px",
  },
});

const StyledList = styled(Box)(({ theme }: any) => ({
  borderRight: theme.palette.borderColor,
  minWidth: "270px",
  width: "500px",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  position: "relative",
}));

const FAQPage: FC<FAQPageProps> = ({
  treeState,
  setTreeState,
  columns,
  pagingPage,
  setActivePage,
  setRowPerPage,
  initialRowsPerPage,
  dataLength,
  listData,
  fetchListData,
  onCategorySelect,
  data,
  loading,
  deleteCategory,
  deleteCategoryItem,
  changeFAQSequence,
  addCategory,
  addQuestion,
  editCategory,
  editQuestion,
  onFilter,
  loadMask,
  scrollToIndex,
  faqCategoryLoading,
  tableRef,
  setSearchValue,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();
  const [selectedListItem, setSelectedListItem] = useState<
    FaqListDataType | undefined
  >();
  const [openListAddModal, setOpenListAddModal] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteFAQ = (row: FaqDataType) => {
    if (selectedListItem) deleteCategoryItem(selectedListItem, row);
  };

  useEffect(() => {
    if (selectedListItem === undefined && listData.length > 0) {
      setSelectedListItem(listData[0]);
    }
  }, [listData]);

  const rowSelectHandler = (
    row: FaqListDataType,
    rows: FaqListDataType[],
    isKeyboardShortcutKeyClicked: boolean,
    deselect: boolean
  ) => {
    onCategorySelect(row);
    setSelectedListItem(row);
    if (deselect) {
      setSelectedListItem(undefined);
    }
  };

  const filterFunc = (val: string) => {
    if (val) {
      onFilter(val);
    } else if (selectedListItem) {
      onCategorySelect(selectedListItem);
      setSearchValue("");
    }
  };

  return (
    <StyledMainLayout>
      <StyledContainer>
        <StyledTitle>{t("faqName")}</StyledTitle>
        <StyledPageContent>
          <Box display={"flex"} width={"100%"} height={"100%"}>
            <StyledList data-testid={"left-container"}>
              {hasPermission(PERMISSIONS.FAQ_AMEND) && (
                <StyledSideToolbar data-testid={"toolbar"}>
                  <StyledSideToolbarItem
                    style={{
                      color: "#2962FF",
                      opacity: selectedListItem
                        ? !selectedListItem.leaf
                          ? 1
                          : 0.6
                        : 0.6,
                      cursor: !selectedListItem?.leaf ? "pointer" : "default",
                    }}
                    onClick={() => {
                      !selectedListItem?.leaf &&
                        selectedListItem &&
                        setOpenListAddModal(true);
                      setIsAdd(true);
                    }}
                    data-testid={"add-button"}
                  >
                    <AddIcon /> {t("add")}
                  </StyledSideToolbarItem>
                  <StyledDivider />
                  <StyledSideToolbarItem
                    style={{
                      color: "#AEB8CB",
                      opacity:
                        selectedListItem && selectedListItem?.id !== -1
                          ? 1
                          : 0.6,
                      cursor:
                        selectedListItem && selectedListItem?.id !== -1
                          ? "pointer"
                          : "default",
                    }}
                    onClick={() => {
                      selectedListItem &&
                        selectedListItem?.id !== -1 &&
                        setOpenListAddModal(true);
                      setIsAdd(false);
                    }}
                    data-testid={"edit-button"}
                  >
                    <EditIcon /> {t("edit")}
                  </StyledSideToolbarItem>
                  <StyledDivider />
                  <StyledSideToolbarItem
                    style={{
                      color: "#FF4128",
                      opacity:
                        selectedListItem && selectedListItem?.id !== -1
                          ? 1
                          : 0.6,
                      cursor:
                        selectedListItem && selectedListItem?.id !== -1
                          ? "pointer"
                          : "default",
                    }}
                    onClick={() => {
                      selectedListItem &&
                        selectedListItem?.id !== -1 &&
                        setIsDeleteConfirmOpen(true);
                    }}
                    data-testid={"delete-button"}
                  >
                    <DeleteIcon />
                    {t("delete")}
                  </StyledSideToolbarItem>
                </StyledSideToolbar>
              )}
              {faqCategoryLoading ? (
                <SimpleLoadMask loading={true} color={"primary"} />
              ) : (
                <FAQList
                  treeState={treeState}
                  setTreeState={setTreeState}
                  data={listData}
                  fetchListData={fetchListData}
                  rowSelectHandler={rowSelectHandler}
                />
              )}
            </StyledList>
            <Box
              width={"100%"}
              minWidth={"0px"}
              data-testid={"right-container"}
            >
              <FAQPageRightSide
                dataLength={dataLength}
                setRowPerPage={setRowPerPage}
                pagingPage={pagingPage}
                initialRowsPerPage={initialRowsPerPage}
                setActivePage={setActivePage}
                columns={columns}
                faqData={data}
                loading={loading}
                deleteCategoryItem={deleteFAQ}
                selectedListItem={selectedListItem}
                changeFAQSequence={changeFAQSequence}
                addQuestion={addQuestion}
                editQuestion={editQuestion}
                onFilter={filterFunc}
                loadMask={loadMask}
                scrollToIndex={scrollToIndex}
                ref={tableRef}
              />
            </Box>
          </Box>
        </StyledPageContent>
      </StyledContainer>
      <ClosableModal
        onClose={() => {
          setOpenListAddModal(false);
        }}
        open={openListAddModal}
        width={600}
        height={250}
        title={t("create")}
      >
        <FAQListAddModal
          addCategory={addCategory}
          setOpenListAddModal={setOpenListAddModal}
          data={selectedListItem}
          editCategory={editCategory}
          isAdd={isAdd}
        />
      </ClosableModal>

      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("category")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            if (selectedListItem)
              deleteCategory(selectedListItem, setSelectedListItem);
            setIsDeleteConfirmOpen(false);
          }}
          showConfirm={false}
        />
      )}
    </StyledMainLayout>
  );
};

export default FAQPage;
