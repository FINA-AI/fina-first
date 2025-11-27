import { Box, Grid, Paper } from "@mui/material";
import Paging from "../../common/Paging/Paging";
import React, { useState } from "react";
import PropTypes from "prop-types";
import CEMSRecommendationsHeader from "./CEMSRecommendationsHeader";
import GridTable from "../../common/Grid/GridTable";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledRootGrid = styled(Box)({
  overflow: "hidden",
  height: "100%",
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
});

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledGridItem = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
});

const StyledFooterRoot = styled(Grid)(({ theme }) => ({
  height: theme.general.footerHeight,
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderTop: "1px solid #EAEBF0",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledFooterGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  height: theme.general.footerHeight,
}));

const CEMSRecommendationsPage = ({
  loading,
  columns,
  columnFilterConfig,
  setColumns,
  data,
  totalResults,
  onPagingLimitChange,
  deleteRecommendationHandler,
  filterOnChangeFunction,
  setFilter,
  filter,
  inspection,
  onExport,
  orderRowByHeader,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const history = useHistory();

  const url = history.location.pathname;

  return (
    <StyledRootGrid>
      <Grid>
        <StyledPaper>
          <CEMSRecommendationsHeader
            columns={columns}
            setColumns={setColumns}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            deleteRecommendationHandler={deleteRecommendationHandler}
            filter={filter}
            setFilter={setFilter}
            inspection={inspection}
            onExport={() => onExport(selectedRows)}
          />
        </StyledPaper>
      </Grid>
      <StyledGridContainer>
        <StyledGridItem>
          <StyledPaper>
            <GridTable
              rowOnClick={(row) => {
                history.push(`${url}/${row.id}`);
              }}
              columns={columns}
              columnFilterConfig={columnFilterConfig}
              rows={data ? data : []}
              setRows={() => {}}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              onCheckboxClick={(currRow, selectedRows) => {
                setSelectedRows(selectedRows);
              }}
              loading={loading}
              checkboxEnabled={true}
              filterOnChangeFunction={filterOnChangeFunction}
              orderRowByHeader={orderRowByHeader}
            />
          </StyledPaper>
        </StyledGridItem>
      </StyledGridContainer>
      <StyledFooterRoot>
        <StyledFooterGrid>
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => setFilter({ ...filter, page: number })}
            totalNumOfRows={totalResults}
            initialPage={filter.page}
            initialRowsPerPage={filter.limit}
          />
        </StyledFooterGrid>
      </StyledFooterRoot>
    </StyledRootGrid>
  );
};

CEMSRecommendationsPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  columns: PropTypes.array.isRequired,
  totalResults: PropTypes.number.isRequired,
  onPagingLimitChange: PropTypes.func,
  data: PropTypes.array,
  deleteRecommendationHandler: PropTypes.func,
  filterOnChangeFunction: PropTypes.func,
  setFilter: PropTypes.func,
  filter: PropTypes.object,
  inspection: PropTypes.object,
  onExport: PropTypes.func,
  orderRowByHeader: PropTypes.func,
  setColumns: PropTypes.func,
  columnFilterConfig: PropTypes.array,
};

export default CEMSRecommendationsPage;
