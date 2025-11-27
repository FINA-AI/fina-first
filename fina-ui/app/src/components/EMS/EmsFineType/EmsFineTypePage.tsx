import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import EmsFineTypeMainTable from "./EmsFineTypeMainTable";
import EmsFineTypeToolbar from "./EmsFineTypeToolbar";
import React, { useState } from "react";
import EmsFineTypeModal from "./EmsFineTypeModal";
import Paging from "../../common/Paging/Paging";
import { SanctionFineType } from "../../../types/sanction.type";
import DeleteForm from "../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import { FiType } from "../../../types/fi.type";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface EmsFineTypePageProps {
  columns: GridColumnType[];
  data: SanctionFineType[];
  pagingPage: number;
  setPagingPage: (value: number) => void;
  pagingLimit: number;
  setPagingLimit: (value: number) => void;
  totalResults: number;
  fiTypes: FiType[];
  setData: (value: SanctionFineType[]) => void;
  currFineType: SanctionFineType | null;
  setCurrFineType: (value: SanctionFineType | null) => void;
  deleteHandler: () => void;
  onRefresh: (value: string) => void;
  onSubmit: (value: SanctionFineType) => void;
  setActiveTab: (value: string) => void;
  activeTab: string | null;
  loading: boolean;
  setColumns: React.Dispatch<React.SetStateAction<any>>;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
  overflow: "hidden",
}));

const StyledPagePagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const EmsFineTypePage: React.FC<EmsFineTypePageProps> = ({
  columns,
  pagingPage,
  setPagingPage,
  pagingLimit,
  setPagingLimit,
  totalResults,
  fiTypes,
  setData,
  data,
  currFineType,
  setCurrFineType,
  deleteHandler,
  onRefresh,
  onSubmit,
  setActiveTab,
  activeTab,
  loading,
  setColumns,
  orderRowByHeader,
}) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <Box height="100%" width="100%" data-testid={"fine-type-page"}>
      <Grid height="100%" width="100%">
        <StyledRoot>
          <StyledRoot flex={1}>
            <EmsFineTypeToolbar
              setOpenModal={setOpenModal}
              currFineType={currFineType}
              setCurrFineType={setCurrFineType}
              setShowDeleteModal={setShowDeleteModal}
              activeTab={activeTab}
              onRefresh={onRefresh}
              setColumns={setColumns}
              columns={columns}
            />
            <StyledRoot>
              <EmsFineTypeMainTable
                columns={columns}
                fiTypes={fiTypes}
                data={data}
                setData={setData}
                setCurrFineType={setCurrFineType}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                loading={loading}
                orderRowByHeader={orderRowByHeader}
              />
            </StyledRoot>
          </StyledRoot>
          <StyledPagePagingBox>
            <Paging
              onRowsPerPageChange={(number) => setPagingLimit(number)}
              onPageChange={(number) => setPagingPage(number)}
              totalNumOfRows={totalResults}
              initialPage={pagingPage}
              initialRowsPerPage={pagingLimit}
              size={"small"}
            />
          </StyledPagePagingBox>
        </StyledRoot>
      </Grid>

      {openModal && (
        <EmsFineTypeModal
          setOpenModal={setOpenModal}
          openModal={openModal}
          currFineType={currFineType}
          fiTypes={fiTypes}
          onSubmit={onSubmit}
        />
      )}

      {showDeleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("finetype")}
          isDeleteModalOpen={showDeleteModal}
          setIsDeleteModalOpen={setShowDeleteModal}
          onDelete={() => {
            setShowDeleteModal(false);
            deleteHandler();
          }}
        />
      )}
    </Box>
  );
};

export default EmsFineTypePage;
