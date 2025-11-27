import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserFile } from "../../../types/userFileSpace.type";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";
import SearchField from "../../common/Field/SearchField";

interface UserFileSpaceMainPageProps {
  data: UserFile[];
  setData: (data: UserFile[]) => void;
  columnHeaders: GridColumnType[];
  pagingPage: number;
  onPagingLimitChange: (limit: number) => void;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  totalResult: number;
  loading: boolean;
  onFilter: (filterByName: string) => void;
  onFilterClear: () => void;
  orderRowByHeader?: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  width: "100%",
});

const StyledGridWrapper = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  backgroundColor: theme.palette.paperBackground,
  marginTop: 16,
  borderRadius: 4,
}));

const StyledTabName = styled(Typography)(({ theme }: any) => ({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: "24px",
  color: theme.palette.textColor,
}));

const UserFileSpaceMainPage: React.FC<UserFileSpaceMainPageProps> = ({
  data,
  setData,
  columnHeaders,
  pagingPage,
  onPagingLimitChange,
  pagingLimit,
  setPagingPage,
  totalResult,
  loading,
  onFilter,
  onFilterClear,
  orderRowByHeader,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <StyledRoot>
      <StyledTabName>{t("userFileSpace")}</StyledTabName>
      <StyledGridWrapper>
        <Box
          sx={{
            padding: "8px 16px",
          }}
        >
          <SearchField
            withFilterButton={false}
            onFilterClick={(val) => onFilter(val)}
            onClear={onFilterClear}
            width={"275px"}
          />
        </Box>
        <Box sx={{ height: "100%", minHeight: 0 }}>
          <GridTable
            loading={loading}
            columns={columnHeaders}
            rows={data}
            setRows={setData}
            selectedRows={[]}
            rowOnClick={(row: UserFile) => {
              history.push(`/userfilespace/${row.name}`);
            }}
            orderRowByHeader={orderRowByHeader}
          />
        </Box>
        <Box
          sx={(theme: any) => ({ ...theme.pagePaging({ size: "default" }) })}
        >
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => setPagingPage(number)}
            totalNumOfRows={totalResult}
            initialPage={pagingPage}
            initialRowsPerPage={pagingLimit}
          />
        </Box>
      </StyledGridWrapper>
    </StyledRoot>
  );
};

export default UserFileSpaceMainPage;
