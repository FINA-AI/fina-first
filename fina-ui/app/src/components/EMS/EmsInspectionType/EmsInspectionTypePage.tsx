import React, { FC, useState } from "react";
import InspectionTypeToolbar from "./InspectionTypeToolbar";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import { Box } from "@mui/system";
import InspectionTypeAddModal from "./InspectionTypeAddModal";
import DeleteForm from "../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import { EmsInspectionType } from "../../../types/inspection.type";
import { FieldSize, GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface EmsInspectionTypePageProps {
  columns: GridColumnType[];
  rows: EmsInspectionType[];
  setRowPerPage: React.Dispatch<React.SetStateAction<any>>;
  pagingPage: number;
  initialRowsPerPage: number;
  setActivePage: React.Dispatch<React.SetStateAction<any>>;
  rowsLen: number;
  deleteHandler: () => void;
  currInspectionType: any;
  onSubmitHandler: (inspectionType: {
    id?: number;
    names: string;
    descriptions: string;
  }) => void;
  setCurrInspectionType: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  onRefresh: () => void;
  setRows: (rows: EmsInspectionType[]) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  marginTopBottom: "20px",
  borderRadius: "4px",
  overflow: "hidden",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
}));

const StyledBody = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingTop: 0,
  overflow: "hidden",
});

const EmsInspectionTypePage: FC<EmsInspectionTypePageProps> = ({
  columns,
  rows,
  setRowPerPage,
  pagingPage,
  initialRowsPerPage,
  setActivePage,
  rowsLen,
  deleteHandler,
  currInspectionType,
  onSubmitHandler,
  setCurrInspectionType,
  loading,
  onRefresh,
  setRows,
}) => {
  const { t } = useTranslation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <StyledRoot
      display={"flex"}
      flexDirection={"column"}
      data-testid={"inspection-type-page"}
    >
      <Box>
        <InspectionTypeToolbar
          setShowAddModal={setShowAddModal}
          setShowDeleteModal={setShowDeleteModal}
          currInspectionType={currInspectionType}
          setCurrInspectionType={setCurrInspectionType}
          onRefresh={onRefresh}
        />
      </Box>

      <StyledBody height={"100%"}>
        <GridTable
          columns={columns}
          size={FieldSize.SMALL}
          rows={rows}
          singleRowSelect={true}
          selectedRows={currInspectionType ? [currInspectionType] : []}
          rowOnClick={(row: any, deselect: any) => {
            if (deselect) {
              setCurrInspectionType(null);
            } else {
              setCurrInspectionType(row);
            }
          }}
          setRows={setRows}
          loading={loading}
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
      {showAddModal && (
        <InspectionTypeAddModal
          currInspectionType={currInspectionType}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          onSubmitHandler={onSubmitHandler}
        />
      )}
      {showDeleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={"inspection type"}
          isDeleteModalOpen={showDeleteModal}
          setIsDeleteModalOpen={setShowDeleteModal}
          onDelete={() => {
            setShowDeleteModal(false);
            deleteHandler();
          }}
        />
      )}
    </StyledRoot>
  );
};

export default EmsInspectionTypePage;
