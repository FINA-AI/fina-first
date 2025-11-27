import { Box } from "@mui/system";
import UserFileSpaceBreadCrumbs from "./UserFileSpaceBreadCrumbs";
import Grid from "@mui/material/Grid";
import ToolbarListSearch from "../../Catalog/MiniCatalog/ListSearch";
import ListSkeleton from "../../FI/Skeleton/ListSkeleton/ListSkeleton";
import MiniPaging from "../../common/Paging/MiniPaging";
import UserFileList from "./UserFileList";
import { useParams } from "react-router-dom";
import UserFileItemGrid from "./UserFileItemGrid";
import React from "react";
import { SideMenuType, UserFile } from "../../../types/userFileSpace.type";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface UserFileSpaceItemProps {
  listLoading: boolean;
  gridLoading: boolean;
  listData: UserFile[];
  onListSelect: (val: UserFile) => void;
  data: UserFile[];
  setData: (data: UserFile[]) => void;
  columns: GridColumnType[];
  pagingPage: number;
  onPagingLimitChange: (limit: number) => void;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  totalListItemResult: number;
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
  onFilter: (filterByName: string, filterType: string) => void;
  filterValues: Record<string, string>;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  background: theme.palette.paperBackground,
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  width: "100%",
}));

const StyledContentContainer = styled(Grid)({
  height: "100%",
  minHeight: 0,
  borderRadius: "4px",
  boxSizing: "border-box",
});

const StyledListWrapper = styled(Grid)(({ theme }: any) => ({
  height: "100%",
  borderRight: theme.palette.borderColor,
}));

const StyledPagesBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
  justifyContent: "center",
}));

const StyledGridContainer = styled(Grid)({
  height: "100%",
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const UserFileSpaceItem: React.FC<UserFileSpaceItemProps> = ({
  listLoading,
  listData,
  onListSelect,
  data,
  setData,
  columns,
  pagingPage,
  pagingLimit,
  setPagingPage,
  totalListItemResult,
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
  gridLoading,
  onFilter,
  filterValues,
  orderRowByHeader,
}) => {
  const { userFileName }: { userFileName: string } = useParams();

  const GetUserFileList = () => {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          <ToolbarListSearch
            onFilter={(v: string) => {
              onFilter(v, "root");
            }}
            to={`/userfilespace`}
            height={55}
            onClear={() => setPagingPage(1)}
          />
        </div>
        <div
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {listLoading ? (
            <ListSkeleton listItemCount={8} />
          ) : (
            <UserFileList
              itemName={userFileName}
              data={listData}
              onSelect={(item) => {
                onListSelect(item);
                setSideMenu({ open: false, row: null });
              }}
            />
          )}
        </div>
        <StyledPagesBox>
          <MiniPaging
            totalNumOfRows={totalListItemResult}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPagesBox>
      </div>
    );
  };

  return (
    <StyledRoot>
      <UserFileSpaceBreadCrumbs userFileName={userFileName} />
      <StyledContentContainer container>
        <StyledListWrapper item xs={2}>
          {GetUserFileList()}
        </StyledListWrapper>
        <StyledGridContainer
          item
          xs={10}
          data-testid={"user-file-item-container"}
        >
          <UserFileItemGrid
            data={data}
            setData={setData}
            columns={columns}
            gridPagingPage={gridPagingPage}
            gridPagingLimit={gridPagingLimit}
            totalResult={totalResult}
            onGridPagingLimitChange={onGridPagingLimitChange}
            setGridPagingPage={setGridPagingPage}
            downloadUserFileHandler={downloadUserFileHandler}
            loadVersionHandler={loadVersionHandler}
            versions={versions}
            sideMenu={sideMenu}
            setSideMenu={setSideMenu}
            loading={gridLoading}
            onFilter={onFilter}
            filterValue={filterValues.child}
            orderRowByHeader={orderRowByHeader}
          />
        </StyledGridContainer>
      </StyledContentContainer>
    </StyledRoot>
  );
};

export default UserFileSpaceItem;
