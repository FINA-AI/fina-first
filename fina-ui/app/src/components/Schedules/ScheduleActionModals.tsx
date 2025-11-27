import ClosableModal from "../common/Modal/ClosableModal";
import AddScheduleModal from "./AddNew/AddScheduleModal";
import DeleteForm from "../common/Delete/DeleteForm";
import SchedulesDeleteErrorModal from "./Modals/SchedulesDeleteErrorModal";
import SchedulesDueDateModal from "./Modals/SchedulesDueDateModal";
import ExistingScheduleGrid from "./Modals/ExistingScheduleGrid";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScheduleType } from "../../types/schedule.type";
import { FiType } from "../../types/fi.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import { PeriodSubmitDataType, PeriodType } from "../../types/period.type";

interface ScheduleActionModalsProps {
  isAddNewOpen: boolean;
  setAddNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fis?: FiType[];
  returns: ReturnDefinitionType[];
  loadScheduleData: (filteredData: any) => void;
  returnTypes: ReturnType[];
  periodTypes: PeriodType[];
  deleteSelectedRowsModal: boolean;
  setDeleteSelectedRowsModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAllRows: () => void;
  deleteAllModal: boolean;
  setDeleteAllModal: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleDeleteErrorModal: boolean;
  setScheduleDeleteErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleDueEditModal: {
    isOpen: boolean;
    row?: ScheduleType;
    multi: boolean;
    rows?: ScheduleType[];
  };
  setScheduleDueEditModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      row?: ScheduleType;
      multi: boolean;
    }>
  >;
  selectedRows: ScheduleType[];
  deleteSingleRowModal: { isOpen: boolean; row?: ScheduleType };
  setDeleteSingleRowModal: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; row?: ScheduleType }>
  >;
  deleteRow: (row: ScheduleType) => void;
  onDataUpdateCallBackFunction: any;
  deleteSelectedRows: () => void;
  filter: any;
}

const ScheduleActionModals: FC<ScheduleActionModalsProps> = ({
  isAddNewOpen,
  setAddNewOpen,
  fis,
  returns,
  loadScheduleData,
  returnTypes,
  periodTypes,
  deleteSelectedRowsModal,
  setDeleteSelectedRowsModal,
  deleteAllRows,
  deleteAllModal,
  setDeleteAllModal,
  deleteSelectedRows,
  scheduleDeleteErrorModal,
  setScheduleDeleteErrorModal,
  scheduleDueEditModal,
  setScheduleDueEditModal,
  deleteSingleRowModal,
  setDeleteSingleRowModal,
  deleteRow,
  onDataUpdateCallBackFunction,
  filter,
}) => {
  const { t } = useTranslation();
  const [existingSchedulesModal, setExistingScheduleModal] = useState<{
    isOpen: boolean;
    data?: ScheduleType[];
  }>({
    isOpen: false,
    data: undefined,
  });
  const emptySchedule: ScheduleType = {
    id: 0,
    comment: "",
    delay: 0,
    delayHour: 0,
    delayMinute: 0,
    fi: {} as FiType,
    period: {} as PeriodSubmitDataType,
    returnDefinition: {} as ReturnDefinitionType,
  };
  return (
    <>
      {isAddNewOpen && (
        <ClosableModal
          onClose={() => setAddNewOpen(false)}
          open={isAddNewOpen}
          includeHeader={true}
          disableBackdropClick={true}
          title={t("addNew")}
          width={1300}
          height={580}
        >
          <AddScheduleModal
            setAddNewOpen={setAddNewOpen}
            setExistingScheduleModal={setExistingScheduleModal}
            fis={fis}
            returns={returns}
            loadScheduleData={loadScheduleData}
            returnTypes={returnTypes}
            periodTypes={periodTypes}
            filter={filter}
          />
        </ClosableModal>
      )}
      {deleteSelectedRowsModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("menu_schedules")}
          isDeleteModalOpen={deleteSelectedRowsModal}
          setIsDeleteModalOpen={setDeleteSelectedRowsModal}
          onDelete={deleteSelectedRows}
          showConfirm={false}
        />
      )}
      {deleteAllModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("all")}
          isDeleteModalOpen={deleteAllModal}
          setIsDeleteModalOpen={setDeleteAllModal}
          onDelete={deleteAllRows}
          showConfirm={false}
        />
      )}
      {scheduleDeleteErrorModal && (
        <SchedulesDeleteErrorModal
          onClose={() => setScheduleDeleteErrorModal(false)}
          onOpen={scheduleDeleteErrorModal}
          bodyText={t("schedulesCouldNotDeletedCount", {
            schedulesLength: 10,
          })}
          headerText={t("couldNotBeDeleted")}
        />
      )}
      {scheduleDueEditModal.isOpen && (
        <SchedulesDueDateModal
          onClose={() =>
            setScheduleDueEditModal({
              isOpen: false,
              row: undefined,
              multi: false,
            })
          }
          onOpen={scheduleDueEditModal.isOpen}
          isSingle={!scheduleDueEditModal.multi}
          filter={filter}
          data={
            !scheduleDueEditModal.multi
              ? scheduleDueEditModal.row
              : emptySchedule
          }
          fis={fis}
          returns={returns}
          onDataUpdateCallBackFunction={onDataUpdateCallBackFunction}
          returnTypes={returnTypes}
        />
      )}
      {deleteSingleRowModal.isOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("schedule")}
          isDeleteModalOpen={deleteSingleRowModal.isOpen}
          setIsDeleteModalOpen={() =>
            setDeleteSingleRowModal({ isOpen: false, row: undefined })
          }
          onDelete={() => {
            if (deleteSingleRowModal.row) {
              deleteRow(deleteSingleRowModal.row);
              setDeleteSingleRowModal({ isOpen: false, row: undefined });
            }
          }}
          showConfirm={false}
        />
      )}
      {existingSchedulesModal.isOpen && (
        <ClosableModal
          onClose={() =>
            setExistingScheduleModal({ isOpen: false, data: undefined })
          }
          open={existingSchedulesModal.isOpen}
          includeHeader={true}
          disableBackdropClick={true}
          title={t("existingSchedules")}
          width={1300}
          height={580}
        >
          <ExistingScheduleGrid data={existingSchedulesModal.data ?? []} />
        </ClosableModal>
      )}
    </>
  );
};

export default ScheduleActionModals;
