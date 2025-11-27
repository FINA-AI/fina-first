import { Box } from "@mui/system";
import { Grid, Paper } from "@mui/material";
import React, { useMemo, useState } from "react";
import VirtualTreeGrid from "../../common/TreeGrid/VirtualTreeGrid";
import { useTranslation } from "react-i18next";
import ContextMenuItem from "../../common/ContextMenu/ContextMenuItem";
import { ContentCopy, ContentCut } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForm from "../../common/Delete/DeleteForm";
import CrudFormModal from "../../common/Modal/CrudFormModal";
import ReportManagerDetails from "./ReportManagerDetails";
import { useSnackbar } from "notistack";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MainGridSkeleton from "../../FI/Skeleton/GridSkeleton/MainGridSkeleton";
import ActionBtn from "../../common/Button/ActionBtn";
import ReportManagerToolbar from "./ReportManagerToolbar";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import Divider from "@mui/material/Divider";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import TableChartIcon from "@mui/icons-material/TableChart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { BASE_REST_URL } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { TreeGridColumnType, UIEventType } from "../../../types/common.type";
import { Report } from "../../../types/report.type";
import { DeleteModal } from "../../../containers/ReportManager/ReportManagerContainer";

interface ReportManagerPageProps {
  columns: TreeGridColumnType[];
  loading: boolean;
  data: Report[];
  refreshFunction: () => void;
  deleteModal?: DeleteModal;
  setDeleteModal: (modal: DeleteModal) => void;
  hideEmptyFoldersFunc: () => void;
  showFoldersFunc: () => void;
  treeDataFull: Report[];
  treeKey: string;
  onMoveDown(selectedNode: Report): Promise<void>;
  onMoveUp(selectedNode: Report): Promise<void>;
  onRowExpandChange(expanded: boolean, row: Report): void;
  onSaveFunction(report: Report, selectedReport: Report): void;
  deleteReport(reportId: number[]): void;
  onPasteFunction(sourceRow: Report, destinationRow: Report): void;
  getChildren(row: Report): Promise<any>;
}

export interface GenerateWizardOptions {
  open: boolean;
  fileType?: null | string;
  isSchedule?: boolean;
  generateWithFormula?: boolean;
}

interface CrudModalInfo {
  isOpen?: boolean;
  data?: Report;
  type?: string;
  edit?: boolean;
}

const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "12px 24px",
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: { theme: any }) => ({
  paddingLeft: "24px !important",
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  width: "100%",
  borderBottom: theme.palette.borderColor,
  padding: "6px",
}));

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledPaper = styled(Paper)<{ position?: string }>({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  display: "flex",
  flexDirection: "column",
  borderRadius: 0,
});

const ReportManagerPage: React.FC<ReportManagerPageProps> = ({
  columns,
  loading,
  data,
  getChildren,
  onPasteFunction,
  deleteReport,
  deleteModal,
  setDeleteModal,
  onSaveFunction,
  onRowExpandChange,
  hideEmptyFoldersFunc,
  showFoldersFunc,
  onMoveUp,
  onMoveDown,
  treeDataFull,
  treeKey,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedCutItem, setSelectedCutItem] = useState<Report | null>(null);
  const [crudModalInfo, setCrudModalInfo] = useState<CrudModalInfo>();
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  const [expandPath, setExpandPath] = useState<number[]>([]);
  const [generateWizardOptions, setGenerateWizardOptions] =
    useState<GenerateWizardOptions>({
      open: false,
      fileType: null,
      isSchedule: false,
      generateWithFormula: false,
    });

  const { hasPermission } = useConfig();

  const hasAmendPermission = hasPermission(PERMISSIONS.REPORTS_AMEND);

  const onSave = (data: Report) => {
    if (!data.code || !data.description) {
      return enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
    }

    if (crudModalInfo?.edit) {
      onSaveFunction(data, selectedReports[0]);
    } else {
      onSaveFunction(
        {
          ...data,
          editMode: crudModalInfo?.edit,
          code: data.code,
          description: data.description,
          nameStrId: 0,
          children: [],
        },
        selectedReports[0]
      );
    }

    setCrudModalInfo({ ...crudModalInfo, isOpen: false, edit: false });
  };

  let contextMenus = (selectedNode: Report) => {
    return (
      selectedNode && (
        <div key={""}>
          <ContextMenuItem
            onClick={() => setSelectedCutItem(selectedNode)}
            name={t("cut")}
            icon={<ContentCut fontSize="small" />}
            disabled={selectedNode.id <= 0}
          />
          <ContextMenuItem
            onClick={() => {
              if (selectedCutItem && selectedNode) {
                onPasteFunction(selectedCutItem, selectedNode);
                setSelectedCutItem(null);
                setSelectedCutItem(null);
              }
            }}
            name={t("paste")}
            icon={<ContentCopy fontSize="small" />}
            disabled={
              !Boolean(selectedCutItem) ||
              (selectedCutItem?.id === selectedNode?.id &&
                selectedCutItem?.parentId === selectedNode?.parentId) ||
              (selectedCutItem?.type === 2 && selectedNode?.type === 2)
            }
          />
          <Divider />
          <ContextMenuItem
            onClick={() => {
              onMoveUp(selectedNode);
            }}
            name={t("moveup")}
            icon={<MoveUpIcon fontSize="small" />}
            disabled={false}
          />
          <ContextMenuItem
            onClick={() => {
              onMoveDown(selectedNode);
            }}
            name={t("movedown")}
            icon={<MoveDownIcon fontSize="small" />}
            disabled={false}
          />
          <Divider />
          <ContextMenuItem
            onClick={() =>
              setCrudModalInfo({
                ...crudModalInfo,
                isOpen: true,
                data: selectedNode,
                type: selectedNode?.leaf ? "report" : "folder",
                edit: true,
              })
            }
            name={t("edit")}
            icon={<EditIcon fontSize="small" />}
            disabled={false}
          />
          <ContextMenuItem
            onClick={() => setDeleteModal({ isOpen: true, data: selectedNode })}
            name={t("delete")}
            icon={<DeleteIcon fontSize="small" />}
            disabled={false}
          />
        </div>
      )
    );
  };

  const downloadTemplate = (selectedReport: Report) => {
    let url = `/report/template/review?reportIds=${selectedReport.id}&fileType=xlsx`;
    window.open(BASE_REST_URL + url, "_blank");
  };

  let actionButtons = (row: Report, index: number) => {
    if (index !== 0) {
      return (
        <>
          {row.leaf && (
            <ActionBtn
              tooltipTitle={t("TemplateView")}
              children={<TableChartIcon />}
              rowIndex={index}
              onClick={() => {
                downloadTemplate(row);
              }}
              buttonName={"template-view"}
            />
          )}
          <ActionBtn
            tooltipTitle={t("schedule")}
            children={<AccessTimeIcon />}
            rowIndex={index}
            onClick={() => {
              setGenerateWizardOptions({
                open: true,
                fileType: "",
                isSchedule: true,
                generateWithFormula: false,
              });
              setSelectedReports([row]);
            }}
            buttonName={"schedule"}
          />
          {hasAmendPermission ? (
            <>
              <ActionBtn
                onClick={() =>
                  setCrudModalInfo({
                    ...crudModalInfo,
                    isOpen: true,
                    data: row,
                    type: row?.leaf ? "report" : "folder",
                    edit: true,
                  })
                }
                children={<EditIcon />}
                rowIndex={index}
                buttonName={"edit"}
              />
              <ActionBtn
                onClick={() => setDeleteModal({ isOpen: true, data: row })}
                children={<DeleteIcon />}
                color={"#FF735A"}
                rowIndex={index}
                buttonName={"delete"}
              />
            </>
          ) : (
            <></>
          )}
        </>
      );
    }
  };

  const treeIcons = {
    expandedIcon: () => {
      return (
        <FolderIcon
          style={{
            color: "#2962FF",
          }}
        />
      );
    },
    folder: () => {
      return (
        <FolderOpenIcon
          style={{
            color: "#AEB8CB",
          }}
        />
      );
    },
    leaf: () => {
      return <AssignmentIcon style={{ color: "#1c7483" }} />;
    },
  };

  const hasFolderGenerationPermission = hasPermission(
    PERMISSIONS.FINA_REPORT_FOLDER_GENERATE
  );

  const expandToPath = (report: Report) => {
    const arr = [report.id];

    const findParentRecursive = (pId: number, arr: number[]) => {
      const p = treeDataFull.find((r) => r.id === pId);
      if (p) {
        arr.push(p?.id);
        if (p?.parentId > 0) {
          findParentRecursive(p.parentId, arr);
        }
      }
      return arr;
    };

    findParentRecursive(report.parentId, arr);
    if (report.parentId !== 0) arr.push(0);

    arr.reverse();
    setExpandPath(arr);
    setSelectedReports([report]);

    return arr;
  };

  const MemoizedComponent = useMemo(
    () => (
      <>
        <StyledToolbar>
          <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
            <Box />
            <ReportManagerToolbar
              selectedReports={selectedReports}
              showFoldersFunc={showFoldersFunc}
              hideEmptyFoldersFunc={hideEmptyFoldersFunc}
              hasFolderGenerationPermission={hasFolderGenerationPermission}
              createReportClickHandler={(reportType) => {
                setCrudModalInfo({
                  ...crudModalInfo,
                  data: selectedReports[0],
                  isOpen: true,
                  type: reportType,
                });
              }}
              generateWizardOptions={generateWizardOptions}
              setGenerateWizardOptions={setGenerateWizardOptions}
              treeKey={treeKey}
            />
          </Box>
        </StyledToolbar>
        <StyledGridContainer>
          <Grid sx={{ paddingTop: "0px", height: "100%", width: "100%" }}>
            <StyledPaper>
              {loading ? (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <MainGridSkeleton columns={columns} />
                </Box>
              ) : (
                <>
                  <StyledHeader>
                    <Box width={"400px"}>
                      <CustomAutoComplete
                        data={treeDataFull}
                        onChange={(v) => {
                          if (v) {
                            expandToPath(v);
                          }
                        }}
                        valueFieldName={"id"}
                        displayFieldFunction={(r) =>
                          `${r.code} - ${r.description}`
                        }
                        renderOptionFunction={(value: string, option: any) => (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            {option.type === 1 ? (
                              <FolderOpenIcon style={{ color: "#AEB8CB" }} />
                            ) : (
                              <AssignmentIcon style={{ color: "#1c7483" }} />
                            )}
                            <span>{value}</span>
                          </span>
                        )}
                      />
                    </Box>
                  </StyledHeader>
                  <VirtualTreeGrid
                    columns={columns}
                    data={data}
                    loadChildrenFunction={(row: Report) => getChildren(row)}
                    treeIcons={treeIcons}
                    contextMenus={hasAmendPermission ? contextMenus : null}
                    selectedCutItem={selectedCutItem}
                    actionButtons={actionButtons}
                    multiRowSelectionEnabled={hasFolderGenerationPermission}
                    onRowClickFunction={(
                      row: Report,
                      event: UIEventType,
                      selectedNodes: Report[]
                    ) => {
                      //root folder
                      if (row.id === 0) {
                        setSelectedReports(selectedNodes);
                        setIsDetailPageOpen(false);
                        return;
                      }

                      // mouse left button click
                      if (event?.button === 0) {
                        setSelectedReports(selectedNodes);
                        setIsDetailPageOpen(selectedNodes.length > 0);
                      }
                      setCrudModalInfo({
                        ...crudModalInfo,
                        data: selectedNodes[0],
                      });
                    }}
                    onRowExpandChange={onRowExpandChange}
                    expandPath={expandPath}
                  />
                </>
              )}
            </StyledPaper>
            <StyledPaper position={"relative"}>
              {selectedReports.length === 1 && selectedReports[0].leaf && (
                <ReportManagerDetails
                  data={selectedReports[0]}
                  isDetailPageOpen={isDetailPageOpen}
                  setIsDetailPageOpen={setIsDetailPageOpen}
                  isReportManager={true}
                />
              )}
            </StyledPaper>
          </Grid>
        </StyledGridContainer>
      </>
    ),
    [
      data,
      columns,
      selectedReports,
      isDetailPageOpen,
      selectedCutItem,
      expandPath,
      treeDataFull,
      generateWizardOptions,
    ]
  );

  return (
    <Box
      display={"flex"}
      width={"100%"}
      height={"100%"}
      flexDirection={"column"}
    >
      {MemoizedComponent}
      {crudModalInfo?.isOpen && (
        <CrudFormModal
          onCancelClickFunction={() =>
            setCrudModalInfo({ ...crudModalInfo, isOpen: false })
          }
          data={
            crudModalInfo?.edit
              ? crudModalInfo.data
              : {
                  ...crudModalInfo.data,
                  code: "",
                  description: "",
                  leaf: crudModalInfo.type === "report",
                  parentId: selectedReports[0] ? selectedReports[0]?.id : 0,
                  id: 0,
                  type: crudModalInfo.type === "report" ? 2 : 1,
                }
          }
          configuration={[
            {
              value:
                crudModalInfo?.edit && crudModalInfo?.data?.code
                  ? crudModalInfo?.data?.code
                  : "",
              type: "text",
              label: "code",
              name: "code",
              onChangeFunction: () => {},
            },
            {
              value:
                crudModalInfo?.edit && crudModalInfo?.data?.description
                  ? crudModalInfo?.data?.description
                  : "",
              type: "text",
              label: "description",
              name: "description",
              onChangeFunction: () => {},
            },
          ]}
          title={crudModalInfo?.edit ? t("editReport") : t("addReport")}
          onSaveClickFunction={(newData, data) => {
            const tmp = Object.assign(data, newData);
            onSave(tmp);
          }}
          isModalOpen={crudModalInfo?.isOpen}
          requiredFields={["code", "description"]}
        />
      )}

      {deleteModal?.isOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("report")}
          isDeleteModalOpen={deleteModal?.isOpen}
          setIsDeleteModalOpen={() =>
            setDeleteModal({ isOpen: false, data: null })
          }
          onDelete={() => {
            if (deleteModal?.data?.id) deleteReport([deleteModal?.data?.id]);
          }}
          showConfirm={false}
        />
      )}
    </Box>
  );
};

export default ReportManagerPage;
