import { Box } from "@mui/material";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import FILegalPersonConfigurationPageBody from "./FILegalPersonConfigurationPageBody";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Paging from "../../../../common/Paging/Paging";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import FILegalPersonConfigurationForm from "./FILegalPersonConfigurationForm";
import RestoreLegalPersonModal from "../../../../common/Modal/RestoreLegalPersonModal";
import { styled } from "@mui/material/styles";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../../../../types/common.type";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  boxSizing: "border-box",
  background: theme.palette.paperBackground,
  padding: theme.toolbar.padding,
  margin: 0,
  display: "flex",
  alignItems: "center",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  zIndex: theme.zIndex.modal,
  ...theme.pagePaging({ size: "default" }),
}));

interface Props {
  pagingPage: number;
  pagingLimit: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  personsLength: number;
  loading: boolean;
  setLoading?: (loading: boolean) => void;
  columns: GridColumnType[];
  columnFilterConfig: columnFilterConfigType[];
  configLegalPersons: LegalPersonDataType[];
  setConfigLegalPersons: (rows: LegalPersonDataType[]) => void;
  addRow: (row: LegalPersonDataType) => void;
  deleteRow: (row: LegalPersonDataType) => void;
  filterOnChangeFunction: (filter: FilterType) => void;
  restoreModalOpen: boolean;
  setRestoreModalOpen: (open: boolean) => void;
  onRestorePersonClick: () => void;
  restorePerson?: LegalPersonDataType;
  orderRowByHeader: (field: string, direction: string) => void;
}

const FILegalPersonConfigurationMainPage: React.FC<Props> = ({
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  personsLength,
  loading,
  columns,
  columnFilterConfig,
  configLegalPersons,
  addRow,
  deleteRow,
  filterOnChangeFunction,
  setRestoreModalOpen,
  restoreModalOpen,
  onRestorePersonClick,
  restorePerson,
  setConfigLegalPersons,
  orderRowByHeader,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  const closeModal = () => {
    setModalOpen(false);
  };

  const onSave = (row: LegalPersonDataType) => {
    addRow(row);
    closeModal();
  };

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <StyledToolbar display={"flex"} justifyContent={"flex-end"}>
        <div
          style={{
            order: 2,
            paddingRight: "23px",
          }}
        >
          <PrimaryBtn
            data-testid={"addBtn"}
            onClick={() => {
              setModalOpen(true);
            }}
            endIcon={<AddIcon />}
          >
            {t("addNew")}
          </PrimaryBtn>
        </div>

        <ClosableModal
          onClose={() => {
            setModalOpen(false);
          }}
          open={isModalOpen}
          includeHeader={true}
          width={400}
          title={t("legalPerson")}
          disableBackdropClick={true}
        >
          <FILegalPersonConfigurationForm
            closeModal={closeModal}
            onSave={(row) => onSave(row)}
          />
        </ClosableModal>
      </StyledToolbar>

      <Box
        flex={1}
        sx={{
          height: "100%",
          overflow: "auto",
        }}
      >
        <FILegalPersonConfigurationPageBody
          loading={loading}
          columns={columns}
          columnFilterConfig={columnFilterConfig}
          configLegalPersons={configLegalPersons}
          setConfigLegalPersons={setConfigLegalPersons}
          deleteRow={deleteRow}
          filterOnChangeFunction={filterOnChangeFunction}
          orderRowByHeader={orderRowByHeader}
        />
      </Box>

      <StyledFooter>
        <Paging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={personsLength}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StyledFooter>

      <RestoreLegalPersonModal
        setIsModalOpen={setRestoreModalOpen}
        isModalOpen={restoreModalOpen}
        onRestore={() => {
          onRestorePersonClick();
          setModalOpen(false);
        }}
        name={restorePerson?.name}
      />
    </Box>
  );
};

export default FILegalPersonConfigurationMainPage;
