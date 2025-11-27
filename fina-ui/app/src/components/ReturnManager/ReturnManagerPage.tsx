import { Box } from "@mui/system";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import React, { useEffect, useMemo, useState } from "react";
import ReturnCreateModal from "./ReturnCreateModal";
import ReturnProcessModal from "./ReturnProcessModal";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import SaveIcon from "@mui/icons-material/Save";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddIcon from "@mui/icons-material/Add";
import GhostBtn from "../common/Button/GhostBtn";
import TreeGrid from "../common/TreeGrid/TreeGrid";
import ReturnSaveAsModal from "./ReturnSaveAsModal";
import Popover from "@mui/material/Popover";
import ActionBtn from "../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "../common/Tooltip/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import MainGridSkeleton from "../FI/Skeleton/GridSkeleton/MainGridSkeleton";
import ClosableModal from "../common/Modal/ClosableModal";
import ReturnManagerHistoryModal from "./History/ReturnManagerHistoryModal";
import MiModal from "../ManualInput/MiModal";
import useConfig from "../../hoc/config/useConfig";
import { BASE_REST_URL } from "../../util/appUtil";
import FilePrintField, {
  PrintFieldOptions,
} from "../common/Field/FilePrintField";
import DeleteForm from "../common/Delete/DeleteForm";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { RETURN_MANAGER_TABLE_KEY } from "../../api/TableCustomizationKeys";
import HelpIcon from "@mui/icons-material/Help";
import ReturnStatusHelperModal from "./ReturnStatusHelperModal";
import SwitchBtn from "../common/Button/SwitchBtn";
import { IconButton } from "@mui/material";
import { ExpandFilesIcon } from "../../api/ui/icons/ExpandFilesIcon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RTPrintModal from "./returnType/print/RTPrintModal";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import InfinitePaging from "../common/Paging/Infinite/InfinitePaging";
import { Return } from "../../types/return.type";
import {
  FilterType,
  GridColumnType,
  TreeGridColumnType,
  TreeState,
  UIEventType,
} from "../../types/common.type";
import { ReturnVersion } from "../../types/importManager.type";
import { MiTable } from "../../types/manualInput.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import { ReturnStatus } from "../../types/returnManager.type";
import { updateState } from "../../redux/actions/stateActions";
import { useDispatch } from "react-redux";
import { StateType } from "../../containers/ReturnManager/ReturnManagerContainer";
import { ShrinkFilesIcon } from "../../api/ui/icons/ShrinkFilesIcon";

interface ReturnManagerPageProps {
  state: StateType;
  pagingPage: number;
  setRowPerPage: (page: number) => void;
  setActivePage: (activePage: number) => void;
  data: Return[];
  loadingMask: boolean;
  loadingSkeleton: boolean;
  columns: TreeGridColumnType[];
  returnVersions: ReturnVersion[];
  currUserReturnVersions: ReturnVersion[];
  selectedRows: Return[];
  setSelectedRows: (rows: Return[]) => void;
  filteredData: FilterType;
  setFilteredData: (data: FilterType) => void;
  init: VoidFunction;
  setColumns: (columns: TreeGridColumnType[]) => void;
  dataChildren: React.MutableRefObject<{ id: string; children: Return[] }[]>;
  expandAll: boolean;
  setExpandAll: (value: boolean) => void;
  definitions: ReturnDefinitionType[];
  returnTypes: ReturnType[];
  treeState: TreeState<Return[]>;
  setTreeState: React.Dispatch<React.SetStateAction<TreeState<Return[]>>>;
  defaultExpandedRowsIds: (string | number)[];
  orderRowByHeader(sortField: string, sortDirection: string): void;
  deleteReturnHandler(
    selectedReturns: Return | Return[] | null,
    setIsDeleteConfirmOpen: (info: DeleteConfirmType) => void
  ): void;
  onSaveActionStatusHandler(
    selectedReturns: Partial<Return>[],
    returnStatus?: string,
    note?: string
  ): Promise<void>;
  getChildren(row: Return, filteredData: FilterType): Promise<Return[]>;
  saveAndProcessHandler(
    tables: MiTable[],
    returnId: number,
    versionId: number,
    noteValue: string,
    parentRowId: number
  ): Promise<Boolean>;
  rowSelectHandler(row: Return, rows: Return[]): void;
  saveAsClickHandler(
    selectedReturns: Partial<Return>[],
    versionId?: number | string,
    note?: string
  ): Promise<void>;
}

export type DeleteConfirmType = {
  isOpen: boolean;
  row: Return | null;
  loading?: boolean;
};

const getIconStyles = (theme: any) => ({
  cursor: "pointer",
  color: theme.palette.iconColor,
});

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.pageContent,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Grid)(({ theme }: { theme: any }) => ({
  ...theme.pageToolbar,
  justifyContent: "flex-end",
  [theme.breakpoints.between(900, 1300)]: {
    padding: "0.5rem !important",
  },
  width: `calc(100% - 450px)`,
  float: "right",
  position: "relative",
}));

const StyledGridContainer = styled(Grid)(({ theme }: { theme: any }) => ({
  borderTop: `${theme.palette.borderColor}`,
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
}));

const StyledIconBtn = styled(IconButton)({
  marginRight: "4px",
  border: "unset",
  background: "inherit",
});
const StyledContent = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});
const StyledPopover = styled(Popover)({
  top: 4,
  "& .MuiPopover-paper": {
    backgroundColor: "#2A3341 !important",
    width: "110px",
    color: "#FFFFFF",
    padding: "4px",
  },
});

const StyledStatusItem = styled(Box)<{ disabled: boolean }>(
  ({ theme, disabled }) => ({
    cursor: "pointer",
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "16px",
    textTransform: "capitalize",
    padding: "4px",
    "&:hover": {
      background:
        theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.1)" : "#344258",
    },

    ...(disabled && {
      color: "#889899",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "16px",
      textTransform: "capitalize",
      padding: "4px",
      cursor: "pointer",
    }),
  })
);

const StyledBtnTitleWrapper = styled("span")(({ theme }) => ({
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  color: theme.palette.mode === "dark" ? "#F5F7FA" : "",
}));

const StyledShrinkExpandIcon = styled(ShrinkFilesIcon)({
  width: "18px",
  height: "18px",
});

const StyledExpandFilesIcon = styled(ExpandFilesIcon)({
  width: "18px",
  height: "18px",
});

const StyledHelpIcon = styled(HelpIcon)(({ theme }) => getIconStyles(theme));
const StyledAssigmentIcon = styled(AssignmentIcon)(({ theme }) =>
  getIconStyles(theme)
);
const StyledCloudIcon = styled(CloudUploadIcon)(({ theme }) =>
  getIconStyles(theme)
);
const StyledHistoryToggleOffIcon = styled(HistoryToggleOffIcon)(({ theme }) =>
  getIconStyles(theme)
);
const StyledNewReleasesIcon = styled(NewReleasesIcon)(({ theme }) =>
  getIconStyles(theme)
);
const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)(({ theme }) =>
  getIconStyles(theme)
);
const StyledAddIcon = styled(AddIcon)(({ theme }) => ({
  ...getIconStyles(theme),
  color: "inherit !important",
}));

const StyledSaveIcon = styled(SaveIcon)(({ theme }) => getIconStyles(theme));
const StyledRemoveRedEyeIcon = styled(RemoveRedEyeIcon)(({ theme }) =>
  getIconStyles(theme)
);

const ReturnManagerPage: React.FC<ReturnManagerPageProps> = ({
  state,
  treeState,
  setTreeState,
  pagingPage,
  data,
  setRowPerPage,
  setActivePage,
  loadingMask,
  loadingSkeleton,
  columns = [],
  returnVersions = [],
  currUserReturnVersions = [],
  saveAsClickHandler,
  selectedRows,
  rowSelectHandler,
  setSelectedRows,
  saveAndProcessHandler,
  getChildren,
  onSaveActionStatusHandler,
  deleteReturnHandler,
  filteredData,
  setFilteredData,
  init,
  setColumns,
  dataChildren,
  expandAll,
  setExpandAll,
  definitions,
  returnTypes,
  defaultExpandedRowsIds,
  orderRowByHeader,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { config } = useConfig();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [saveAsModalOpen, setSaveAsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRTypeModalOpen, setIsRTypeModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const [miModalState, setMiModalState] = useState({
    open: false,
    canAmend: false,
  });
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const { hasPermission } = useConfig();

  const [actionStatus, setActionStatus] = useState<string>("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<DeleteConfirmType>({
      isOpen: false,
      row: null,
      loading: false,
    });

  const [loadAllDataSwitchEnabled, setLoadAllDataSwitchEnabled] = useState(
    !!state?.loadAllDataSwitchEnabled
  );

  const handleClick = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    expandUnExpandRowsHandler();
  }, [expandAll]);

  const generalValidityHandler = (
    selectedRows: Return[],
    validStatuses: string[]
  ) => {
    if (selectedRows.length === 0) return false;

    const foldersCount = selectedRows.filter((row) => !row.leaf).length;

    if (foldersCount > 1) return false;

    const folder = selectedRows.find((row) => row.group);
    if (folder && !folder?.children) return false;

    const sameParentId = selectedRows.every((row) => {
      if (folder) {
        if (!row.leaf) return true;
        return row.parentRowId === folder.id;
      } else {
        return row.parentRowId === selectedRows[0].parentRowId;
      }
    });
    return folder && folder?.children
      ? folder?.children.every((item) => validStatuses.includes(item.status)) &&
          sameParentId
      : selectedRows.every((item) => validStatuses.includes(item.status)) &&
          sameParentId;
  };

  const generatecolumns = () => {
    if (columns) {
      let newCol: GridColumnType[] = columns.map((item) => ({
        ...item,
        headerName: t(item.title),
        field: item.dataIndex,
      }));

      return newCol;
    }
  };

  const handleReview = (type: string) => {
    const selectedReturn = selectedRows[0];
    const engineReview = selectedReturn.excelTemplate ? "POI" : "AOO";

    const baseUrl = BASE_REST_URL + "/returns/review?";
    const queryParamString = `reviewEngine=${engineReview}&versionId=${selectedReturn.versionId}&fiId=${selectedReturn.fiId}&periodId=${selectedReturn.periodId}&fileType=${type}`;
    let url;

    //Single Select
    if (selectedRows?.length === 1) {
      if (selectedReturn.group) {
        url =
          baseUrl +
          queryParamString +
          `&returnTypeId=${selectedReturn.returnTypeId}`;
        window.open(url, "_blank");
      } else {
        url = baseUrl + queryParamString + `&returnIds=${selectedReturn.id}`;
        window.open(url, "_blank");
      }
    } else {
      //Multi Select
      const groups = selectedRows.filter((r) => r.group);

      const returnIds = selectedRows
        .filter((r) => !r.group)
        .map((item) => item.id);

      if (groups.length > 0) {
        const gr = groups[0];
        let queryParamString = `reviewEngine=${engineReview}&versionId=${gr.versionId}&fiId=${gr.fiId}&periodId=${gr.periodId}&fileType=${type}`;

        const groupUrl =
          baseUrl + queryParamString + `&returnTypeId=${gr.returnTypeId}`;
        window.open(groupUrl, "_blank");
      } else if (returnIds.length > 0) {
        url =
          baseUrl +
          queryParamString +
          returnIds.map((id) => `&returnIds=${id}`).join("");
        window.open(url, "_blank");
      }
    }
  };

  const openStatusModalHandler = (status: string, row?: Return) => {
    if (row) {
      setSelectedRows([row]);
    }
    setActionStatus(status);
    setSaveAsModalOpen(true);
    handleClose();
  };

  const canUserAmendRow = (row: Return): boolean => {
    return (
      hasPermission(PERMISSIONS.FINA_RETURNS_AMEND) &&
      currUserReturnVersions.some(
        (v) => v.id === row.versionId && v.canUserAmend
      )
    );
  };

  let actionButtons = (row: Return, index: number) => {
    if (!canUserAmendRow(row)) return null;

    if (row.children && hasPermission(PERMISSIONS.FINA_RETURNS_DELETE)) {
      return (
        <ActionBtn
          onClick={() =>
            setIsDeleteConfirmOpen({
              isOpen: true,
              row: row,
            })
          }
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
          buttonName={"delete"}
        />
      );
    }

    const commonButtons = (
      <>
        {row.id > 0 && !row.reg && (
          <ActionBtn
            onClick={() => {
              setSelectedRows([row]);
              setMiModalState({ open: true, canAmend: true });
            }}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}

        {hasPermission(PERMISSIONS.FINA_RETURNS_DELETE) && (
          <ActionBtn
            onClick={() => setIsDeleteConfirmOpen({ isOpen: true, row: row })}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );

    switch (row.status) {
      case ReturnStatus.STATUS_ERRORS:
      case ReturnStatus.STATUS_CREATED:
      case ReturnStatus.STATUS_RESETED:
        return commonButtons;

      case ReturnStatus.STATUS_REJECTED:
        return (
          <>
            {hasPermission(PERMISSIONS.FINA_RETURNS_RESET) && (
              <Tooltip title={t("reset")} arrow>
                <Box>
                  <ActionBtn
                    onClick={() => openStatusModalHandler("Reseted", row)}
                    children={<RestorePageIcon />}
                    rowIndex={index}
                    buttonName={"restore"}
                  />
                </Box>
              </Tooltip>
            )}
            {commonButtons}
          </>
        );

      case ReturnStatus.STATUS_ACCEPTED:
        return (
          <>
            {hasPermission(PERMISSIONS.FINA_RETURNS_RESET) && (
              <Tooltip title={t("reset")} arrow>
                <Box>
                  <ActionBtn
                    onClick={() => openStatusModalHandler("Reseted", row)}
                    children={<RestorePageIcon />}
                    rowIndex={index}
                    buttonName={"reset"}
                  />
                </Box>
              </Tooltip>
            )}
          </>
        );

      case ReturnStatus.STATUS_PROCESSED:
        return (
          <>
            {hasPermission(PERMISSIONS.FINA_RETURNS_ACCEPT) && (
              <Tooltip title={t("accept")} arrow>
                <Box>
                  <ActionBtn
                    onClick={() => openStatusModalHandler("Accepted", row)}
                    children={<CheckCircleIcon />}
                    rowIndex={index}
                    buttonName={"accept"}
                  />
                </Box>
              </Tooltip>
            )}
            {getRejectButton(row, index)}
            {commonButtons}
          </>
        );

      case ReturnStatus.STATUS_AMENDED:
        return (
          <>
            {getRejectButton(row, index)}
            {commonButtons}
          </>
        );

      default:
        return null;
    }
  };

  const getRejectButton = (row: Return, index: number) => {
    return (
      hasPermission(PERMISSIONS.FINA_RETURNS_REJECT) && (
        <Tooltip title={t("reject")} arrow>
          <Box>
            <ActionBtn
              onClick={() => openStatusModalHandler("Rejected", row)}
              children={<RemoveCircleIcon />}
              rowIndex={index}
              buttonName={"reject"}
            />
          </Box>
        </Tooltip>
      )
    );
  };

  const updateReturnManagerState = (updates: any) => {
    const newData = {
      key: RETURN_MANAGER_TABLE_KEY,
      updatedState: {
        ...(state && state),
        ...updates,
      },
    };
    dispatch(updateState(newData));
  };

  const filterOnChangeFunction = (obj: FilterType[]) => {
    let filter: FilterType = {
      loadAllPeriodData: filteredData.loadAllPeriodData,
    };
    let stateUiFilters: FilterType = {};

    for (let o of obj) {
      switch (o.name) {
        case "fiIds":
          if (o.value?.length !== 0) {
            filter[o.name] = o.value?.map((item: any) => item.id);
            stateUiFilters[o.name] = o.value;
          }
          break;
        case "definitionId":
          if (o.value) {
            filter[o.name] = o.value.id;
            stateUiFilters[o.name] = o.value;
          }
          break;
        case "returnTypeId":
          if (o.value) {
            filter[o.name] = o.value.id;
            stateUiFilters[o.name] = o.value;
          }
          break;
        case "periodFromDate":
        case "periodToDate":
          if (o.date) {
            filter[o.name] = o.date;
            stateUiFilters[o.name] = o.date;
          }
          break;
        case "returnVersionId":
        case "returnProcessStatus":
          if (o.value) {
            filter[o.name] = o.value;
            stateUiFilters[o.name] = o.value;
          }
          break;
        default:
          break;
      }
    }

    updateReturnManagerState({
      uiFilters: stateUiFilters,
      filtersApiPayload: filter,
    });
    setFilteredData(filter);
    setActivePage(1);
  };

  const fetchFunction = async (id: number | string) => {
    if (id !== 0) {
      const returnPackage = data.find((row) => row.id === id);
      if (returnPackage) {
        return await getChildren(returnPackage, filteredData);
      }
    } else {
      return data;
    }
  };

  function getDisplayOptions() {
    if (selectedRows?.length > 0 && selectedRows[0].excelTemplate) {
      const filtered = PrintFieldOptions.filter(
        (pf) => pf.type === "XLSX" || pf.type === "HTML"
      );
      return filtered;
    }

    return PrintFieldOptions;
  }

  const ButtonTitleWrapper = ({ children }: any) => {
    return <StyledBtnTitleWrapper>{children}</StyledBtnTitleWrapper>;
  };

  const TreeGridMemo = useMemo(() => {
    return (
      <TreeGrid
        treeState={treeState}
        setTreeState={setTreeState}
        fetchFunction={fetchFunction}
        data={data}
        columns={columns}
        rowSelectHandler={rowSelectHandler}
        idName={"id"}
        parentIdName={"parentRowId"}
        rootId={0}
        rowDeleteFunction={() => {}}
        loading={loadingMask}
        actionButtons={actionButtons}
        selectedElements={selectedRows}
        hideCheckBox={true}
        filterOnChangeFunction={filterOnChangeFunction}
        size={"small"}
        onDoubleClick={(row: Return) => {
          onDoubleClick(row);
        }}
        defaultExpandedRowsIds={defaultExpandedRowsIds}
        orderRowByHeader={orderRowByHeader}
      />
    );
  }, [data, columns, loadingMask, loadingSkeleton, treeState]);

  const onDoubleClick = (row: Return) => {
    if (!row.reg) {
      setMiModalState({ open: true, canAmend: canUserAmendRow(row) });
      setSelectedRows([row]);
    }
  };

  const isSaveAsDisabled = () => {
    const row = selectedRows[0];

    return selectedRows.length !== 1 || !canUserAmendRow(row) || row?.reg;
  };

  const isReviewDisabled = () => {
    return !selectedRows || selectedRows.length === 0 || selectedRows[0].reg;
  };

  const expandUnExpandRowsHandler = async () => {
    const data = treeState.treeData;

    let updatedData: any[] = [];
    let alreadyFetchedChildren = data.length === dataChildren.current.length;

    if (expandAll && alreadyFetchedChildren) {
      updatedData = data.map((row) => {
        let temp = dataChildren.current.find((item) => item.id === row.id);
        return {
          ...row,
          ...(temp && { children: temp.children }),
        };
      });
    } else if (expandAll) {
      updatedData = await Promise.all(
        data.map(async (row) => {
          const children = await fetchFunction(row.id);
          return { ...row, children };
        })
      );
    } else {
      updatedData = data.map((row) => ({ ...row, children: null }));
    }

    setTreeState((prevState) => ({ ...prevState, treeData: updatedData }));
  };

  const isStatusDisabled = () => {
    if (!selectedRows?.length) return true;

    return selectedRows.some((row) => !canUserAmendRow(row));
  };

  const isProcessDisabled = () => {
    if (!selectedRows?.length) return true;

    if (selectedRows.some((row) => !canUserAmendRow(row))) return true;

    return !generalValidityHandler(selectedRows, [
      ReturnStatus.STATUS_PROCESSED,
      ReturnStatus.STATUS_AMENDED,
    ]);
  };

  return (
    <StyledRoot data-testid={"return-manager-container"}>
      <Box
        sx={(theme) => ({
          width: "100%",
          borderBottom: `${theme.palette.borderColor}`,
        })}
      >
        <StyledHeader data-testid={"header"}>
          <Tooltip title={t("loadalldata")}>
            <Box marginRight={"5px"} data-testid={"load-all-data-switch"}>
              <SwitchBtn
                onClick={() => {
                  setLoadAllDataSwitchEnabled(!loadAllDataSwitchEnabled);
                  setFilteredData({
                    ...filteredData,
                    loadAllPeriodData: !loadAllDataSwitchEnabled,
                  });
                  updateReturnManagerState({
                    loadAllDataSwitchEnabled: !loadAllDataSwitchEnabled,
                    filtersApiPayload: {
                      ...(state?.filtersApiPayload ?? {}),
                      loadAllPeriodData: !loadAllDataSwitchEnabled,
                    },
                  });
                }}
                checked={loadAllDataSwitchEnabled}
                size={"small"}
                data-testid={loadAllDataSwitchEnabled ? "checked" : "unchecked"}
              />
            </Box>
          </Tooltip>

          <TableCustomizationButton
            hideLabel={true}
            showTooltip={true}
            columns={generatecolumns() || []}
            setColumns={setColumns}
            isDefault={false}
            hasColumnFreeze={false}
            tableKey={RETURN_MANAGER_TABLE_KEY}
            iconButton={true}
          />

          <Tooltip title={expandAll ? t("shrink") : t("expand")}>
            <StyledIconBtn
              disabled={false}
              size="large"
              onClick={() => setExpandAll(!expandAll)}
              data-testid={expandAll ? "shrink-button" : "expand-button"}
            >
              {expandAll ? (
                <StyledExpandFilesIcon color={"#5D789A"} />
              ) : (
                <StyledShrinkExpandIcon color={"#5D789A"} />
              )}
            </StyledIconBtn>
          </Tooltip>
          <StyledIconBtn size="large">
            <Tooltip title={t("help")}>
              <StyledHelpIcon
                onClick={() => setIsHelpModalOpen(true)}
                data-testid={"help-button"}
              />
            </Tooltip>
          </StyledIconBtn>

          <StyledIconBtn size="large">
            <Tooltip title={t("printreturntype")}>
              <StyledAssigmentIcon
                onClick={() => setIsRTypeModalOpen(true)}
                data-testid={"print-return-type-button"}
              />
            </Tooltip>
          </StyledIconBtn>

          {hasPermission(PERMISSIONS.FINA_RETURNS_PROCESS) && (
            <GhostBtn
              style={{
                marginRight: "8px",
              }}
              onClick={() => setOpenProcessModal(true)}
              disabled={isProcessDisabled()}
              tooltipText={t("process")}
              startIcon={<StyledCloudIcon />}
              data-testid={"process-button"}
            >
              <ButtonTitleWrapper>{t("process")}</ButtonTitleWrapper>
            </GhostBtn>
          )}

          <GhostBtn
            style={{
              marginRight: "8px",
            }}
            onClick={() => {
              setIsHistoryOpen(true);
            }}
            disabled={
              selectedRows &&
              (selectedRows.length > 1 ||
                selectedRows.length === 0 ||
                selectedRows[0]?.id < 0 ||
                selectedRows[0].group)
            }
            tooltipText={t("history")}
            startIcon={<StyledHistoryToggleOffIcon />}
            data-testid={"history-button"}
          >
            <ButtonTitleWrapper>{t("history")}</ButtonTitleWrapper>
          </GhostBtn>

          <GhostBtn
            disabled={isStatusDisabled()}
            style={{
              marginRight: "8px",
            }}
            onClick={handleClick}
            tooltipText={t("status")}
            startIcon={<StyledNewReleasesIcon />}
            endIcon={<StyledKeyboardArrowDownIcon />}
            data-testid={"status-button"}
          >
            <ButtonTitleWrapper>{t("status")}</ButtonTitleWrapper>
          </GhostBtn>

          <GhostBtn
            style={{
              marginRight: "8px",
            }}
            onClick={() => {
              if (selectedRows?.length > 0) {
                setActionStatus("saveAs");
                setSaveAsModalOpen(true);
              }
            }}
            disabled={isSaveAsDisabled()}
            tooltipText={t("saveAs")}
            startIcon={<StyledSaveIcon />}
            data-testid={"save-as-button"}
          >
            <ButtonTitleWrapper>{t("saveAs")}</ButtonTitleWrapper>
          </GhostBtn>
          {saveAsModalOpen && (
            <ReturnSaveAsModal
              selectedReturns={selectedRows}
              returnVersions={returnVersions.filter((rv) => {
                return rv.id !== selectedRows[0].versionId;
              })}
              onClose={() => {
                setSaveAsModalOpen(false);
              }}
              onSave={async (selectedReturn, versionId, note) => {
                await saveAsClickHandler(selectedReturn, versionId, note);
                setSaveAsModalOpen(false);
              }}
              onSaveActionStatusHandler={async (
                selectedReturn,
                reportStatus,
                note
              ) => {
                await onSaveActionStatusHandler(
                  selectedReturn,
                  reportStatus,
                  note
                );
                setSaveAsModalOpen(false);
              }}
              saveAsModalOpen={saveAsModalOpen}
              actionStatus={actionStatus}
            />
          )}

          <FilePrintField
            label={t("review")}
            icon={<StyledRemoveRedEyeIcon />}
            handleClick={handleReview}
            buttonProps={{
              style: {
                marginRight: "8px",
                color: "#F5F7FA",
              },
              "data-testid": "review-button",
            }}
            isDisabled={isReviewDisabled}
            displayOptions={getDisplayOptions()}
          />

          {hasPermission(PERMISSIONS.FINA_RETURNS_AMEND) && (
            <PrimaryBtn
              onClick={() => setOpenCreateModal(true)}
              tooltipText={t("addNew")}
              endIcon={<StyledAddIcon />}
              data-testid={"create-button"}
            >
              <span>{t("addNew")}</span>
            </PrimaryBtn>
          )}

          {openCreateModal && (
            <ReturnCreateModal
              returnVersions={returnVersions}
              onClose={() => {
                setOpenCreateModal(false);
              }}
              init={init}
            />
          )}
        </StyledHeader>
      </Box>
      <StyledGridContainer>
        <StyledContent flex={1}>
          {loadingSkeleton ? (
            <MainGridSkeleton columns={columns} paddingLeft={"15px"} />
          ) : (
            TreeGridMemo
          )}
        </StyledContent>
      </StyledGridContainer>
      <Grid sx={(theme: any) => ({ ...theme.pagePaging({ size: "default" }) })}>
        <InfinitePaging
          onRowsPerPageChange={(number) => setRowPerPage(number)}
          initialPage={pagingPage}
          onPageChange={(number) => setActivePage(number)}
          dataQuantity={data.length}
        />
      </Grid>
      {miModalState.open && (
        <MiModal
          config={config}
          selectedReturn={selectedRows[0]}
          setMiModalOpen={setMiModalState}
          saveAndProcessHandler={saveAndProcessHandler}
          canAmend={miModalState.canAmend}
        />
      )}
      {isHistoryOpen && (
        <ClosableModal
          onClose={() => setIsHistoryOpen(false)}
          open={isHistoryOpen}
          title={"returnHistory"}
          width={1000}
          height={540}
        >
          <ReturnManagerHistoryModal selectedRows={selectedRows} />
        </ClosableModal>
      )}
      <StyledPopover
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        data-testid={"statuses-popover"}
      >
        {hasPermission(PERMISSIONS.FINA_RETURNS_ACCEPT) && (
          <StyledStatusItem
            onClick={() => {
              generalValidityHandler(selectedRows, [
                ReturnStatus.STATUS_PROCESSED,
              ]) && openStatusModalHandler("Accepted");
            }}
            disabled={
              !generalValidityHandler(selectedRows, [
                ReturnStatus.STATUS_PROCESSED,
              ])
            }
            data-testid={"accepted"}
          >
            {t("accept")}
          </StyledStatusItem>
        )}
        {hasPermission(PERMISSIONS.FINA_RETURNS_RESET) && (
          <StyledStatusItem
            onClick={() => {
              generalValidityHandler(selectedRows, [
                ReturnStatus.STATUS_ACCEPTED,
                ReturnStatus.STATUS_REJECTED,
              ]) && openStatusModalHandler("Reseted");
            }}
            disabled={
              !generalValidityHandler(selectedRows, [
                ReturnStatus.STATUS_ACCEPTED,
                ReturnStatus.STATUS_REJECTED,
              ])
            }
            data-testid={"reset"}
          >
            {t("reset")}
          </StyledStatusItem>
        )}

        {hasPermission(PERMISSIONS.FINA_RETURNS_REJECT) && (
          <StyledStatusItem
            onClick={() => {
              generalValidityHandler(selectedRows, [
                ReturnStatus.STATUS_AMENDED,
                ReturnStatus.STATUS_PROCESSED,
              ]) && openStatusModalHandler("Rejected");
            }}
            disabled={
              !generalValidityHandler(selectedRows, [
                ReturnStatus.STATUS_AMENDED,
                ReturnStatus.STATUS_PROCESSED,
              ])
            }
            data-testid={"reject"}
          >
            {t("reject")}
          </StyledStatusItem>
        )}
      </StyledPopover>

      {isDeleteConfirmOpen.isOpen && (
        <DeleteForm
          loadingBtn={true}
          loading={isDeleteConfirmOpen.loading}
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("return")}
          isDeleteModalOpen={isDeleteConfirmOpen.isOpen}
          setIsDeleteModalOpen={() => {
            setIsDeleteConfirmOpen({ isOpen: false, row: null, loading: true });
          }}
          onDelete={() => {
            deleteReturnHandler(
              isDeleteConfirmOpen.row,
              setIsDeleteConfirmOpen
            );
            setIsDeleteConfirmOpen({ isOpen: true, row: null, loading: true });
          }}
          showConfirm={false}
        />
      )}
      {openProcessModal && (
        <ReturnProcessModal
          selectedReturns={selectedRows}
          openProcessModal={openProcessModal}
          onClose={() => {
            setOpenProcessModal(false);
          }}
          returnsData={treeState.treeData}
          setTreeState={setTreeState}
        />
      )}

      {isHelpModalOpen && (
        <ReturnStatusHelperModal
          open={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
        />
      )}

      {isRTypeModalOpen && (
        <ClosableModal
          open={isRTypeModalOpen}
          width={1300}
          height={580}
          title={t("printreturntype")}
          onClose={() => setIsRTypeModalOpen(false)}
        >
          <RTPrintModal
            returnVersions={returnVersions}
            returnDefinitions={definitions}
            returnTypes={returnTypes}
          />
        </ClosableModal>
      )}
    </StyledRoot>
  );
};

export default ReturnManagerPage;
