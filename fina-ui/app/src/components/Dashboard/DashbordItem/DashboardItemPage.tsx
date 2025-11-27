import { Box } from "@mui/system";
import GridTable from "../../common/Grid/GridTable";
import DashboardItemSidebar from "./DashboardItemSidebar";
import React, { useState } from "react";
import Paging from "../../common/Paging/Paging";
import { useTranslation } from "react-i18next";
import DashletCreationWizard from "../DashletCreation/DashletCreationWizard";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForm from "../../common/Delete/DeleteForm";
import DashboardItemHeader from "./DashboardItemHeader";
import { DashletType } from "../../../types/dashboard.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface SideMenuType {
  open: boolean;
  row: DashletType | null;
}

interface DashboardItemPageProps {
  dashlets: DashletType[];
  columnHeaders: GridColumnType[];
  loading: boolean;
  setDashlets: (value: DashletType[]) => void;
  deleteDashletHandler: (
    dashletId: number,
    selectedItem: DashletType,
    sideMenu: { open: boolean; row: DashletType | null },
    setSelectedItem: React.Dispatch<React.SetStateAction<DashletType | null>>
  ) => void;
  onPagingLimitChange: (value: number) => void;
  setPagingPage: (value: number) => void;
  totalResults: number;
  pagingPage: number;
  pagingLimit: number;
  filterOnChangeFunction: (value: FilterType[]) => void;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
  columnFilterConfig: columnFilterConfigType[];
  onDashletEdit(data: DashletType): void;
}

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "20px 16px",
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  width: "100%",
});

const StyledContentWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
});

const StyledBody = styled(Box)(({ theme }: any) => ({
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
  minHeight: 0,
  position: "relative",
}));

const StyledDashboardGridSideBar = styled(Box)(({ theme }: any) => ({
  width: 750,
  height: "100%",
  position: "absolute",
  top: 0,
  right: 0,
  transitionDuration: "0.5s",
  zIndex: theme.zIndex.modal - 1,
  transition: "linear 1s",
}));

const StyledPagesContainer = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
  backgroundColor: theme.palette.paperBackground,
}));

const DashboardItemPage: React.FC<DashboardItemPageProps> = ({
  dashlets,
  columnHeaders,
  loading,
  setDashlets,
  deleteDashletHandler,
  onPagingLimitChange,
  setPagingPage,
  totalResults,
  pagingPage,
  pagingLimit,
  filterOnChangeFunction,
  orderRowByHeader,
  columnFilterConfig,
  onDashletEdit,
}) => {
  const { t } = useTranslation();

  const [selectedItem, setSelectedItem] = useState<DashletType | null>(null);
  const [isAddNewOpen, setIsAddNewOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<DashletType[]>([]);
  const [sideMenu, setSideMenu] = useState<SideMenuType>({
    open: false,
    row: null,
  });

  const onDelete = () => {
    if (selectedItem && sideMenu.row) {
      deleteDashletHandler(
        selectedItem?.id ? selectedItem.id : sideMenu.row.id,
        selectedItem,
        sideMenu,
        setSelectedItem
      );
    }
    setSideMenu({ open: false, row: null });
    setIsDeleteModalOpen(false);
  };

  let actionButtons = (row: DashletType, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => {
            setSelectedItem(row);
            setIsAddNewOpen(true);
          }}
          children={<EditIcon />}
          rowIndex={index}
          buttonName={"edit"}
        />

        <ActionBtn
          onClick={() => {
            setSelectedItem(row);
            setSideMenu({ open: false, row });
            setIsDeleteModalOpen(true);
          }}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
          buttonName={"delete"}
        />
      </>
    );
  };

  return (
    <StyledRoot data-testid="dashlet-list-container">
      <StyledContentWrapper>
        <DashboardItemHeader
          setIsAddNewOpen={setIsAddNewOpen}
          setSelectedItem={setSideMenu}
        />
        <StyledBody>
          <StyledDashboardGridSideBar
            style={{
              transform: sideMenu.open ? "translate(0)" : "translate(750px)",
            }}
          >
            {sideMenu.open && (
              <DashboardItemSidebar
                setSideMenu={setSideMenu}
                data={sideMenu.row}
                setSelectedRows={setSelectedRows}
              />
            )}
          </StyledDashboardGridSideBar>
          <GridTable
            columns={columnHeaders}
            rows={dashlets}
            setRows={setDashlets}
            selectedRows={selectedRows}
            rowOnClick={(row: DashletType, deselect: boolean) => {
              if (deselect) {
                setSideMenu({ open: false, row: null });
              } else {
                setSideMenu({ open: true, row: row });
              }
            }}
            loading={loading}
            actionButtons={actionButtons}
            filterOnChangeFunction={filterOnChangeFunction}
            singleRowSelect={true}
            orderRowByHeader={orderRowByHeader}
            columnFilterConfig={columnFilterConfig}
          />
        </StyledBody>
        <StyledPagesContainer>
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => setPagingPage(number)}
            totalNumOfRows={totalResults}
            initialPage={pagingPage}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPagesContainer>
      </StyledContentWrapper>
      {isAddNewOpen && (
        <DashletCreationWizard
          onDashletEdit={onDashletEdit}
          isAddDashletOpen={isAddNewOpen}
          setIsAddDashletOpen={setIsAddNewOpen}
          setData={setDashlets}
          data={dashlets}
          selectedItem={selectedItem}
          onCloseModal={() => setSelectedItem(null)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("dashlet")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDelete={onDelete}
          onCloseModal={() => setSelectedItem(null)}
        />
      )}
    </StyledRoot>
  );
};

export default DashboardItemPage;
