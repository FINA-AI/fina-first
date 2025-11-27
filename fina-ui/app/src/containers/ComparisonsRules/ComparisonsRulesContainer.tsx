import ComparisonsRulesPage from "../../components/ComparisonsRules/ComparisonsRulesPage";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  deleteNodeComparison,
  getAllMDTCode,
  getNodeComparisons,
  saveNodeComparison,
} from "../../api/services/MDTService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";
import TabUnselectedIcon from "@mui/icons-material/TabUnselected";
import MTDComparisonConditions from "../../components/MDT/MDTNodeComparisons/MTDComparisonConditions";
import { BASE_REST_URL, FilterTypes } from "../../util/appUtil";
import { connect } from "react-redux";
import { GridColumnType } from "../../types/common.type";
import { MdtNode } from "../../types/mdt.type";
import { Comparison } from "../../types/comparison.type";

export interface FilterObjectType {
  nodeId?: number;
  filterCode?: string;
  filterCondition?: string;
  rightEquation?: string;
  leftEquation?: string;
  errorTemplate?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";

  [key: string]: any;
}

const ComparisonsRulesContainer = ({ state }: { state: any }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState<Comparison[]>([]);
  const [rowsLen, setRowsLen] = useState(0);
  const [column, setColumns] = useState<GridColumnType[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [mdtCodes, setMdtCodes] = useState([]);
  const [filterObject, setFilterObject] = useState<FilterObjectType>({});
  const [loading, setLoading] = useState(false);
  const [comparisonCardData, setComparisonCardData] = useState<Comparison | {}>(
    {}
  );

  const [columnFilterConfig] = useState([
    {
      field: "node",
      type: FilterTypes.string,
      name: "filterCode",
    },
    {
      field: "leftEquation",
      type: FilterTypes.string,
      name: "leftEquation",
    },
    {
      field: "condition",
      type: FilterTypes.list,
      name: "filterCondition",
      filterArray: [
        { label: "= " + t("EQUALS"), value: "EQUALS" },
        { label: "> " + t("GREATER"), value: "GREATER" },
        { label: "< " + t("LESS"), value: "LESS" },
        { label: "=! " + t("NOT_EQUALS"), value: "NOT_EQUALS" },
        { label: "=< " + t("LESS_EQUALS"), value: "LESS_EQUALS" },
        { label: ">= " + t("GREATER_EQUALS"), value: "GREATER_EQUALS" },
      ],
    },
    {
      field: "equation",
      type: FilterTypes.string,
      name: "rightEquation",
    },
    {
      field: "template",
      type: FilterTypes.string,
      name: "errorTemplate",
    },
  ]);

  const [columnHeaders] = useState([
    {
      field: "node",
      headerName: t("code"),
      copyFunction: (row: Comparison) => {
        return row.node?.code;
      },
      renderCell: (value: any, rows: Comparison) => {
        return (
          <Box
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <TabUnselectedIcon
              style={{
                color: "#4361EE",
                marginRight: "5px",
                width: "20px",
                height: "20px",
                padding: "2px",
              }}
            />
            {rows.node?.code}
          </Box>
        );
      },
    },
    {
      field: "name",
      headerName: t("name"),
      hideSort: true,
      copyFunction: (row: Comparison) => {
        return row.node?.name;
      },
      renderCell: (value: any, rows: Comparison) => {
        return <span>{rows.node?.name}</span>;
      },
    },
    {
      field: "numberPattern",
      headerName: t("numberPattern"),
    },
    {
      field: "leftEquation",
      headerName: t("leftEquation"),
    },
    {
      field: "condition",
      headerName: t("condition"),
      minWidth: 150,

      renderCell: (value: string) => {
        return (
          <Box display={"flex"} width={"60px"} justifyContent={"center"}>
            <MTDComparisonConditions
              condition={value}
              color={"#2C3644"}
              background={"#fff"}
              hoverBackground={""}
            />
          </Box>
        );
      },
    },
    {
      field: "equation",
      headerName: t("rightEquation"),
    },
    {
      field: "template",
      headerName: t("errorTemplate"),
    },
  ]);

  let comparisonRuleEmptyObj = {
    id: 0,
    node: {
      id: 0,
      version: 0,
      code: "",
      nameStrId: 0,
      name: "",
      parentId: 0,
      type: "",
      dataType: "",
      equation: "",
      sequence: 0,
      evalMethod: "",
      disabled: true,
      required: true,
      damaged: true,
      canUserReview: true,
      canUserAmend: true,
      permissionType: "",
      fromRole: true,
      catalog: true,
      key: true,
    },
    condition: "",
    leftEquation: "",
    equation: "",
    template: "",
    numberPattern: "",
    version: 0,
  };

  const loadComparisons = (compData?: Comparison) => {
    setTableLoading(true);
    getNodeComparisons(undefined, pagingPage, pagingLimit, filterObject)
      .then((resp) => {
        setRows(resp.data.list);
        setRowsLen(resp.data.totalResults);
        if (compData) setComparisonCardData(compData);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setTableLoading(false));
  };

  useEffect(() => {
    loadComparisons();
  }, [pagingLimit, pagingPage, filterObject]);

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      const newCols: GridColumnType[] = [];
      for (const item of state.columns) {
        const headerCell = columnHeaders.find((el) => item.field === el.field);
        if (headerCell) {
          const clonedHeader = {
            ...headerCell,
            hidden: item.hidden,
            fixed: item.fixed,
          };
          newCols.push(clonedHeader);
        }
      }
      setColumns(newCols);
    } else {
      setColumns([...columnHeaders] as GridColumnType[]);
    }
  }, [t, state]);

  useEffect(() => {
    loadMDTCodes();
  }, []);

  const deleteRow = (row: Comparison) => {
    deleteNodeComparison(row.id, row.node.id)
      .then(() => {
        setRows([...rows.filter((r) => r.id !== row.id)]);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setIsCardOpen(false);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const saveOrUpdate = async (
    data: Comparison,
    node: MdtNode | null,
    setIsEditMode: (value: boolean) => void
  ) => {
    setLoading(true);
    let emptyObj = {
      condition: "",
      equation: "",
      id: 0,
      leftEquation: "",
      numberPattern: "",
      template: "",
      version: 0,
    };
    let result = { ...emptyObj, ...data, node: node };

    let hasError = false;

    await saveNodeComparison(result)
      .then((res) => {
        loadComparisons(res.data);
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((err) => {
        hasError = true;
        openErrorWindow(err, t("error"), true);
      });

    setIsEditMode(hasError);

    setLoading(false);
    return { hasError };
  };

  const loadMDTCodes = () => {
    getAllMDTCode(true)
      .then((resp) => {
        setMdtCodes(resp.data);
      })
      .catch(() => {});
  };

  const filterOnChangeFunction = (obj: any) => {
    let filter: any = {};

    for (let o of obj) {
      if (o.value) {
        filter[o.name] = o.value;
      }
    }
    setFilterObject(filter);
    setPagingPage(1);
  };

  const orderRowByHeader = (sortField: string, arrowDir: string) => {
    const sortDir = arrowDir === "up" ? "asc" : "desc";
    if (sortField === "equation") sortField = "rightEquation";
    setFilterObject({
      ...(filterObject || {}),
      sortField: sortField === "equation" ? "rightEquation" : sortField,
      sortDirection: sortDir,
    });
  };

  const printComparisons = () => {
    const params = new URLSearchParams();

    const filters: FilterObjectType = {
      nodeId: filterObject?.nodeId,
      filterCode: filterObject?.filterCode,
      filterCondition: filterObject?.filterCondition,
      rightEquation: filterObject?.rightEquation,
      leftEquation: filterObject?.leftEquation,
      errorTemplate: filterObject?.errorTemplate,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    window.open(
      `${BASE_REST_URL}/mdt/comparison/print?${params.toString()}`,
      "_blank"
    );
  };

  const onRefresh = () => {
    setFilterObject({ ...filterObject });
  };

  return (
    <ComparisonsRulesPage
      rows={rows}
      columns={column}
      setColumns={setColumns}
      deleteRow={deleteRow}
      tableLoading={tableLoading}
      loading={loading}
      rowsLen={rowsLen}
      setActivePage={setPagingPage}
      setRowPerPage={onPagingLimitChange}
      initialRowsPerPage={pagingLimit}
      pagingPage={pagingPage}
      isCardOpen={isCardOpen}
      setIsCardOpen={setIsCardOpen}
      saveOrUpdate={saveOrUpdate}
      mdtCodes={mdtCodes}
      comparisonRuleEmptyObj={comparisonRuleEmptyObj}
      columnFilterConfig={columnFilterConfig}
      filterOnChangeFunction={filterOnChangeFunction}
      orderRowByHeader={orderRowByHeader}
      comparisonCardData={comparisonCardData}
      setComparisonCardData={setComparisonCardData}
      printComparisons={printComparisons}
      onRefresh={onRefresh}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "comparisonsRulesTableCustomization"]),
});

const dispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  dispatchToProps
)(ComparisonsRulesContainer);
