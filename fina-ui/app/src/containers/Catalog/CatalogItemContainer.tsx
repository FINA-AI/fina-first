import React, { memo, useEffect, useRef, useState } from "react";
import {
  deleteCatalogData,
  deleteCatalogRows,
  GetCatalogHistory,
  getCatalogItems,
  hasDependentRows,
  restoreCatalogService,
  sendCatalogData,
  UpdateCatalogData,
} from "../../api/services/catalogService";
import { useTranslation } from "react-i18next";
import { FieldDataType } from "../../util/component/fieldUtil";
import format from "date-fns/format";
import { connect } from "react-redux";
import CatalogItem from "../../components/Catalog/Item/CatalogItem";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  BASE_REST_URL,
  FilterTypes,
  getDefaultDateFormat,
  getFormattedDateValue,
  getFormattedNumber,
  NumOfRowsPerPage,
} from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import i18n from "i18next";
import { Box } from "@mui/system";
import Tooltip from "../../components/common/Tooltip/Tooltip";
import DeleteForm from "../../components/common/Delete/DeleteForm";
import CatalogItemStatusCell from "../../components/Catalog/Item/CatalogItemStatusCell";
import { useSnackbar } from "notistack";
import { Config } from "../../types/config.type";
import {
  Catalog,
  CatalogAddItemModal,
  CatalogForm,
  CatalogItem as CatalogItemType,
  CatalogItemHistory,
  CatalogItemTreeState,
  CatalogItemWithUIProps,
  DependenciesDeleteModal,
} from "../../types/catalog.type";
import {
  FilterType,
  GridColumnType,
  TreeGridColumnType,
} from "../../types/common.type";
import CatalogHistoryStatusCell from "../../components/Catalog/Item/CatalogItemHistoryStatusCell";

interface CatalogItemContainerProps {
  config: Config;
  catalog: Catalog;
  treeState: CatalogItemTreeState;
  setTreeState: (data: CatalogItemTreeState) => void;
  catalogId: string;
}

export interface CatalogTreeStateType {
  treeData: CatalogItemWithUIProps[];
  columns: TreeGridColumnType[];
}

const CatalogItemContainer: React.FC<CatalogItemContainerProps> = ({
  config,
  catalog,
  treeState,
  setTreeState,
  catalogId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const id = catalogId;
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();

  const [catalogItemTreeState, setCatalogItemTreeState] =
    useState<CatalogTreeStateType>({
      treeData: [],
      columns: [],
    });
  const [selected, setSelected] = useState<CatalogItemWithUIProps[]>([]);
  const [selectedToolbar, setSelectedToolbar] = useState(false);
  const [catalogAddItemModal, setCatalogAddItemModal] =
    useState<CatalogAddItemModal>({
      isOpen: false,
      data: null,
    });
  const [catalogModalData, setCatalogModalData] = useState<
    Partial<CatalogItemWithUIProps>
  >({} as CatalogItemWithUIProps);
  const [catalogModalForm, setCatalogModalForm] = useState<CatalogForm>({
    fields: [],
  });
  const [activePage, setActivePage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(
    NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE
  );
  const [totalNumOfRootRows, setTotalNumOfRootRows] = useState(0);
  const { getErrorMessage } = useErrorWindow();
  const [catalogItemHistory, setCatalogItemHistory] = useState<
    CatalogItemHistory[]
  >([]);
  const [catalogVersionColumns, setCatalogVersionColumns] = useState<
    GridColumnType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [versionLoading, setVersionLoading] = useState(true);
  const [dependenciesDeleteModal, setDependenciesDeleteModal] =
    useState<DependenciesDeleteModal>({
      isOpen: false,
      row: null,
    });
  const [columnsFilter, setColumnsFilter] = useState<FilterType>([]);
  const prevCatalogIdRef = useRef(-1);

  useEffect(() => {
    setSelectedToolbar(false);
    const catalogChanged = prevCatalogIdRef.current !== catalog?.id;

    if (catalogChanged) {
      setColumnsFilter([]);
      prevCatalogIdRef.current = catalog?.id;

      if (activePage !== 1) {
        setActivePage(1);
        return;
      }
      init(catalog?.id, []);
    } else {
      init(catalog?.id, columnsFilter);
    }
  }, [catalog, rowPerPage, activePage]);

  useEffect(() => {
    setSelected([]);
    setSelectedToolbar(false);
  }, [catalog]);

  const init = async (catalogId: number, itemFilters: FilterType = []) => {
    if (!catalogId) {
      return;
    }
    setLoading(true);
    try {
      const res = await getCatalogItems(
        catalogId ? catalogId : id,
        0,
        activePage,
        rowPerPage,
        itemFilters
      );

      const data = res.data;
      setTotalNumOfRootRows(data.totalResults);
      setCatalogModalForm(generateCatalogForm());
      setCatalogModalData(generateCatalogModalData());

      setTreeState({
        data: data.list,
        columns:
          itemFilters?.length > 0 ? treeState.columns : generateColumns(),
      });
    } catch (err) {
      openErrorWindow(err, "error", true);
    } finally {
      setLoading(false);
    }
  };

  const generateColumns = () => {
    let col = [];
    let rowColumns = catalog.catalogColumns;

    for (let i in rowColumns) {
      let rowColumn = rowColumns[i];
      let columnObject: any = {
        title: rowColumn.name,
        dataIndex: `rowItems.${i}.value`,
        filter: {
          type:
            rowColumn.dataType === "INTEGER"
              ? FilterTypes.number
              : rowColumn.dataType,
          name: rowColumn.id,
        },
        flex: 1,
        renderer: (value: string) => {
          return (
            <Tooltip title={value}>
              <Box
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: 200,
                }}
              >
                {value}
              </Box>
            </Tooltip>
          );
        },
      };

      if (rowColumn.dataFormat) {
        columnObject.renderer = (value: string) => {
          switch (rowColumn.dataType) {
            case FieldDataType._DATE:
              try {
                return format(
                  new Date(parseInt(value, 10)),
                  rowColumn.dataFormat
                );
              } catch (e) {
                return value;
              }

            case FieldDataType._NUMBER:
            case FieldDataType._INTEGER:
              return getFormattedNumber(value, rowColumn.dataFormat);
          }
        };
      } else if (rowColumn.dataType === "DATE") {
        columnObject.renderer = (value: string) => {
          if (config.dateFormat) {
            try {
              return format(new Date(parseInt(value, 10)), config.dateFormat);
            } catch (e) {
              return value;
            }
          }
        };
      }
      col.push(columnObject);
    }

    col.push({
      dataIndex: "modifiedAt",
      title: t("modifiedDate"),
      flex: 1,
      renderer: (value: string) => {
        if (config.dateFormat && value) {
          return format(new Date(parseInt(value, 10)), config.dateFormat);
        }
      },
    });
    col.push({
      dataIndex: "deleted",
      title: t("status"),
      flex: 1,
      renderer: (value: boolean) => {
        return <CatalogItemStatusCell value={value} />;
      },
    });

    return col;
  };

  const generateCatalogForm = () => {
    let form: CatalogForm = { fields: [] };
    let rowColumns = catalog.catalogColumns;

    for (let col of rowColumns) {
      form.fields.push({
        type: "field",
        dataType: col.dataType,
        dataFormat: col.dataFormat,
        formattedValue: col.formattedValue,
        isRequired: col.isRequired,
        name: col.name,
        key: col.key,
      });
    }

    form.fields.push({
      type: "checkbox",
    });

    return form;
  };

  const generateCatalogModalData = (row?: CatalogItemWithUIProps) => {
    let data: Partial<CatalogItemWithUIProps>;

    if (row) {
      data = { ...row };
    } else {
      data = {
        rowNumber: 0,
        nodeId: 0,
        leaf: false,
        parentRowId: 0,
        rowItems: catalog.catalogColumns.map((e) => ({
          id: 0,
          rowNumber: 0,
          nodeId: 0,
          column: e,
        })),
      };
    }

    return data;
  };

  const filterOnChangeFunction = (obj: any) => {
    let filter = [];

    for (let o of obj) {
      switch (o.type) {
        case FilterTypes.date:
          if (o.start || o.end) {
            filter.push(
              `${o.name}=${o.start ? o.start : ""}|${o.end ? o.end : ""}`
            );
          }

          break;
        default:
          if (o.value) {
            filter.push(`${o.name}=${o.value}`);
          }
          break;
      }
    }
    setColumnsFilter(filter);

    if (activePage > 1) {
      setActivePage(1);
    } else {
      init(catalog?.id, filter);
    }
  };

  const fetchFunction = async (id: number) => {
    if (id > 0) {
      const resp = await getCatalogItems(catalog.id, id, -1, -1, columnsFilter);
      const data = await resp.data;
      return data ? data.list : [];
    }
    return treeState.data.filter((r) => r.parentRowId === (id ? id : 0));
  };

  const checkboxClickHandler = (selectedElements: CatalogItemWithUIProps[]) => {
    setSelectedToolbar(selectedElements.length > 0);
    setSelected(selectedElements);
  };

  const deleteCatalogItem = async (
    row: CatalogItemWithUIProps | null,
    deleteChildren = false
  ) => {
    try {
      await deleteCatalogData(catalog.id, row?.rowId, deleteChildren);
      enqueueSnackbar("deleted", { variant: "success" });

      const childAsDeletedRecursive = (childRow: CatalogItemWithUIProps) => {
        childRow.deleted = true;
        if (deleteChildren && childRow.children) {
          childRow.children.forEach((child) => {
            childAsDeletedRecursive(child);
          });
        }
      };

      const deleteParentRecursive = (parentRow: CatalogItemWithUIProps) => {
        if (parentRow.rowId === row?.rowId) {
          childAsDeletedRecursive(parentRow);
        } else if (parentRow.children) {
          parentRow.children.forEach((child) => {
            deleteParentRecursive(child);
          });
        }
      };

      catalogItemTreeState.treeData.forEach((parent) => {
        deleteParentRecursive(parent);
      });

      setCatalogItemTreeState({
        treeData: catalogItemTreeState.treeData,
        columns: catalogItemTreeState.columns,
      });
    } catch (ex) {
      let error = getErrorMessage(ex);
      if (error === "Has dependencies") {
        setDependenciesDeleteModal({ isOpen: true, row });
      }
    }
  };

  const onError = (error: any) => {
    openErrorWindow(error, t("error"), true);
  };

  const saveCatalogItem = async (data: CatalogItemWithUIProps) => {
    try {
      setLoading(true);
      if (data.rowId) {
        await UpdateCatalogData(catalog.id, data).then((res) => {
          let response = res.data;
          const getChildRecursive = (childRow: CatalogItemWithUIProps) => {
            if (
              childRow.parentRowId === response.parentRowId &&
              response.rowId === childRow.rowId
            ) {
              childRow.modifiedAt = response.modifiedAt;
              childRow.rowItems = response.rowItems;
            } else {
              if (childRow.children) {
                childRow.children.forEach((child) => {
                  getChildRecursive(child);
                });
              }
            }
          };

          catalogItemTreeState.treeData.forEach((parent) => {
            getChildRecursive(parent);
          });
          setCatalogItemTreeState({ ...catalogItemTreeState });
          enqueueSnackbar("edited", { variant: "success" });
        });
      } else {
        if (catalogAddItemModal.data) {
          data.parentRowId = catalogAddItemModal.data.rowId;
        }
        const savedItem = (await sendCatalogData(catalog.id, data)).data;
        data.rowId = savedItem.rowId;
        data.rowNumber = savedItem.rowNumber;
        data.rowItems = savedItem.rowItems;
        data.nodeId = savedItem.nodeId;

        if (selected[0]) {
          await loadChildren(selected[0], data);
        } else {
          if (!catalogAddItemModal.data) {
            addRootNode(data);
          } else {
            if (catalogAddItemModal.data.children) {
              const findParentAndAddChild = (
                dataItems: CatalogItemWithUIProps[]
              ) => {
                for (let row of dataItems) {
                  if (row.rowId === catalogAddItemModal?.data?.rowId) {
                    row.children.push(data);
                    setCatalogItemTreeState({
                      ...catalogItemTreeState,
                      treeData: [...catalogItemTreeState.treeData],
                    });
                    break;
                  }
                  if (row.children) {
                    findParentAndAddChild(row.children);
                  }
                }
              };

              findParentAndAddChild(catalogItemTreeState.treeData);
            }
          }
        }

        enqueueSnackbar("saved", { variant: "success" });
      }
    } catch (error) {
      setLoading(false);
      onError(error);
    }

    setLoading(false);
  };

  const loadChildren = async (
    row: CatalogItemWithUIProps,
    child: CatalogItemWithUIProps
  ) => {
    if (row.children) {
      let children = await fetchFunction(row["rowId"]);
      children = children.map((e: CatalogItemWithUIProps) => ({
        ...e,
        level: row.level === undefined ? 0 : row.level + 1,
      }));

      let data: CatalogItemWithUIProps[] = [];

      const getChildrenRecursive = (parent: CatalogItemWithUIProps) => {
        if (parent.rowId === row.rowId) {
          parent.children = children;
        } else {
          if (parent.children) {
            for (let item of parent.children) {
              getChildrenRecursive(item);
            }
          }
        }
      };

      if (row.parentRowId !== 0) {
        catalogItemTreeState.treeData.forEach((row) => {
          getChildrenRecursive(row);
          data.push(row);
        });
      } else {
        data = [
          ...catalogItemTreeState.treeData.map((r) => {
            return r.rowId === row.rowId
              ? { ...row, children: [...row.children, child] }
              : r;
          }),
        ];
      }

      setCatalogItemTreeState({
        ...catalogItemTreeState,
        treeData: data,
      });
    }
  };

  const addRootNode = (node: CatalogItemWithUIProps) => {
    node.level = 0;
    node.createdAt = new Date().getTime();

    setCatalogItemTreeState({
      ...catalogItemTreeState,
      treeData: [...catalogItemTreeState.treeData, node],
    });

    setTreeState({
      ...treeState,
      data: [...catalogItemTreeState.treeData, node],
    });
  };

  const deleteCatalogItems = (deleteChildren = false) => {
    deleteCatalogRows(
      catalog.id,
      selected.map((s) => s.rowId),
      deleteChildren
    )
      .then(() => {
        init(catalog.id);
        setSelected([]);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const checkDependentRows = async (
    rowsToCheck: CatalogItemWithUIProps[] = []
  ) => {
    try {
      rowsToCheck =
        rowsToCheck.length === 0 ? (rowsToCheck = selected) : rowsToCheck;
      setLoading(true);
      const result = await hasDependentRows(
        catalog.id,
        rowsToCheck.map((r) => r.rowId)
      );

      if (result.data === true) {
        setLoading(false);
        return result.data;
      }
      setLoading(false);
      return false;
    } catch (ex) {
      setLoading(false);
      onError(ex);
    }
  };

  const generateCatalogItemHistoryColumnHeader = (data: CatalogItemType[]) => {
    let columnHeaderArray: GridColumnType[] = [
      {
        field: "version",
        headerName: t("versions"),
        minWidth: 200,
      },
    ];

    for (let o of data[0].rowItems) {
      columnHeaderArray.push({
        field: o.column.name,
        headerName: o.column.name,
        minWidth: 200,
      });
    }

    columnHeaderArray.push({
      field: "modifiedAt",
      headerName: t("modifiedTime"),
      minWidth: 200,
      hideCopy: true,
      renderCell: (value: number) => {
        return (
          <span>{getFormattedDateValue(value, getDateFormat(false))}</span>
        );
      },
    });

    columnHeaderArray.push({
      field: "historyStatus",
      headerName: t("status"),
      minWidth: 200,
      hideCopy: true,
      flex: 1,
      renderCell: (value: "created" | "updated" | "deleted" | "restored") => {
        return <CatalogHistoryStatusCell status={value} />;
      },
    });

    setCatalogVersionColumns(columnHeaderArray);
    return columnHeaderArray;
  };

  const generateCatalogItemHistoryRows = (data: CatalogItemType[]) => {
    let headers = generateCatalogItemHistoryColumnHeader(data);
    let rows: CatalogItemHistory[] = [];

    for (let i = 0; i < data.length; i++) {
      let o = data[i];
      let array = [];
      array.push(o.version);

      for (let item of o.rowItems) {
        if (item.column.dataType === "DATE")
          array.push(
            item.value !== null
              ? format(
                  new Date(parseInt(item.value)),
                  item.column.dataFormat !== ""
                    ? item.column.dataFormat
                    : getDefaultDateFormat()
                )
              : ""
          );
        else array.push(item.value);
      }

      array.push(o.modifiedAt);

      let historyStatus: "created" | "updated" | "deleted" | "restored";

      if (i === 0) {
        historyStatus = "created";
      } else if (o.deleted) {
        historyStatus = "deleted";
      } else {
        const previousVersion = data[i - 1];

        if (previousVersion && previousVersion.deleted) {
          historyStatus = "restored";
        } else {
          historyStatus = "updated";
        }
      }

      array.push(historyStatus);

      let row: any = {};
      for (let k = 0; k < headers.length; k++) {
        row[headers[k].field] = array[k];
      }
      rows.push(row);
    }
    setCatalogItemHistory(rows);
  };

  const getCatalogItemVersionFunction = (item: CatalogItemWithUIProps) => {
    setVersionLoading(true);
    GetCatalogHistory(catalog.id, item.rowId)
      .then((result) => {
        generateCatalogItemHistoryRows([
          ...result.data
            .filter(
              (row: CatalogItemType) =>
                row.rowId === item.rowId && row.parentRowId === item.parentRowId
            )
            .map((row: CatalogItemType, index: number) => {
              return { ...row, version: index };
            }),
        ]);
      })
      .catch((error) => onError(error))
      .finally(() => setVersionLoading(false));
  };

  const setRowPerPageFunction = (number: number) => {
    setRowPerPage(number);
    setActivePage(1);
  };

  const catalogExportFunction = (val: string, item: any) => {
    console.log(val, item);
    window.open(
      BASE_REST_URL +
        `/catalog/export/${catalog.id}?locale=${i18n.language}&exportMode=${item.value}`,
      "_blank"
    );
  };

  const restoreCatalogHandler = async (row: CatalogItemWithUIProps) => {
    const response = await restoreCatalogService(row.rowId);
    const path = response.data;

    const getChildRecursive = (childRow: CatalogItemWithUIProps) => {
      if (path.indexOf(childRow.rowId) >= 0) {
        childRow.deleted = false;
      }

      if (
        childRow.parentRowId === row.parentRowId &&
        row.rowId === childRow.rowId
      ) {
        childRow.deleted = false;
      } else {
        if (childRow.children) {
          childRow.children.forEach((child) => {
            getChildRecursive(child);
          });
        }
      }
    };

    catalogItemTreeState.treeData.forEach((parent) => {
      if (parent.children) {
        getChildRecursive(parent);
      } else {
        if (parent.rowId === row.rowId) {
          parent.deleted = false;
        }
      }
    });

    setCatalogItemTreeState({
      treeData: catalogItemTreeState.treeData,
      columns: catalogItemTreeState.columns,
    });
    enqueueSnackbar(t("restored"), { variant: "success" });
  };

  const reloadCatalogs = () => init(catalog?.id, columnsFilter);

  return (
    <>
      <CatalogItem
        catalogItemTreeState={catalogItemTreeState}
        setCatalogItemTreeState={setCatalogItemTreeState}
        fetchFunction={fetchFunction}
        columns={treeState.columns}
        data={treeState.data}
        totalNumOfRootRows={totalNumOfRootRows}
        onPageChange={(activePage: number) => setActivePage(activePage)}
        onRowsPerPageChange={(number: number) => setRowPerPageFunction(number)}
        rowsPerPage={rowPerPage}
        checkboxClickHandler={checkboxClickHandler}
        selectedElements={selected}
        isSelectedToolbar={selectedToolbar}
        getCatalogItemVersionFunction={getCatalogItemVersionFunction}
        rowEditFunction={(row: CatalogItemWithUIProps) => {
          setCatalogAddItemModal({ isOpen: true, data: row, isEdit: true });
          setCatalogModalData(generateCatalogModalData(row));
        }}
        rowDeleteFunction={deleteCatalogItem}
        saveCatalogItem={saveCatalogItem}
        deleteCatalogItems={deleteCatalogItems}
        catalogAddItemModal={catalogAddItemModal}
        setCatalogAddItemModal={(val: CatalogAddItemModal) => {
          if (!val.data) {
            setCatalogModalData(generateCatalogModalData());
          }
          setCatalogAddItemModal(val);
        }}
        catalogModalData={catalogModalData}
        catalogModalForm={catalogModalForm}
        catalogItemHistory={catalogItemHistory}
        setCatalogItemHistory={setCatalogItemHistory}
        catalogVersionColumns={catalogVersionColumns}
        checkDependentRows={checkDependentRows}
        loading={loading}
        onExportClick={catalogExportFunction}
        versionLoading={versionLoading}
        restoreCatalogHandler={restoreCatalogHandler}
        filterOnChangeFunction={filterOnChangeFunction}
        activePage={activePage}
        reloadCatalogs={reloadCatalogs}
        catalogId={catalogId}
      />

      {dependenciesDeleteModal.isOpen && (
        <DeleteForm
          headerText={t("hasDependencies")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={dependenciesDeleteModal.isOpen}
          setIsDeleteModalOpen={(value: boolean) =>
            setDependenciesDeleteModal({ isOpen: value, row: null })
          }
          onDelete={() => {
            deleteCatalogItem(dependenciesDeleteModal.row, true);
            setDependenciesDeleteModal({ isOpen: false, row: null });
          }}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
  catalog: state.getIn(["catalog", "catalog"]),
  state: state.getIn(["state", "itemTableCustomization"]),
});

export default connect(mapStateToProps)(memo(CatalogItemContainer));
