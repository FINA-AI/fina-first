import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  deleteCatalogService,
  getCatalogService,
  ImportCatalogFile,
  submitCatalog,
} from "../../api/services/catalogService";
import CatalogMainPage from "../../components/Catalog/CatalogPage";
import {
  changeCatalogFilter,
  changeCatalogLoadAction,
  changeCatalogPagingLimitAction,
  changeCatalogPagingPageAction,
} from "../../redux/actions/catalogActions";
import {
  BASE_REST_URL,
  FileUploadStage,
  getFormattedDateValue,
} from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { Box } from "@mui/system";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { Config } from "../../types/config.type";
import {
  Catalog,
  CatalogColumn,
  CatalogCreateGeneral,
  CatalogCreateMeta,
  CatalogCreateStructureRow,
} from "../../types/catalog.type";
import { GridColumnType, TreeGridColumnType } from "../../types/common.type";

interface CatalogContainerProps {
  config?: Config;
  state?: any;
  catalog: (catalog: Catalog) => void;
  setState?: any;
  setPagingPage?: (page: number) => void;
  setPagingLimit?: (limit: number) => void;
  pagingPage?: number;
  pagingLimit?: number;
  setFilterValue?: (value: string) => void;
  filterValue?: string;
  setError?: any;
  error?: any;
}

const CatalogContainer: React.FC<CatalogContainerProps> = ({
  config,
  catalog,
  state,
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  filterValue,
  setFilterValue,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t, i18n } = useTranslation();
  const { getDateFormat } = useConfig();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState({
    open: false,
    dependantNodes: [],
    comparisons: [],
  });

  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [catalogLength, setCatalogsLength] = useState(0);
  const [importStage, setImportStage] = useState(FileUploadStage.NOT_STARTED);
  const [importWarnings, setImportWarnings] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (pagingLimit) {
      loadCatalogs();
    }
  }, [pagingLimit, pagingPage, t]);

  useEffect(() => {
    if (!state) {
      setColumns(columnHeader);
    }
  }, [t, config]);

  useEffect(() => {
    if (state && state.columns) {
      let stateCols = state.columns.map((s: TreeGridColumnType) => {
        return s.field;
      });
      let headerCols = columnHeader.map((s) => {
        return s.field;
      });
      if (
        state !== undefined &&
        state.columns.length !== 0 &&
        stateCols.every((element: string) => {
          return headerCols.includes(element);
        })
      ) {
        let newCols: GridColumnType[] = [];
        for (let item of state.columns) {
          let headerCell = columns.find(
            (el: GridColumnType) => item.field === el.field
          );
          if (headerCell) {
            headerCell.hidden = item.hidden;
            headerCell.fixed = item.fixed;
            newCols.push(headerCell);
          }
        }
        setColumns(newCols);
      } else {
        setColumns(columnHeader);
      }
    }
  }, [state]);

  useEffect(() => {
    setLoader(true);
  }, []);

  const createCatalog = (
    generalInfo: CatalogCreateGeneral,
    metaInfo: CatalogCreateMeta,
    rows: CatalogCreateStructureRow[],
    successCallback: VoidFunction,
    errorCallback: (error: any) => void
  ) => {
    try {
      const requestObjectRows: any = [];
      rows.forEach((row: any, index: number) => {
        requestObjectRows.push({
          id: 0,
          dataType: row.type,
          nameStrId: 0,
          name: row.name,
          key: row.key,
          sequence: index,
          dataFormat: row.format,
          isRequired: row.required,
        });
      });
      const legDocId = metaInfo?.legislativeDocument?.id;
      let legislativeDocumentId = typeof legDocId === "number" ? +legDocId : 0;
      let requestObject: any = {
        id: 0,
        nameStrId: 0,
        name: generalInfo.name,
        abbreviation: generalInfo.abbreviation,
        referenceNumber: generalInfo.number,
        source: generalInfo.source,
        code: generalInfo.code,
        ancestorCatalogInfo: metaInfo?.replacesCatalog,
        validTo: metaInfo?.validTill ? new Date(metaInfo?.validTill) : null,
        legislativeDocumentId: legislativeDocumentId,
        legislativeDocumentName: metaInfo?.legislativeDocument?.fileName,
        ...(metaInfo?.file?.file && {
          attachmentName: metaInfo.file.file.name,
        }),
      };
      requestObject.catalogColumns = requestObjectRows;

      const onSuccess = () => {
        setLoading(false);
        loadCatalogs();
        successCallback();
      };

      let formData = new FormData();
      formData.append(
        "catalog",
        new Blob([JSON.stringify(requestObject)], {
          type: "application/json",
        })
      );

      if (metaInfo?.file?.file) {
        formData.append("attachment", metaInfo.file.file);
      }

      submitCatalog(formData)
        .then(onSuccess)
        .catch((error) => {
          errorCallback(error);
        });
    } catch (error) {
      errorCallback(error);
    }
  };

  const editCatalog = (
    newCatalog: Catalog,
    successCallback: VoidFunction,
    errorCallback: (error: any) => void
  ) => {
    try {
      setLoading(true);
      const onSuccess = () => {
        loadCatalogs();
        successCallback();
      };

      submitCatalog(newCatalog)
        .then(onSuccess)
        .catch((error) => {
          setLoading(false);
          errorCallback(error);
        });
    } catch (error) {
      setLoading(false);
      errorCallback(error);
    }
  };

  const loadCatalogs = (filter?: string) => {
    setLoading(true);
    getCatalogService(pagingPage, pagingLimit, filter)
      .then((res) => {
        const data = res.data;
        if (data) {
          setCatalogsLength(data.totalResults);
          setCatalogs(data.list);
        }
      })
      .catch((error) => {
        enqueueSnackbar(error);
      })
      .finally(() => {
        setLoader(false);
        setLoading(false);
      });
  };

  const handleCatalogImportClose = () => {
    setImportStage(FileUploadStage.NOT_STARTED);
    setImportWarnings([]);
  };

  const importCatalog = (formData: FormData, file: any) => {
    setImportStage(FileUploadStage.IN_PROGRESS);
    ImportCatalogFile(formData, (event: any) => {
      file.progress = Math.round((100 * event.loaded) / event.total);
    })
      .then((response) => {
        if (response.status === 200) {
          const result = response.data;

          if (result.errors.length === 0) {
            setImportStage(FileUploadStage.IMPORTED);
            setImportWarnings(result.warnings);
            enqueueSnackbar(t("Import Catalog Ended Successfully"), {
              variant: "success",
            });
            loadCatalogs();
          } else if (result.errors.length > 0 || result.warnings.length > 0) {
            let messages = [...result.errors, ...result.warnings];
            setImportWarnings(messages);
            setImportStage(FileUploadStage.ERROR);
            enqueueSnackbar(t("fileImportFailed"), {
              variant: "error",
            });
          }
        }
      })
      .catch(() => {
        enqueueSnackbar("Import Catalog Error", { variant: "error" });
        setImportStage(FileUploadStage.ERROR);
      });
  };

  const columnHeader = [
    {
      field: "code",
      headerName: t("catalogCode"),
      fixed: true,
      width: 203,
    },
    {
      field: "name",
      headerName: t("name"),
      fixed: true,
      width: 203,
    },
    {
      field: "abbreviation",
      headerName: t("abbreviation"),
      width: 133,
    },
    {
      field: "source",
      headerName: t("source"),
      width: 172,
    },
    {
      field: "referenceNumber",
      headerName: t("catalogNumber"),
      width: 172,
    },
    {
      field: "mdtCode",
      headerName: t("mdtCode"),
      width: 267,
    },
    {
      field: "ancestorCatalogInfo",
      headerName: t("replacesCatalog"),
      width: 200,
    },
    {
      field: "validTo",
      headerName: t("validTill"),
      width: 200,
      hideCopy: true,
      format: getDateFormat(true),
      renderCell: (value: number) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "legislativeDocumentName",
      headerName: t("legislativeDatabaseFile"),
      width: 250,
      renderCell: (value: string, row: Catalog) => {
        return (
          <span
            onClick={(event) =>
              downloadLegislativeBasisItemById(row.legislativeDocumentId, event)
            }
          >
            {value}
          </span>
        );
      },
    },
    {
      field: "attachmentName",
      headerName: t("File"),
      width: 250,
      renderCell: (value: string, row: Catalog) => {
        return (
          <span onClick={(event) => downloadCatalogFile(row, event)}>
            <a
              style={{
                color: "#2962FF",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {value}
            </a>
          </span>
        );
      },
    },
    {
      field: "modifiedAt",
      headerName: t("modifiedDate"),
      width: 140,
      hideCopy: true,
      renderCell: (value: number) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "catalogColumns",
      headerName: t("Columns"),
      width: 169,
      hideCopy: true,
      hideBackground: true,
      renderCell: (value: CatalogColumn[]) => {
        return (
          <Box
            width={"32px"}
            height={"24px"}
            borderRadius={"51px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            style={{
              color: "#2962FF",
              background: "#F0F4FF",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "16px",
              textTransform: "capitalize",
            }}
          >
            {value.length}
          </Box>
        );
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

  const deleteCatalog = (row?: Catalog) => {
    setLoading(true);
    deleteCatalogService(row?.id)
      .then((res) => {
        if (
          res.data?.comparisons.length <= 0 &&
          res.data?.dependantNodes.length <= 0
        ) {
          setLoading(false);
          const r = catalogs.filter(function (value) {
            return value.id !== row?.id;
          });
          setCatalogs(r);
          enqueueSnackbar(t("deleted"), { variant: "success" });
        } else {
          setError({
            open: true,
            dependantNodes: res.data.dependantNodes,
            comparisons: res.data.comparisons,
          });
          loadCatalogs();
        }
      })
      .catch((error) => {
        setLoading(false);
        openErrorWindow(error, t("error"), true);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage?.(1);
    setPagingLimit?.(limit);
  };

  const downloadLegislativeBasisItemById = (id: number, event: any) => {
    event.stopPropagation();
    window.open(
      BASE_REST_URL + `/legislative/document/download/${id}`,
      "_blank"
    );
  };

  const downloadCatalogFile = (row: Catalog, event: any) => {
    event.stopPropagation();
    window.open(
      BASE_REST_URL + `/catalog/content/${row.id}/${i18n.language}`,
      "_blank"
    );
  };

  const onFilterClick = (searchValue: string) => {
    if (searchValue && searchValue === filterValue) {
      return;
    }
    if (!searchValue || (searchValue && searchValue.trim().length > 0)) {
      setPagingPage?.(1);
      loadCatalogs(searchValue);
      setFilterValue?.(searchValue);
    }
  };

  return (
    <CatalogMainPage
      config={config}
      catalogs={catalogs}
      setCatalogs={setCatalogs}
      setActivePage={setPagingPage}
      setRowPerPage={onPagingLimitChange}
      initialRowsPerPage={pagingLimit}
      catalogLength={catalogLength}
      pagingPage={pagingPage}
      createCatalog={createCatalog}
      editCatalog={editCatalog}
      getCatalog={catalog}
      columns={columns}
      catalogImportStage={importStage}
      catalogImportWarnings={importWarnings}
      onImportCatalog={importCatalog}
      onImportCatalogClose={handleCatalogImportClose}
      deleteCatalog={deleteCatalog}
      onFilterClick={onFilterClick}
      loading={loading}
      loader={loader}
      isDefault={false}
      setColumns={setColumns}
      error={error}
      setError={setError}
    />
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
  state: state.getIn(["state", "catalogTableCustomization"]),
  pagingPage: state.get("catalog").pagingPage,
  pagingLimit: state.get("catalog").pagingLimit,
  filterValue: state.get("catalog").filterValue,
});

const dispatchToProps = (dispatch: any) => ({
  catalog: bindActionCreators(changeCatalogLoadAction, dispatch),
  setPagingPage: bindActionCreators(changeCatalogPagingPageAction, dispatch),
  setPagingLimit: bindActionCreators(changeCatalogPagingLimitAction, dispatch),
  setFilterValue: bindActionCreators(changeCatalogFilter, dispatch),
});

export default connect(mapStateToProps, dispatchToProps)(CatalogContainer);
