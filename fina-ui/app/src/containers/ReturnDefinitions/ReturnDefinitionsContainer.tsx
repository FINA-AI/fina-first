import ReturnDefinitionsPage from "../../components/ReturnDefinitions/ReturnDefinitionsPage";
import {
  addReturnDefinition,
  deleteReturnDefinitions,
  generateReturnDefinitionTable,
  getReturnDefinitions,
  loadReturnDefinitionTable,
  rebuildReturnDependencyService,
  updateTableSequence,
} from "../../api/services/returnDefinitionService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { getReturnTypes } from "../../api/services/returnsService";
import { useSnackbar } from "notistack";
import React, { memo, useEffect, useState } from "react";
import ReturnDefinitionsManualIcons from "../../components/ReturnDefinitions/ReturnDefinitionsManualIcons";
import { BASE_REST_URL, FilterTypes } from "../../util/appUtil";
import ReturnTypeAutocompleteFilter from "../../components/common/Filter/ReturnTypeAutocompleteFilter";
import {
  GeneratedRDTable,
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import { MiTable } from "../../types/manualInput.type";
import { FilterType, ReviewEngine } from "../../types/common.type";

const ReturnDefinitionsContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const [currentReturnDefinition, setCurrentReturnDefinition] =
    useState<ReturnDefinitionType>({} as ReturnDefinitionType);
  const [tables, setTables] = useState<MiTable[]>();
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  const [returnTypes, setReturnTypes] = useState<ReturnType[]>([]);
  const [GeneralInfoEditMode, setGeneralInfoEditMode] = useState(false);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [returnDefinitions, setReturnDefinitions] = useState<
    ReturnDefinitionType[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<ReturnDefinitionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [generateTableData, setGenerateTableData] =
    useState<GeneratedRDTable>();
  const [generateTableModalOpen, setGenerateTableModalOpen] = useState(false);
  const [filterObject, setFilterObject] = useState({});
  const [sortObject, setSortObject] = useState({});
  const [scrollToIndex, setScrollToIndex] = useState(-1);

  useEffect(() => {
    loadReturnDefinitions();
  }, [pagingLimit, pagingPage, filterObject, sortObject]);

  useEffect(() => {
    if (currentReturnDefinition?.id) {
      initReturnDefinitionsTable();
    } else {
      setTables([]);
    }
  }, [currentReturnDefinition?.id]);

  useEffect(() => {
    initReturnTypes();
  }, []);

  const columnFilterConfig = [
    {
      field: "code",
      type: FilterTypes.string,
      name: "FILTER_CODE",
    },
    {
      field: "name",
      type: FilterTypes.string,
      name: "description",
    },
    {
      field: "returnType.code",
      type: FilterTypes.fis,
      name: "FILTER_RETURN_TYPE_ID",
      renderFilter: (
        columnsFilter: FilterType[],
        onFilterClick: (result: ReturnType | {}) => void,
        onClear: VoidFunction,
        value: ReturnType
      ) => {
        return (
          <ReturnTypeAutocompleteFilter
            onClickFunction={onFilterClick}
            data={returnTypes}
            label={t("returnTypes")}
            closeFilter={onClear}
            defaultValue={value}
          />
        );
      },
    },
    {
      field: "generalInfo",
      type: FilterTypes.string,
      name: "CONTACT_PERSON",
    },
    {
      field: "manualInput",
      type: FilterTypes.list,
      name: "FILTER_MANUAL_INPUT_ONLY",
      filterArray: [
        { label: t("yes"), value: "true" },
        { label: t("no"), value: "false" },
      ],
    },
  ];

  const [columnHeader] = useState([
    {
      field: "code",
      headerName: t("code"),
      minWidth: 200,
    },
    {
      field: "name",
      headerName: t("description"),
      fixed: false,
      minWidth: 200,
      hideSort: true,
    },
    {
      field: "returnType.code",
      headerName: t("returnType"),
      fixed: false,
      minWidth: 200,
    },
    {
      field: "generalInfo",
      headerName: t("contactPerson"),
      fixed: false,
      minWidth: 200,
      renderCell: (value: string) => {
        return <span>{t(value)}</span>;
      },
    },
    {
      field: "manualInput",
      headerName: t("manualInput"),
      fixed: false,
      minWidth: 200,
      hideBackground: true,
      renderCell: (value: string) => {
        return <ReturnDefinitionsManualIcons value={value} />;
      },
    },
  ]);

  const loadReturnDefinitions = (filter?: FilterType) => {
    setLoading(true);
    let filters = filter ? filter : { ...filterObject, ...sortObject };
    getReturnDefinitions(pagingPage, pagingLimit, filters)
      .then((resp) => {
        setReturnDefinitions(resp.data.list);
        setTotalResults(resp.data.totalResults);
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      });
  };

  const initReturnDefinitionsTable = (row?: ReturnDefinitionType) => {
    if (row?.id) {
      loadReturnDefinitionTable(row.id)
        .then((res) => {
          setCurrentReturnDefinition({ ...row, tables: res.data });
          setTables(res.data);
        })
        .catch((error) => openErrorWindow(error, t("error"), true));
    }
  };

  const onDeleteClick = (selectedRows: ReturnDefinitionType[]) => {
    setLoading(true);
    let ids = selectedRows.map((row) => row.id);
    if (isDetailPageOpen) setIsDetailPageOpen(false);
    deleteReturnDefinitions(selectedRows)
      .then(() => {
        if (ids.length > 1)
          setReturnDefinitions(
            returnDefinitions.filter((row) => !ids.includes(row.id))
          );
        else
          setReturnDefinitions(
            returnDefinitions.filter((row) => row.id !== ids[0])
          );
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => openErrorWindow(err, t("error")))
      .finally(() => {
        setSelectedRows([]);
        setLoading(false);
        loadReturnDefinitions();
      });
  };

  const saveReturnDefinition = (data: ReturnDefinitionType) => {
    if (data.tables && data.tables.length > 0) {
      setLoading(true);
      data.tables.forEach((table) => delete table.tempId);
      addReturnDefinition(data)
        .then((resp) => {
          let newReturnDefinition = resp.data;
          initReturnDefinitionsTable(newReturnDefinition);
          if (data.id && data.id !== 0) {
            setReturnDefinitions(
              returnDefinitions.map((rd) =>
                rd.id === data.id ? newReturnDefinition : rd
              )
            );
          } else {
            setReturnDefinitions([newReturnDefinition, ...returnDefinitions]);
          }
          setCurrentReturnDefinition(newReturnDefinition);
          enqueueSnackbar(t("saved"), { variant: "success" });
        })
        .catch((error) => {
          openErrorWindow(error, t("error"), true);
          setCurrentReturnDefinition((prev) => ({ ...prev }));
        })
        .finally(() => {
          setLoading(false);
        });
      setGeneralInfoEditMode(false);
    } else {
      enqueueSnackbar(t("createReturnDefinitionTable"), { variant: "error" });
    }
  };
  const initReturnTypes = async () => {
    try {
      const res = await getReturnTypes();
      setReturnTypes(res.data);
      return res.data;
    } catch (error) {
      openErrorWindow(error, t("error"), true);
    }
  };

  const tableGenerateHandler = (ids: number[]) => {
    generateReturnDefinitionTable(ids)
      .then((res) => {
        setGenerateTableData(res.data);
        setGenerateTableModalOpen(true);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const filterOnChangeFunction = (obj: FilterType) => {
    if (!Array.isArray(obj)) return;

    let filter: any = {};

    for (let o of obj) {
      if (o.value) {
        if (o.name === "FILTER_RETURN_TYPE_ID") {
          filter[o.name] = o.value.id;
        } else {
          filter[o.name] = o.value;
        }
      }
    }
    setFilterObject(filter);
    setPagingPage(1);

    setScrollToIndex((prevState) => (prevState === -1 ? 0 : -1));
  };

  const templateHandleClick = (type: any) => {
    let params;
    let reviewEngine: ReviewEngine = ReviewEngine.AOO;
    if (selectedRows && selectedRows.length > 0) {
      const distinctReturnTypes: Set<number> = new Set(
        selectedRows.map((r) => r.returnType?.id)
      );

      const hasPOiReturnFormat = selectedRows.some(
        (r) => r.returnType && r.returnType.excelTemplate
      );

      reviewEngine = hasPOiReturnFormat ? ReviewEngine.POI : ReviewEngine.AOO;
      if (reviewEngine === ReviewEngine.POI && distinctReturnTypes.size > 1) {
        openErrorWindow(
          "Mixing definitions from different Return Types is not supported, please select from same return type...",
          t("error"),
          false,
          "warning"
        );
        return;
      }

      params = {
        returnIds: selectedRows.map((r) => r.id),
        fileType: type,
      };
    }

    let url = `/rdefinitions/template/review/${reviewEngine}?`;

    if (params && Object.keys(params).length !== 0) {
      for (const property in params) {
        if (Array.isArray(params[property])) {
          let queryParam =
            property + "=" + params[property].join("&" + property + "=");
          url += queryParam;
        } else {
          url += `${property}=${params[property]}`;
        }
        url += "&";
      }
    }
    window.open(BASE_REST_URL + url, "_blank");
  };

  const rebuildReturnDependencyHandler = async (requestTimeout: number) => {
    try {
      await rebuildReturnDependencyService(requestTimeout);
      return true;
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
    return false;
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let fieldName = cellName === "returnType.code" ? "typeCode" : cellName;
    let sortDirection = arrowDirection === "up" ? "asc" : "desc";
    setSortObject({
      sortField: fieldName,
      sortDirection: sortDirection,
    });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const reorderReturnDefinitionTables = async () => {
    setLoading(true);
    const tableIds: number[] = tables?.map((table) => table.id) || [];
    try {
      await updateTableSequence(currentReturnDefinition.id, tableIds);
      enqueueSnackbar(t("saved"), { variant: "success" });
      return true;
    } catch (err) {
      openErrorWindow(err, t("error"), true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (pageNum: number) => {
    setPagingPage(pageNum);
    setScrollToIndex((prevState) => (prevState === -1 ? 0 : -1));
  };

  return (
    <ReturnDefinitionsPage
      columns={columnHeader}
      rows={returnDefinitions}
      setRows={setReturnDefinitions}
      onDeleteClick={onDeleteClick}
      isDetailPageOpen={isDetailPageOpen}
      setIsDetailPageOpen={setIsDetailPageOpen}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      onPageChange={onPageChange}
      currentReturnDefinition={currentReturnDefinition}
      setCurrentReturnDefinition={setCurrentReturnDefinition}
      GeneralInfoEditMode={GeneralInfoEditMode}
      setGeneralInfoEditMode={setGeneralInfoEditMode}
      saveReturnDefinition={saveReturnDefinition}
      returnTypes={returnTypes}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      loading={loading}
      tables={tables}
      setTables={setTables}
      initReturnDefinitionsTable={initReturnDefinitionsTable}
      totalResults={totalResults}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      tableGenerateHandler={tableGenerateHandler}
      generateTableModalOpen={generateTableModalOpen}
      setGenerateTableModalOpen={setGenerateTableModalOpen}
      generateTableData={generateTableData}
      columnFilterConfig={columnFilterConfig}
      filterOnChangeFunction={filterOnChangeFunction}
      templateHandleClick={templateHandleClick}
      orderRowByHeader={orderRowByHeader}
      rebuildReturnDependencyHandler={rebuildReturnDependencyHandler}
      initReturnTypes={initReturnTypes}
      reorderReturnDefinitionTables={reorderReturnDefinitionTables}
      scrollToIndex={scrollToIndex}
    />
  );
};

export default memo(ReturnDefinitionsContainer);
