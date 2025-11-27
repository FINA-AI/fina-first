import { Box } from "@mui/material";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import FIPersonConfigurationPageBody from "./FIPersonConfigurationPageBody";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Paging from "../../../../common/Paging/Paging";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import FIPersonConfigurationForm from "./FIPersonConfigurationForm";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import RestoreLegalPersonModal from "../../../../common/Modal/RestoreLegalPersonModal";
import { styled } from "@mui/material/styles";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../../../../types/common.type";
import { ConfigPhysicalPersonDataType } from "../../../../../types/physicalPerson.type";

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  boxSizing: "border-box",
  background: theme.palette.paperBackground,
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "flex-end",
  zIndex: theme.zIndex.modal,
  boxShadow: "3px -20px 8px -4px #bababa1a",
  position: "relative",
  height: theme.general.footerHeight,
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
  configPersons: ConfigPhysicalPersonDataType[];
  setConfigPersons: React.Dispatch<
    React.SetStateAction<ConfigPhysicalPersonDataType[]>
  >;
  deleteRow: (row: ConfigPhysicalPersonDataType) => void;
  addRow: (person: ConfigPhysicalPersonDataType) => void;
  deleteMultipleRows: () => void;
  onPersonRowClick: (row: ConfigPhysicalPersonDataType) => void;
  onPersonRowEditClick: (row: ConfigPhysicalPersonDataType) => void;
  filterOnChangeFunction: (filters: FilterType[]) => void;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
  restoreModalOpen: boolean;
  setRestoreModalOpen: (isOpen: boolean) => void;
  onRestorePersonClick: () => void;
  restorePerson?: ConfigPhysicalPersonDataType;
}

const FIPersonConfigurationMainPage: React.FC<Props> = ({
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  personsLength,
  loading,
  columns,
  columnFilterConfig,
  configPersons,
  setConfigPersons,
  deleteRow,
  addRow,
  deleteMultipleRows,
  onPersonRowClick,
  onPersonRowEditClick,
  filterOnChangeFunction,
  setRestoreModalOpen,
  restoreModalOpen,
  onRestorePersonClick,
  restorePerson,
  orderRowByHeader,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const onSave = (fiPerson: ConfigPhysicalPersonDataType) => {
    addRow(fiPerson);
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
            data-testid={"fiConfig-person-addNewBtn"}
            endIcon={<AddIcon />}
            children={<>{t("addNew")}</>}
            onClick={() => {
              setModalOpen(true);
            }}
          />
        </div>

        <ClosableModal
          onClose={() => {
            setModalOpen(false);
          }}
          open={isModalOpen}
          includeHeader={true}
          width={400}
          title={t("physicalperson")}
          disableBackdropClick={true}
        >
          <FIPersonConfigurationForm closeModal={closeModal} onSave={onSave} />
        </ClosableModal>
      </StyledToolbar>

      <Box flex={1} sx={{ height: "100%", overflow: "auto" }}>
        <FIPersonConfigurationPageBody
          loading={loading}
          columns={columns}
          columnFilterConfig={columnFilterConfig}
          rows={configPersons}
          setRows={setConfigPersons}
          deleteRow={deleteRow}
          onPersonRowClick={onPersonRowClick}
          onPersonRowEditClick={onPersonRowEditClick}
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
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("physicalperson") + "s" + "?"}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          deleteMultipleRows();
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
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

// @ts-ignore
export default FIPersonConfigurationMainPage;
