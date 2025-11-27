import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import PropTypes from "prop-types";
import CEMSSanctionHeader from "./CEMSSanctionHeader";
import { styled } from "@mui/material/styles";

const StyledRootGrid = styled(Grid)({
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

const StyledFooterRoot = styled(Grid)(({ theme }) => ({
  height: theme.general.footerHeight,
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderTop: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledFooterGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  height: theme.general.footerHeight,
}));

const CEMSSanctionPage = ({
  loading,
  columns,
  columnFilterConfig,
  data,
  totalResults,
  onPagingLimitChange,
  deleteHandler,
  filterOnChangeFunction,
  setFilter,
  filter,
  onExport,
  orderRowByHeader,
  inspection,
  setColumns,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const history = useHistory();

  const url = history.location.pathname;

  return (
    <StyledRootGrid>
      <Grid>
        <Paper sx={{ width: "100%", height: "100%", boxShadow: "none" }}>
          <CEMSSanctionHeader
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            deleteHandler={deleteHandler}
            inspection={inspection}
            onExport={() => {
              onExport(selectedRows);
            }}
            columns={columns}
            setColumns={setColumns}
          />
        </Paper>
      </Grid>
      <StyledGridContainer>
        <Grid sx={{ paddingTop: "0px", height: "100%", width: "100%" }}>
          <Paper sx={{ width: "100%", height: "100%", boxShadow: "none" }}>
            <GridTable
              rowOnClick={(row) => {
                history.push(`${url}/${row.id}`);
              }}
              columns={columns}
              columnFilterConfig={columnFilterConfig}
              rows={data ? data : []}
              setRows={() => {}}
              onCheckboxClick={(currRow, selectedRows) => {
                setSelectedRows(selectedRows);
              }}
              loading={loading}
              checkboxEnabled={true}
              filterOnChangeFunction={filterOnChangeFunction}
              orderRowByHeader={orderRowByHeader}
              selectedRows={selectedRows}
            />
          </Paper>
        </Grid>
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

CEMSSanctionPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  columns: PropTypes.array.isRequired,
  totalResults: PropTypes.number.isRequired,
  onPagingLimitChange: PropTypes.func,
  data: PropTypes.array,
  deleteHandler: PropTypes.func,
  filterOnChangeFunction: PropTypes.func,
  setFilter: PropTypes.func,
  filter: PropTypes.object,
  onExport: PropTypes.func,
  orderRowByHeader: PropTypes.func,
  inspection: PropTypes.object,
  setColumns: PropTypes.func,
  columnFilterConfig: PropTypes.array,
};

export default CEMSSanctionPage;
