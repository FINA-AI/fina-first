import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { GridColumnType } from "../../../types/common.type";
import { EmsInspectionStatusHistoryType } from "../../../types/inspection.type";
import GridTable from "../../common/Grid/GridTable";
import ClosableModal from "../../common/Modal/ClosableModal";
import Paging from "../../common/Paging/Paging";
import React from "react";
import { EmsSanctionStatusHistoryType } from "../../../types/sanction.type";
import { styled } from "@mui/material/styles";

interface EmsInspectionStatusHistoryModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  columns: GridColumnType[];
  pagingPage: number;
  pagingLimit: number;
  totalResults: number;
  loading: boolean;
  rows: EmsInspectionStatusHistoryType[] | EmsSanctionStatusHistoryType[];
  setPagingPage: (value: number) => void;
  setPagingLimit: (value: number) => void;
}

const StyledModalBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  height: "100%",
  boxSizing: "border-box",
  flexDirection: "column",
});

const StyledPagesContainer = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const EmsEntityHistoryModal: React.FC<EmsInspectionStatusHistoryModalProps> = ({
  openModal,
  setOpenModal,
  columns,
  pagingPage,
  pagingLimit,
  totalResults,
  loading,
  rows,
  setPagingPage,
  setPagingLimit,
}: EmsInspectionStatusHistoryModalProps) => {
  const { t } = useTranslation();

  return (
    <ClosableModal
      open={openModal}
      height={600}
      width={1000}
      title={t("history")}
      onClose={() => {
        setOpenModal(false);
      }}
    >
      <StyledModalBox>
        <Box height={"100%"}>
          <GridTable
            columns={columns}
            loading={loading}
            rows={rows}
            size={"small"}
          />
        </Box>
        <StyledPagesContainer>
          <Paging
            onRowsPerPageChange={(number) => setPagingLimit(number)}
            onPageChange={(number) => setPagingPage(number)}
            totalNumOfRows={totalResults}
            initialPage={pagingPage}
            initialRowsPerPage={pagingLimit}
            size={"small"}
          />
        </StyledPagesContainer>
      </StyledModalBox>
    </ClosableModal>
  );
};

export default EmsEntityHistoryModal;
