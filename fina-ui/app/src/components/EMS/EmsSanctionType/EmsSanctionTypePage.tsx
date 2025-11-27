import React, { useState } from "react";
import { Box } from "@mui/system";
import EmsSanctionTypeToolbar from "./EmsSanctionTypeToolbar";
import GridTable from "../../common/Grid/GridTable";
import { SanctionDataType } from "../../../types/sanction.type";
import Paging from "../../common/Paging/Paging";
import EmsSanctionTypeModal from "./EmsSanctionTypeModal";
import { useTranslation } from "react-i18next";
import DeleteForm from "../../common/Delete/DeleteForm";
import { FieldSize } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface EmsSanctionTypePageProps {
  columns: any[];
  loading: boolean;
  rowsLen: number;
  rows: SanctionDataType[];
  setRows: (rows: SanctionDataType[]) => void;
  setRowPerPage: (number: number) => void;
  setActivePage: (number: number) => void;
  pagingPage: number;
  initialRowsPerPage: number;
  currSanctionType: any;
  setCurrSanctionType: React.Dispatch<React.SetStateAction<any>>;
  deleteHandler: () => void;
  onRefresh: () => void;
  onSubmitHandler: (sanctionType: SanctionDataType) => void;
  getSanctionTypesListHandler: () => void;
  sanctionTypesList: string[];
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  marginTopBottom: "20px",
  borderRadius: "4px",
  overflow: "hidden",
  backgroundColor: theme.palette.paperBackground,
  minHeight: "0px",
}));

const StyledBody = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingTop: 0,
  overflow: "hidden",
});

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
}));

const EmsSanctionTypePage: React.FC<EmsSanctionTypePageProps> = ({
  columns,
  loading,
  rowsLen,
  rows,
  setRowPerPage,
  setActivePage,
  pagingPage,
  initialRowsPerPage,
  currSanctionType,
  setCurrSanctionType,
  deleteHandler,
  onRefresh,
  onSubmitHandler,
  getSanctionTypesListHandler,
  sanctionTypesList,
  setRows,
}) => {
  const { t } = useTranslation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <StyledRoot
      display={"flex"}
      flexDirection={"column"}
      data-testid={"sanction-types-page"}
    >
      <Box>
        <EmsSanctionTypeToolbar
          setShowAddModal={setShowAddModal}
          setShowDeleteModal={setShowDeleteModal}
          currSanctionType={currSanctionType}
          setCurrSanctionType={setCurrSanctionType}
          onRefresh={onRefresh}
        />
      </Box>

      <StyledBody height={"100%"}>
        <GridTable
          size={FieldSize.SMALL}
          columns={columns}
          rows={rows}
          loading={loading}
          selectedRows={currSanctionType ? [currSanctionType] : []}
          rowOnClick={(row: any, deselect: any) => {
            if (deselect) {
              setCurrSanctionType(null);
            } else {
              setCurrSanctionType(row);
            }
          }}
          setRows={setRows}
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
        <EmsSanctionTypeModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          currSanctionType={currSanctionType}
          onSubmitHandler={onSubmitHandler}
          getSanctionTypesListHandler={getSanctionTypesListHandler}
          sanctionTypesList={sanctionTypesList}
        />
      )}
      {showDeleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("sanctiontype")}
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

export default EmsSanctionTypePage;
