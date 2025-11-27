import { Box } from "@mui/system";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import React from "react";
import UserFileItemSideBar from "./UserFileItemSideBar";
import SearchField from "../../common/Field/SearchField";
import { Paper, Slide } from "@mui/material";
import { SideMenuType, UserFile } from "../../../types/userFileSpace.type";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface UserFileItemGridProps {
  data: UserFile[];
  setData: (data: UserFile[]) => void;
  columns: GridColumnType[];
  gridPagingPage: number;
  gridPagingLimit: number;
  totalResult: number;
  onGridPagingLimitChange: (limit: number) => void;
  setGridPagingPage: (page: number) => void;
  downloadUserFileHandler: (
    val: UserFile,
    e: React.MouseEvent<
      HTMLAnchorElement | HTMLSpanElement | HTMLButtonElement,
      MouseEvent
    >
  ) => void;

  loadVersionHandler: (val: string) => void;
  versions: UserFile[];
  sideMenu: SideMenuType;
  setSideMenu: (menu: SideMenuType) => void;
  loading: boolean;
  onFilter: (filterByName: string, filterType: string) => void;
  filterValue?: string;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledBody = styled(Box)(({ theme }: any) => ({
  height: "100%",
  background: theme.palette.paperBackground,
  minHeight: 0,
  position: "relative",
}));

const StyledDashboardGridSideBar = styled(Paper)(({ theme }: any) => ({
  height: "100%",
  width: `700px`,
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: theme.zIndex.modal,
  borderLeft: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const UserFileItemGrid: React.FC<UserFileItemGridProps> = ({
  data,
  setData,
  columns,
  gridPagingPage,
  gridPagingLimit,
  totalResult,
  onGridPagingLimitChange,
  setGridPagingPage,
  downloadUserFileHandler,
  loadVersionHandler,
  versions,
  sideMenu,
  setSideMenu,
  loading,
  onFilter,
  filterValue,
  orderRowByHeader,
}) => {
  return (
    <>
      <Box
        sx={(theme: any) => ({
          ...theme.pageToolbar,
          justifyContent: "flex-end",
        })}
        data-testid={"header"}
      >
        <SearchField
          defaultValue={filterValue}
          onFilterClick={(e) => onFilter(e, "child")}
          width={400}
          withFilterButton={false}
          onClear={() => onFilter("", "child")}
        />
      </Box>
      <StyledBody>
        <Slide direction="left" in={sideMenu.open} timeout={600}>
          <StyledDashboardGridSideBar>
            <UserFileItemSideBar
              setSideMenu={setSideMenu}
              data={versions}
              downloadUserFileHandler={downloadUserFileHandler}
            />
          </StyledDashboardGridSideBar>
        </Slide>
        <div
          data-testid={"grid-container"}
          style={{ display: "flex", height: "100%" }}
        >
          <GridTable
            columns={columns}
            rows={data}
            setRows={setData}
            rowOnClick={(row: UserFile, deselect: boolean) => {
              if (deselect) {
                setSideMenu({ open: false, row: null });
              } else {
                setSideMenu({ open: true, row: row });
                loadVersionHandler(row.id);
              }
            }}
            loading={loading}
            singleRowSelect={true}
            orderRowByHeader={orderRowByHeader}
          />
        </div>
      </StyledBody>
      <Box sx={(theme: any) => ({ ...theme.pagePaging({ size: "default" }) })}>
        <Paging
          onRowsPerPageChange={(number) => onGridPagingLimitChange(number)}
          onPageChange={(number) => setGridPagingPage(number)}
          totalNumOfRows={totalResult}
          initialPage={gridPagingPage}
          initialRowsPerPage={gridPagingLimit}
        />
      </Box>
    </>
  );
};

export default UserFileItemGrid;
