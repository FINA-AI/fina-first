import { Box } from "@mui/system";
import React, { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Paging from "../common/Paging/Paging";
import CEMSHeader from "./CEMSHeader";
import { useHistory, useRouteMatch } from "react-router-dom";
import GridTable from "../common/Grid/GridTable";
import { styled } from "@mui/material/styles";

const StyledRootGrid = styled(Grid)({
  overflow: "hidden",
  height: "100%",
  borderRadius: 8,
  paddingTop: 10,
  display: "flex",
  flexDirection: "column",
});

const StyledMainLayout = styled(Box)({
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledFooter = styled(Grid)(({ theme }) => ({
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

const CEMSPage = ({
  inspections,
  onDeleteFunction,
  loading,
  columns,
  setColumns,
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  totalResults,
  setInspections,
  filterOnChangeFunction,
  orderRowByHeader,
  onExport,
  addNewFunction,
  onFilterClickFunc,
  columnFilterConfig,
}) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState([]);
  const [currInspection, setCurrInspection] = useState();
  const history = useHistory();
  let { path } = useRouteMatch();

  const rowOnClick = (row) => {
    setCurrInspection(row);
    history.push(`${path}/${row.id}`);
  };

  return (
    <StyledMainLayout>
      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
        {t("cems")}
      </Typography>
      <StyledRootGrid>
        <Grid>
          <StyledPaper>
            <CEMSHeader
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              onDeleteFunction={onDeleteFunction}
              currInspection={currInspection}
              onExport={() => onExport(selectedRows)}
              addNewFunction={addNewFunction}
              onFilterClickFunc={onFilterClickFunc}
              columns={columns}
              setColumns={setColumns}
            />
          </StyledPaper>
        </Grid>
        <StyledGridContainer>
          <StyledGridItem>
            <StyledPaper>
              <GridTable
                rowOnClick={(row) => rowOnClick(row)}
                columns={columns}
                columnFilterConfig={columnFilterConfig}
                rows={inspections}
                setRows={setInspections}
                onCheckboxClick={(currRow, selectedRows) => {
                  setSelectedRows(selectedRows);
                }}
                loading={loading}
                checkboxEnabled={true}
                filterOnChangeFunction={filterOnChangeFunction}
                orderRowByHeader={orderRowByHeader}
                selectedRows={selectedRows}
              />
            </StyledPaper>
          </StyledGridItem>
        </StyledGridContainer>
        <StyledFooter>
          <StyledFooterGrid>
            <Paging
              onRowsPerPageChange={(number) => onPagingLimitChange(number)}
              onPageChange={(number) => setPagingPage(number)}
              totalNumOfRows={totalResults}
              initialPage={pagingPage}
              initialRowsPerPage={pagingLimit}
            />
          </StyledFooterGrid>
        </StyledFooter>
      </StyledRootGrid>
    </StyledMainLayout>
  );
};

CEMSPage.propTypes = {
  onSaveClickFunction: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  inspections: PropTypes.array.isRequired,
  setInspections: PropTypes.func.isRequired,
  onDeleteFunction: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  totalResults: PropTypes.number.isRequired,
  pagingPage: PropTypes.number.isRequired,
  pagingLimit: PropTypes.number.isRequired,
  onPagingLimitChange: PropTypes.func,
  setPagingPage: PropTypes.func,
  filterOnChangeFunction: PropTypes.func.isRequired,
  orderRowByHeader: PropTypes.func,
  onExport: PropTypes.func,
  addNewFunction: PropTypes.func,
  onFilterClickFunc: PropTypes.func,
  setColumns: PropTypes.func,
  columnFilterConfig: PropTypes.array,
};

export default CEMSPage;
