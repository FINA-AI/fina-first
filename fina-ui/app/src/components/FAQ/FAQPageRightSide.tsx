import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Grid, Paper, Slide } from "@mui/material";
import Paging from "../common/Paging/Paging";
import GridTable from "../common/Grid/GridTable";
import ActionBtn from "../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FAQSideBar from "./FAQSideBar";
import FAQCategoryAddModal from "./Modal/FAQCategoryAddModal";
import ClosableModal from "../common/Modal/ClosableModal";
import DeleteForm from "../common/Delete/DeleteForm";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { PERMISSIONS } from "../../api/permissions";
import useConfig from "../../hoc/config/useConfig";
import { FaqDataType, FaqListDataType } from "../../types/faq.type";
import SearchField from "../common/Field/SearchField";
import SimpleLoadMask from "../common/SimpleLoadMask";
import { styled } from "@mui/material/styles";
import { TableRefType } from "../../containers/FAQ/FAQContainer";

interface FAQPageRightSideProps {
  columns: any;
  pagingPage: number;
  setActivePage: any;
  setRowPerPage: any;
  initialRowsPerPage: number;
  dataLength: number;
  faqData: FaqDataType[];
  loading: boolean;
  deleteCategoryItem: any;
  selectedListItem?: FaqListDataType;
  changeFAQSequence: (
    faqId: number | undefined,
    onArrowDisableFn: (value: boolean) => void,
    moveUp: boolean
  ) => void;
  addQuestion: any;
  editQuestion: any;
  onFilter: (searchText: string) => void;
  loadMask: boolean;
  scrollToIndex: number;
}

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const StyledSearchContainer = styled(Box)({
  flexGrow: 1,
  display: "flex",
  justifyContent: "flex-start",
});

const StyledContent = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  ...theme.pageToolbar,
  justifyContent: "flex-end",
  padding: "8px 16px",
}));

const StyledPaper = styled(Paper)(({ theme }: any) => ({
  height: "100%",
  width: `700px`,
  zIndex: theme.zIndex.modal - 1,
  borderLeft: theme.general.border,
  overflow: "auto",
}));

const StyledPagesContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const StyledCustomIconBox = styled(Box)(({ theme }: any) => ({
  "& .MuiButtonBase-root": {
    width: "32px",
    height: "32px",
  },
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
}));

const FAQPageRightSide = forwardRef<TableRefType, FAQPageRightSideProps>(
  (
    {
      columns,
      pagingPage,
      setActivePage,
      setRowPerPage,
      initialRowsPerPage,
      dataLength,
      faqData,
      loading,
      deleteCategoryItem,
      selectedListItem,
      changeFAQSequence,
      addQuestion,
      editQuestion,
      onFilter,
      loadMask,
      scrollToIndex,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [selectedRow, setSelectedRow] = useState<FaqDataType | null>(null);
    const [data, setData] = useState<FaqDataType[]>([]);
    const [disableRowBtn, setDisableRowBtn] = useState(false);
    const [sideMenu, setSideMenu] = useState<{
      open: boolean;
      row: FaqDataType | null;
    }>({ open: false, row: null });
    const [isCategoryAddModalOpen, setIsCategoryAddModalOpen] = useState(false);
    const containerRef = React.useRef(null);
    const { hasPermission } = useConfig();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<{
      isOpen: boolean;
      row: FaqDataType | null;
    }>({
      isOpen: false,
      row: null,
    });

    useEffect(() => {
      setData([
        ...faqData
          .map((row) => {
            return { ...row, index: row.sequence };
          })
          .sort((a, b) => a.sequence - b.sequence),
      ]);
    }, [faqData]);

    useEffect(() => {
      setSelectedRow(null);
      setSideMenu({ open: false, row: null });
    }, [selectedListItem]);

    const onRowUp = async () => {
      let arr: FaqDataType[] = [];
      let selectedRowIndex = 1;

      let startIndex = 1;
      if (selectedRow) {
        data.forEach((item) => {
          if (item.id !== selectedRow.id) {
            if (startIndex + 1 === selectedRow.index) {
              selectedRowIndex = startIndex;

              arr.push({ ...selectedRow, index: startIndex });
              startIndex++;
            }
            arr.push({ ...item, index: startIndex });
            startIndex++;
          }
        });
      }
      let newSelectedRow: FaqDataType = {
        ...(selectedRow as FaqDataType),
        index: selectedRowIndex,
        sequence: selectedRowIndex,
      };

      arr = arr.map((r) => {
        return { ...r, sequence: r.index };
      });

      changeFAQSequence(selectedRow?.id, setDisableRowBtn, true);

      setSelectedRow(newSelectedRow);
      setData(arr);
    };
    const onRowClick = (row: FaqDataType) => {
      if (selectedRow?.id === row.id) {
        setSelectedRow(null);
      } else {
        setSelectedRow(row);
      }
      setSideMenu({ open: false, row: null });
    };

    const onRowDown = async () => {
      let arr: FaqDataType[] = [];
      let startIndex = 1;
      let selectedRowIndex = 1;
      if (selectedRow) {
        data.forEach((item) => {
          if (item.id !== selectedRow.id) {
            arr.push({ ...item, index: startIndex });
            if (startIndex === selectedRow.index) {
              startIndex++;
              selectedRowIndex = startIndex;
              arr.push({ ...selectedRow, index: startIndex });
            }
            startIndex++;
          }
        });
      }
      let newSelectedRow: FaqDataType = {
        ...(selectedRow as FaqDataType),
        index: selectedRowIndex,
        sequence: selectedRowIndex,
      };

      changeFAQSequence(selectedRow?.id, setDisableRowBtn, false);

      setSelectedRow(newSelectedRow);
      setData(arr);
    };

    let actionButtons = (row: FaqDataType, index: number) => {
      return (
        <>
          <ActionBtn
            onClick={() => {
              setSelectedRow(row);
              setSideMenu({ open: true, row: row });
            }}
            children={<UnfoldMoreIcon />}
            rowIndex={index}
            tooltipTitle={"Expand"}
            transform={"rotate(-45deg)"}
            buttonName={"expand"}
          />
          <ActionBtn
            onClick={() => {
              setSelectedRow(row);
              setIsCategoryAddModalOpen(true);
            }}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />

          <ActionBtn
            onClick={() => setIsDeleteConfirmOpen({ isOpen: true, row: row })}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        </>
      );
    };

    useImperativeHandle(ref, () => ({
      resetData: () => (data.length = 0),
    }));

    const FAQDetails = (
      <StyledPaper
        elevation={4}
        style={{
          top: 0,
          right: 0,
          position: "absolute",
        }}
      >
        <FAQSideBar
          setSideMenu={setSideMenu}
          data={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </StyledPaper>
    );

    return (
      <StyledRoot>
        <StyledToolbar data-testid={"toolbar"}>
          <StyledSearchContainer>
            <SearchField
              withFilterButton={false}
              text={t("searchRows")}
              onFilterClick={(val) => {
                onFilter(val);
              }}
              onClear={() => {
                onFilter("");
              }}
              width={"275px"}
            />
          </StyledSearchContainer>
          {hasPermission(PERMISSIONS.FAQ_AMEND) && (
            <>
              <StyledCustomIconBox marginRight={"8px"}>
                <ToolbarIcon
                  onClickFunction={() =>
                    selectedListItem?.id !== -1 && !disableRowBtn && onRowDown()
                  }
                  Icon={<KeyboardArrowDownIcon />}
                  isSquare={true}
                  disabled={
                    disableRowBtn ||
                    selectedListItem?.id === -1 ||
                    !selectedRow ||
                    data.findIndex(
                      (item) => item.index === selectedRow.index
                    ) ===
                      data.length - 1
                  }
                  data-testid={"row-down-button"}
                />
              </StyledCustomIconBox>
              <StyledCustomIconBox marginRight={"8px"}>
                <ToolbarIcon
                  onClickFunction={() =>
                    selectedListItem?.id !== -1 && !disableRowBtn && onRowUp()
                  }
                  Icon={<KeyboardArrowUpIcon />}
                  isSquare={true}
                  disabled={
                    disableRowBtn ||
                    selectedListItem?.id === -1 ||
                    !selectedRow ||
                    data.findIndex(
                      (item) => item.index === selectedRow.index
                    ) === 0
                  }
                  data-testid={"row-up-button"}
                />
              </StyledCustomIconBox>
              <PrimaryBtn
                onClick={() => {
                  setIsCategoryAddModalOpen(true);
                  setSelectedRow(null);
                  setSideMenu({ row: null, open: false });
                }}
                fontSize={12}
                disabled={
                  selectedListItem?.id === -1 ||
                  !selectedListItem ||
                  !selectedListItem.leaf
                }
                endIcon={<AddIcon />}
                data-testid={"create-button"}
              >
                {t("addNew")}
              </PrimaryBtn>
            </>
          )}
        </StyledToolbar>

        <StyledGridContainer ref={containerRef}>
          <Paper>
            <Slide
              direction="left"
              in={sideMenu.open}
              container={containerRef.current}
              timeout={600}
            >
              {FAQDetails}
            </Slide>
          </Paper>
          <StyledContent flex={1}>
            {loadMask && <SimpleLoadMask loading={true} color={"primary"} />}
            <GridTable
              columns={columns}
              rows={data}
              setRows={setData}
              selectedRows={selectedRow ? [selectedRow] : []}
              rowOnClick={(row: any) => {
                onRowClick(row as FaqDataType);
              }}
              loading={loading}
              actionButtons={actionButtons}
              scrollToIndex={scrollToIndex}
            />
          </StyledContent>
        </StyledGridContainer>
        <StyledPagesContainer>
          <Paging
            onRowsPerPageChange={(number) => setRowPerPage(number)}
            onPageChange={(number) => setActivePage(number)}
            totalNumOfRows={dataLength}
            initialPage={pagingPage}
            initialRowsPerPage={initialRowsPerPage}
          />
        </StyledPagesContainer>
        <ClosableModal
          onClose={() => {
            setIsCategoryAddModalOpen(false);
          }}
          open={isCategoryAddModalOpen}
          width={600}
          height={350}
        >
          <FAQCategoryAddModal
            data={selectedRow}
            addQuestion={addQuestion}
            selectedListItem={selectedListItem}
            setIsCategoryAddModalOpen={setIsCategoryAddModalOpen}
            editQuestion={editQuestion}
          />
        </ClosableModal>
        {isDeleteConfirmOpen.isOpen && (
          <DeleteForm
            headerText={t("delete")}
            bodyText={t("deleteWarning")}
            additionalBodyText={t("question")}
            isDeleteModalOpen={isDeleteConfirmOpen.isOpen}
            setIsDeleteModalOpen={() =>
              setIsDeleteConfirmOpen({ isOpen: false, row: null })
            }
            onDelete={() => {
              deleteCategoryItem(isDeleteConfirmOpen.row);
              setIsDeleteConfirmOpen({ isOpen: false, row: null });
            }}
            showConfirm={false}
          />
        )}
      </StyledRoot>
    );
  }
);
export default FAQPageRightSide;
