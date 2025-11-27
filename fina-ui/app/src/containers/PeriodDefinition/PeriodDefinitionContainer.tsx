import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  deletePeriodDefinition,
  deletePeriodsDefinitions,
  getPeriodDefinitions,
  savePeriodDefinition,
} from "../../api/services/periodDefinitionsService";
import { getPeriodTypes } from "../../api/services/periodTypesService";
import PeriodPage from "../../components/PeriodDefinition/Period/PeriodPage";
import { FilterTypes } from "../../util/appUtil";
import { PeriodSubmitDataType, PeriodType } from "../../types/period.type";
import { FilterType } from "../../types/common.type";

interface PeriodDefinitionContainerProps {
  selectedRows: PeriodSubmitDataType[];
  setSelectedRows: React.Dispatch<React.SetStateAction<PeriodSubmitDataType[]>>;
  deleteMultiPeriodsModal: boolean;
  setDeleteMultiPeriodsModal: (value: boolean) => void;
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  reloadPeriodData: boolean;
  setReloadPeriodData: (val: boolean) => void;
}

const PeriodDefinitionContainer: React.FC<PeriodDefinitionContainerProps> = ({
  selectedRows,
  setSelectedRows,
  deleteMultiPeriodsModal,
  setDeleteMultiPeriodsModal,
  modalOpen,
  setModalOpen,
  reloadPeriodData,
  setReloadPeriodData,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState<PeriodSubmitDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteSinglePeriodModal, setDeleteSinglePeriodModal] = useState<{
    isOpen: boolean;
    row: null | PeriodSubmitDataType;
  }>({
    isOpen: false,
    row: null,
  });
  const firstPage = 1;
  const [periodTypes, setPeriodTypes] = useState<PeriodType[]>([]);
  const [pagingPage, setPagingPage] = useState<number>(firstPage);
  const [pagingLimit, setPagingLimit] = useState<number>(25);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isExistingPeriodModalOpen, setIsExistingPeriodModalOpen] =
    useState<boolean>(false);
  const [existingPeriodDefinitions, setExistingPeriodDefinitions] = useState<
    PeriodSubmitDataType[]
  >([]);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<FilterType[]>([]);
  const [sortObj, setSortObj] = useState<{
    sortField: string;
    sortDir: string;
  }>({ sortField: "", sortDir: "" });

  useEffect(() => {
    loadPeriodTypes();
  }, []);

  useEffect(() => {
    if (reloadPeriodData) loadPeriodDefinitions();
  }, [reloadPeriodData]);

  useEffect(() => {
    loadPeriodDefinitions();
  }, [pagingPage, pagingLimit, filteredData, sortObj]);

  const loadPeriodDefinitions = (filterObj?: FilterType[]) => {
    setLoading(true);
    let page = filterObj && filterObj.length > 0 ? 1 : pagingPage;
    let filter = filterObj ? filterObj : filteredData;

    getPeriodDefinitions(
      page,
      pagingLimit,
      filter,
      sortObj.sortField,
      sortObj.sortDir
    )
      .then((res) => {
        let data = res.data;
        setRows(data.list);
        setTotalResults(data.totalResults);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
        if (reloadPeriodData) setReloadPeriodData(false);
      });
  };

  const filterOnChangeFunction = (filteredData: FilterType[]) => {
    let filter: any = {};
    for (let item of filteredData) {
      switch (item.type) {
        case FilterTypes.list:
          if (item.value) {
            filter[item.name] = [item.value];
          }
          break;
        case FilterTypes.number:
          if (item.value) {
            filter[item.name] = item.value;
          }
          break;
        case FilterTypes.datePicker:
          if (item.date) {
            filter[item.name] = item.date;
          }
          break;
        default: {
          filter[item.name] = item.value;
        }
      }
    }
    setFilteredData(filter);
    setPagingPage(firstPage);
  };

  const loadPeriodTypes = () => {
    getPeriodTypes()
      .then((result) => {
        setPeriodTypes(result.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const saveFunction = (data: PeriodSubmitDataType) => {
    setSaveLoading(true);
    let daysBetweenPeriod = data.daysBetweenPeriod ? data.daysBetweenPeriod : 0;
    let daysInAPeriod = data.daysInAPeriod ? data.daysInAPeriod : 0;
    if (data.id === 0) {
      savePeriodDefinition(data, daysBetweenPeriod, daysInAPeriod)
        .then((resp) => {
          if (resp.data.length > 0) {
            setExistingPeriodDefinitions(resp.data);
            setIsExistingPeriodModalOpen(true);
          } else {
            loadPeriodDefinitions();
            enqueueSnackbar(t("saved"), { variant: "success" });
          }
          setModalOpen(false);
          setSaveLoading(false);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
          setSaveLoading(false);
        });
    }
  };

  const onDelete = () => {
    let id = deleteSinglePeriodModal.row?.id;
    if (id) {
      deletePeriodDefinition(id)
        .then(() => {
          const updatedRows = [...rows.filter((r) => r.id !== id)];
          setRows(updatedRows);
          setSelectedRows([...selectedRows.filter((r) => r.id !== id)]);
          enqueueSnackbar(t("deleted"), { variant: "success" });
          setDeleteSinglePeriodModal({ isOpen: false, row: null });
          if (updatedRows.length === 0) {
            setPagingPage(pagingPage > 1 ? pagingPage - 1 : pagingPage);
          }
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setDeleteSinglePeriodModal({ isOpen: false, row: null });
        });
    }
  };

  const onDeleteMulti = () => {
    let arr = [...selectedRows.map((row) => row.id)];
    deletePeriodsDefinitions(arr)
      .then(() => {
        enqueueSnackbar(t("deleted"), { variant: "success" });
        setDeleteMultiPeriodsModal(false);
        setSelectedRows([]);
        const updatedRows = rows.filter((r) => !arr.some((id) => r.id === id));
        setRows(updatedRows);
        if (updatedRows.length === 0 || arr.length >= pagingLimit) {
          const removedPagesAmount = Math.ceil(arr.length / pagingLimit);
          const currentPagesAmount =
            Math.ceil(totalResults / pagingLimit) - removedPagesAmount;

          if (pagingPage > currentPagesAmount) {
            setPagingPage(currentPagesAmount);
          }
        }
        setTotalResults(totalResults - arr.length);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"));
        setDeleteMultiPeriodsModal(false);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const orderRowByHeader = (sortField: string, arrowDirection: string) => {
    let sortDir = arrowDirection === "down" ? "desc" : "asc";
    setSortObj({ sortField, sortDir });
  };

  return (
    <PeriodPage
      rows={rows}
      loading={loading}
      onDelete={onDelete}
      onDeleteMulti={onDeleteMulti}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      deleteSinglePeriodModal={deleteSinglePeriodModal}
      setDeleteSinglePeriodModal={setDeleteSinglePeriodModal}
      deleteMultiPeriodsModal={deleteMultiPeriodsModal}
      setDeleteMultiPeriodsModal={setDeleteMultiPeriodsModal}
      saveFunction={saveFunction}
      periodTypes={periodTypes}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      totalResults={totalResults}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      setTotalResults={setTotalResults}
      existingPeriodDefinitions={existingPeriodDefinitions}
      isExistingPeriodModalOpen={isExistingPeriodModalOpen}
      setExistingPeriodDefinitions={setExistingPeriodDefinitions}
      setIsExistingPeriodModalOpen={setIsExistingPeriodModalOpen}
      saveLoading={saveLoading}
      filterOnChangeFunction={filterOnChangeFunction}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

export default PeriodDefinitionContainer;
