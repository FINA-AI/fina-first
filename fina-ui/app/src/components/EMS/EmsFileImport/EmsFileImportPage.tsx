import Box from "@mui/material/Box";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EmsFileImportToolbar from "./EmsFileImportToolbar";
import { FieldSize, GridColumnType } from "../../../types/common.type";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import { fileImportDataType } from "../../../types/fileImport.type";
import EmsFileImportModal from "./EmsFileImportModal";
import { FiType } from "../../../types/fi.type";
import EmsFileImportErrorModal from "./EmsFileImportErrorModal";
import { styled } from "@mui/material/styles";

interface EmsFileImportPageProps {
  columns: GridColumnType[];
  setRowPerPage: React.Dispatch<React.SetStateAction<any>>;
  setActivePage: React.Dispatch<React.SetStateAction<any>>;
  rowsLen: number;
  pagingPage: number;
  initialRowsPerPage: number;
  loading: boolean;
  rows: fileImportDataType[];
  setRows: (data: fileImportDataType[]) => void;
  onRefresh: () => void;
  fiTypes: FiType[];
  addNewConfig: (payload: FormData) => void;
  error: { open: boolean; errors: any; warnings: any };
  setError: (value: { open: boolean; errors: any; warnings: any }) => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  marginTopBottom: "20px",
  overflow: "hidden",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledBody = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingTop: 0,
  overflow: "hidden",
});

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: "10px",
  height: "16px",
  fontSize: "13px",
  lineHeight: "16px",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  minHeight: "0px",
  borderTop: theme.palette.borderColor,
}));

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
}));

const EmsFileImportPage: React.FC<EmsFileImportPageProps> = ({
  columns,
  setRowPerPage,
  setActivePage,
  rowsLen,
  pagingPage,
  initialRowsPerPage,
  loading,
  rows,
  setRows,
  onRefresh,
  fiTypes,
  addNewConfig,
  error,
  setError,
  setColumns,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <StyledRoot
      display={"flex"}
      flexDirection={"column"}
      data-testid={"file-import-page"}
    >
      <StyledHeader>
        {t("file")} {t("import")}
      </StyledHeader>

      <EmsFileImportToolbar
        onRefresh={onRefresh}
        setShowModal={setShowModal}
        columns={columns}
        setColumns={setColumns}
      />

      <StyledBody height={"100%"}>
        <GridTable
          columns={columns}
          rows={rows}
          setRows={setRows}
          loading={loading}
          size={FieldSize.SMALL}
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

      {showModal && (
        <EmsFileImportModal
          setShowModal={setShowModal}
          showModal={showModal}
          fiTypes={fiTypes}
          addNewConfig={addNewConfig}
        />
      )}
      {error.open && (
        <EmsFileImportErrorModal
          importFileData={error}
          setImportFileData={setError}
        />
      )}
    </StyledRoot>
  );
};

export default EmsFileImportPage;
