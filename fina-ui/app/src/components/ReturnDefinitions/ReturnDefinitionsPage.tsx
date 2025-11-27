import { Box } from "@mui/system";
import React, { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import ReturnDefinitionsHeader from "./ReturnDefinitionsHeader";
import ActionBtn from "../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import DeleteForm from "../common/Delete/DeleteForm";
import ReturnDefinitionsTableGenerateModal from "./ReturnDefinitionsTableGenerateModal";
import ReturnTypeContainer from "../../containers/ReturnTypes/ReturnTypeContainer";
import ReturnVersionsContainer from "../../containers/ReturnVersionsContainer/ReturnVersionsContainer";
import { connect } from "react-redux";
import { PERMISSIONS } from "../../api/permissions";
import ReturnDefinitionsGrid from "./ReturnDefinitionsGrid";
import withLoading from "../../hoc/withLoading";
import useConfig from "../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";

import {
  GeneratedRDTable,
  ReturnDefinitionTable,
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import { Config } from "../../types/config.type";

interface ReturnDefinitionsPageProps {
  isDetailPageOpen: boolean;
  setIsDetailPageOpen: (value: boolean) => void;
  pagingPage: number;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  currentReturnDefinition: ReturnDefinitionType;
  setCurrentReturnDefinition: (rd: ReturnDefinitionType | {}) => void;
  GeneralInfoEditMode: boolean;
  setGeneralInfoEditMode: (value: boolean) => void;
  returnTypes: ReturnType[];
  columns: GridColumnType[];
  rows: ReturnDefinitionType[];
  setRows: (rows: ReturnDefinitionType[]) => void;
  selectedRows: ReturnDefinitionType[];
  setSelectedRows: (rows: ReturnDefinitionType[]) => void;
  loading: boolean;
  tables: ReturnDefinitionTable[];
  setTables: (tables: ReturnDefinitionTable[]) => void;
  totalResults: number;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
  generateTableModalOpen: boolean;
  setGenerateTableModalOpen: (value: boolean) => void;
  generateTableData: GeneratedRDTable;
  columnFilterConfig: columnFilterConfigType[];
  config: Config;
  initReturnTypes: () => Promise<ReturnType[] | undefined>;
  reorderReturnDefinitionTables: VoidFunction;
  scrollToIndex: number;
  onPageChange(pageNum: number): void;
  orderRowByHeader(cellName: string, arrowDirection: string): void;
  rebuildReturnDependencyHandler(requestTimeout: number): Promise<true | false>;
  templateHandleClick(type: any): void;
  filterOnChangeFunction(obj: FilterType): void;
  tableGenerateHandler(ids: number[]): void;
  initReturnDefinitionsTable(row?: ReturnDefinitionType): void;
  onDeleteClick(selectedRows: ReturnDefinitionType[]): void;
  saveReturnDefinition(data: ReturnDefinitionType): void;
  onPagingLimitChange(limit: number): void;
}

const StyledRoot = styled(Grid)({
  overflow: "hidden",
  height: "100%",
  borderRadius: 8,
  paddingTop: 10,
  display: "flex",
  flexDirection: "column",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
  borderRadius: "8px 8px 0px 0px",
});

const ReturnDefinitionsPage: React.FC<ReturnDefinitionsPageProps> = ({
  isDetailPageOpen,
  setIsDetailPageOpen,
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  currentReturnDefinition,
  setCurrentReturnDefinition,
  GeneralInfoEditMode,
  setGeneralInfoEditMode,
  saveReturnDefinition,
  returnTypes,
  columns,
  rows,
  setRows,
  onDeleteClick,
  selectedRows,
  setSelectedRows,
  loading,
  tables,
  setTables,
  initReturnDefinitionsTable,
  totalResults,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  tableGenerateHandler,
  generateTableModalOpen,
  setGenerateTableModalOpen,
  generateTableData,
  columnFilterConfig,
  filterOnChangeFunction,
  templateHandleClick,
  rebuildReturnDependencyHandler,
  config,
  orderRowByHeader,
  initReturnTypes,
  reorderReturnDefinitionTables,
  onPageChange,
  scrollToIndex,
}) => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<ReturnDefinitionType>(
    {} as ReturnDefinitionType
  );
  const [activeTab, setActiveTab] = useState("returnDefinition");
  const [addNewReturnTypeModal, setAddNewReturnTypeModal] = useState(false);
  const [addNewReturnVersionsModal, setAddNewReturnVersionsModal] =
    useState(false);
  const [containersRenderer, setContainersRenderer] = useState({
    returnDefinition: true,
    returnType: false,
    returnVersion: false,
  });
  const { hasPermission } = useConfig();

  let actionButtons = (row: ReturnDefinitionType, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.FINA_RETURN_DEFINITION_AMEND) && (
          <ActionBtn
            onClick={() => {
              setGeneralInfoEditMode(true);
              setIsDetailPageOpen(true);
              setCurrentReturnDefinition(row);
              initReturnDefinitionsTable(row);
            }}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}

        {hasPermission(PERMISSIONS.FINA_RETURN_DEFINITION_DELETE) && (
          <ActionBtn
            onClick={() => {
              setSelectedRow(row);
              setIsDeleteModalOpen(true);
            }}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  const showRelevantContainer = (tabName: string) => {
    setActiveTab(tabName);
    setContainersRenderer({ ...containersRenderer, [tabName]: true });
  };

  const renderTabContent = () => {
    return (
      <>
        <div
          style={{
            display: activeTab === "returnDefinition" ? "flex" : "none",
            flexDirection: activeTab === "returnDefinition" ? "column" : "row",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {containersRenderer.returnDefinition && (
            <ReturnDefinitionsGrid
              rows={rows}
              setRows={setRows}
              columns={columns}
              loading={loading}
              selectedRows={selectedRows}
              initReturnDefinitionsTable={initReturnDefinitionsTable}
              setIsDetailPageOpen={setIsDetailPageOpen}
              setSelectedRows={setSelectedRows}
              actionButtons={actionButtons}
              columnFilterConfig={columnFilterConfig}
              filterOnChangeFunction={filterOnChangeFunction}
              isDetailPageOpen={isDetailPageOpen}
              currentReturnDefinition={currentReturnDefinition}
              setCurrentReturnDefinition={setCurrentReturnDefinition}
              GeneralInfoEditMode={GeneralInfoEditMode}
              setGeneralInfoEditMode={setGeneralInfoEditMode}
              saveReturnDefinition={saveReturnDefinition}
              returnTypes={returnTypes}
              tables={tables}
              setTables={setTables}
              onPagingLimitChange={onPagingLimitChange}
              onPageChange={onPageChange}
              totalResults={totalResults}
              pagingPage={pagingPage}
              pagingLimit={pagingLimit}
              orderRowByHeader={orderRowByHeader}
              reorderReturnDefinitionTables={reorderReturnDefinitionTables}
              scrollToIndex={scrollToIndex}
            />
          )}
        </div>
        {config &&
          config.permissions.includes(PERMISSIONS.RETURN_DEFINITION_REVIEW) && (
            <div
              style={{
                display: activeTab === "returnType" ? "block" : "none",
                height: "100%",
              }}
            >
              {containersRenderer.returnType && (
                <ReturnTypeContainer
                  addNewReturnTypeModal={addNewReturnTypeModal}
                  setAddNewReturnTypeModal={setAddNewReturnTypeModal}
                  initReturnTypes={initReturnTypes}
                />
              )}
            </div>
          )}
        <div
          style={{
            display: activeTab === "returnVersion" ? "block" : "none",
            height: "100%",
          }}
        >
          {containersRenderer.returnVersion && (
            <ReturnVersionsContainer
              setAddNewReturnVersionsModal={setAddNewReturnVersionsModal}
              addNewReturnVersionsModal={addNewReturnVersionsModal}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <Box sx={(theme: any) => ({ ...theme.mainLayout })}>
      <Typography fontSize={16} fontWeight={600}>
        {t("returnDefinition")}
      </Typography>
      <StyledRoot>
        <Grid>
          <StyledPaper>
            <ReturnDefinitionsHeader
              setIsDetailPageOpen={setIsDetailPageOpen}
              setGeneralInfoEditMode={setGeneralInfoEditMode}
              setCurrentReturnDefinition={setCurrentReturnDefinition}
              selectedRows={selectedRows}
              tableGenerateHandler={tableGenerateHandler}
              templateHandleClick={templateHandleClick}
              rebuildReturnDependencyHandler={rebuildReturnDependencyHandler}
              activeTab={activeTab}
              setAddNewReturnTypeModal={setAddNewReturnTypeModal}
              setAddNewReturnVersionsModal={setAddNewReturnVersionsModal}
              showRelevantContainer={showRelevantContainer}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
            />
          </StyledPaper>
        </Grid>

        {renderTabContent()}

        {isDeleteModalOpen && (
          <DeleteForm
            headerText={t("delete")}
            bodyText={t("deleteWarning")}
            additionalBodyText={
              !isEmpty(selectedRow)
                ? t("returnDefinition")
                : t("menu_return_definitions")
            }
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            onDelete={() => {
              if (!isEmpty(selectedRow)) {
                onDeleteClick([selectedRow]);
                setSelectedRow({} as ReturnDefinitionType);
              } else {
                onDeleteClick(selectedRows);
              }
              setIsDeleteModalOpen(false);
            }}
          />
        )}
        {generateTableModalOpen && (
          <ReturnDefinitionsTableGenerateModal
            data={generateTableData}
            open={generateTableModalOpen}
            onClose={() => setGenerateTableModalOpen(false)}
            onClick={() => setGenerateTableModalOpen(false)}
          />
        )}
      </StyledRoot>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLoading(ReturnDefinitionsPage));
