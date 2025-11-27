import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import RefreshIcon from "@mui/icons-material/Refresh";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import GridTable from "../common/Grid/GridTable";
import Paging from "../common/Paging/Paging";
import ActionBtn from "../common/Button/ActionBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForm from "../common/Delete/DeleteForm";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useHistory } from "react-router-dom";
import ReturnCreationScheduleModal from "./ReturnCreationScheduleModal";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import { GridColumnType } from "../../types/common.type";
import { ReturnSchedule } from "../../types/returnCreationSchedule.type";
import {
  AddModal,
  DeleteModal,
} from "../../containers/ReturnCreationSchedule/ReturnCreationScheduleContainer";
import { ReturnVersion } from "../../types/importManager.type";

interface Props {
  columns: GridColumnType[];
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  pagingLimit: number;
  pagingPage: number;
  totalResults: number;
  data: ReturnSchedule[];
  setData: (data: ReturnSchedule[]) => void;
  loadData: () => void;
  loading: boolean;
  deleteModal: DeleteModal;
  setDeleteModal: (modal: DeleteModal) => void;
  onRowDeleteFunction: () => void;
  addModal: AddModal;
  setAddModal: (modal: AddModal) => void;
  returnVersions: ReturnVersion[];

  runFunction(report: ReturnSchedule): void;

  onSort(sortField: string, arrowDirection: string): void;

  saveFunction(info: ReturnSchedule): void;
}

const StyledMainLayout = styled(Box)({
  padding: "16px",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
});

const StyledContentContainer = styled(Grid)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: "150px",
}));

const StyledMainTitleText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: theme.palette.textColor,
  display: "inline",
}));

const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  padding: theme.toolbar.padding,
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
}));

const StyledCreateBox = styled(Box)({
  display: "flex",
  "& .MuiSvgIcon-root": {
    marginLeft: "5px",
  },
});

const StyledPagingContainer = styled(Box)(({ theme }: { theme: any }) => ({
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  position: "relative",
  height: theme.general.footerHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderBottomLeftRadius: "4px",
  borderBottomRightRadius: "4px",
}));

const StyledTitleContainer = styled(Grid)({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingTop: "8px",
  paddingBottom: "12px",
});

const ReturnCreationSchedulePage: React.FC<Props> = ({
  columns,
  onPagingLimitChange,
  setPagingPage,
  pagingLimit,
  pagingPage,
  totalResults,
  data,
  setData,
  loadData,
  loading,
  deleteModal,
  setDeleteModal,
  onRowDeleteFunction,
  addModal,
  setAddModal,
  returnVersions,
  saveFunction,
  runFunction,
  onSort,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { hasPermission } = useConfig();

  let actionButtons = (row: ReturnSchedule, index: number) => {
    return (
      <>
        {row.status === "STATUS_SCHEDULED" &&
          hasPermission(PERMISSIONS.RETURN_SCHEDULER_AMEND) && (
            <ActionBtn
              onClick={() => runFunction(row)}
              children={<PlayCircleIcon />}
              color={"rgb(41, 98, 255)"}
              rowIndex={index}
              tooltipTitle={t("run")}
              data-testid={`schedule-run-actionButton-${index}`}
            />
          )}

        {hasPermission(PERMISSIONS.RETURN_SCHEDULER_DELETE) && (
          <ActionBtn
            onClick={() => setDeleteModal({ isOpen: true, row: row })}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            data-testid={`schedule-delete-actionButton-${index}`}
          />
        )}
      </>
    );
  };

  const rowOnClick = (row: ReturnSchedule) => {
    history.push({
      pathname: `/returncreationschedule/${row.id}`,
      state: { taskName: row.taskName },
    });
  };

  return (
    <StyledMainLayout>
      <Grid
        container
        spacing={0}
        overflow={"hidden"}
        height={"100%"}
        borderRadius={"4px"}
      >
        <Grid item xs={12}>
          <StyledTitleContainer item xs={12}>
            <StyledMainTitleText>
              {t("returnCreationSchedule")}
            </StyledMainTitleText>
          </StyledTitleContainer>
        </Grid>
        <StyledContentContainer item xs={12}>
          <StyledToolbar>
            <Box display={"flex"} justifyContent={"center"}>
              <ToolbarIcon
                onClickFunction={() => loadData()}
                Icon={<RefreshIcon />}
              />
              {hasPermission(PERMISSIONS.RETURN_SCHEDULER_AMEND) && (
                <PrimaryBtn
                  onClick={() => setAddModal({ isOpen: true, data: null })}
                  style={{ marginLeft: "8px" }}
                >
                  <StyledCreateBox
                    data-testid={"return-creation-schedule-add-button"}
                  >
                    {t("create")} <AddIcon />
                  </StyledCreateBox>
                </PrimaryBtn>
              )}
            </Box>
          </StyledToolbar>
          <Grid item xs={12} height={"100%"}>
            <GridTable
              rows={data}
              setRows={setData}
              columns={columns}
              selectedRows={[]}
              loading={loading}
              rowOnClick={(row: ReturnSchedule) => {
                rowOnClick(row);
              }}
              checkboxEnabled={false}
              actionButtons={actionButtons}
              orderRowByHeader={onSort}
            />
          </Grid>
          <StyledPagingContainer>
            <Paging
              onRowsPerPageChange={(number) => onPagingLimitChange(number)}
              onPageChange={(number) => setPagingPage(number)}
              totalNumOfRows={totalResults}
              initialPage={pagingPage}
              initialRowsPerPage={pagingLimit}
            />
          </StyledPagingContainer>
        </StyledContentContainer>
      </Grid>
      {deleteModal?.isOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("returnSchedules")}
          isDeleteModalOpen={true}
          setIsDeleteModalOpen={() => setDeleteModal(null)}
          onDelete={() => onRowDeleteFunction()}
        />
      )}
      {addModal?.isOpen && (
        <ReturnCreationScheduleModal
          addModal={addModal}
          setAddModal={setAddModal}
          returnVersions={returnVersions}
          saveFunction={saveFunction}
        />
      )}
    </StyledMainLayout>
  );
};

export default ReturnCreationSchedulePage;
