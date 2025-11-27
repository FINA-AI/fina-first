import React from "react";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import { Box } from "@mui/system";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../types/common.type";
import { recomendationDataType } from "../../../types/recomendation.type";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { EMS_RECOMMENDATIONS_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import { styled } from "@mui/material/styles";

interface EmsRecommendationsPageProps {
  columns: GridColumnType[];
  columnFilterConfig: columnFilterConfigType[];
  filterOnChangeFunction: (obj: any) => void;
  pagingPage: number;
  setActivePage: (number: number) => void;
  initialRowsPerPage: number;
  setRowPerPage: (limit: number) => void;
  rowsLen: number;
  rows: recomendationDataType[];
  loading: boolean;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  marginTopBottom: "20px",
  borderRadius: "4px",
  overflow: "hidden",
  background: theme.palette.paperBackground,
  minHeight: "0px",
}));

const StyledBody = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: theme.palette.paperBackground,
  paddingTop: 0,
  overflow: "hidden",
}));

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
}));

const EmsRecommendationsPage: React.FC<EmsRecommendationsPageProps> = ({
  columns,
  columnFilterConfig,
  filterOnChangeFunction,
  pagingPage,
  setActivePage,
  initialRowsPerPage,
  setRowPerPage,
  rowsLen,
  rows,
  loading,
  setColumns,
}) => {
  return (
    <StyledRoot
      display={"flex"}
      flexDirection={"column"}
      data-testid={"recommendations-page"}
    >
      <StyledBody height={"100%"}>
        <Box padding={"8px"}>
          <TableCustomizationButton
            columns={columns}
            setColumns={setColumns}
            isDefault={false}
            hasColumnFreeze={true}
            tableKey={EMS_RECOMMENDATIONS_TABLE_KEY}
          />
        </Box>
        <GridTable
          columns={columns}
          columnFilterConfig={columnFilterConfig}
          rows={rows}
          filterOnChangeFunction={filterOnChangeFunction}
          loading={loading}
          size={"small"}
        />
      </StyledBody>
      <StyledPagingBox>
        <Paging
          onRowsPerPageChange={(number: number) => setRowPerPage(number)}
          onPageChange={(number: number) => setActivePage(number)}
          totalNumOfRows={rowsLen}
          initialPage={pagingPage}
          initialRowsPerPage={initialRowsPerPage}
          isMini={false}
          size={"small"}
        />
      </StyledPagingBox>
    </StyledRoot>
  );
};

export default EmsRecommendationsPage;
