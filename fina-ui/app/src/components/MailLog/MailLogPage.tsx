import { Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import Paging from "../common/Paging/Paging";
import GridTable from "../common/Grid/GridTable";
import MailLogSide from "./MailLogSide";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { MAIL_LOG_TABLE_KEY } from "../../api/TableCustomizationKeys";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import { attachmentType, MailLogDataType } from "../../types/mailLog.type";
import { styled } from "@mui/material/styles";
import ClosableModal from "../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import GhostBtn from "../common/Button/GhostBtn";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import { getOrCreateSyncFlag } from "../../api/services/mailLogService";
import { useSnackbar } from "notistack";

export const StyledContentContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.page,
}));

export const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

export const StyledToolbar = styled(Box)(() => ({
  padding: "9px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
}));

export const StyledGridContainer = styled(Grid)(() => ({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
}));

export const StyledContent = styled(Grid)(() => ({
  paddingTop: 0,
  height: "100%",
  width: "100%",
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  padding: 10,
  paddingRight: 20,
}));

const StyledModalContent = styled(Grid)({
  padding: "30px 30px 15px 30px",
  width: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const StyledPagePagingContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

export const StyledPaper = styled(Paper)(() => ({
  width: "100%",
  height: "100%",
  boxShadow: "none",
}));

export const StyledCustomizationButton = styled("span")(() => ({
  paddingLeft: "8px",
}));

interface MailLogPageProps {
  data: MailLogDataType[];
  setData: (data: MailLogDataType[]) => void;
  setActivePage: (page: number) => void;
  setRowPerPage: (rowsPerPage: number) => void;
  dataLength: number;
  columns: GridColumnType[];
  loading: boolean;
  pagingPage: number;
  initialRowsPerPage: number;
  downloadFile: (fileId: number) => void;
  FilterOnChangeFunction?: (filterData: FilterType[]) => void;
  getReply: (
    messageId: number,
    isRobotMail: boolean
  ) => Promise<{ data: MailLogDataType | {}; attachments: attachmentType[] }>;
  columnFilterConfig?: columnFilterConfigType[];
  setColumns: (columns: GridColumnType[]) => void;
}
interface SideMenuType {
  open: boolean;
  row: MailLogDataType | null;
}

const MailLogPage: React.FC<MailLogPageProps> = ({
  data,
  columns,
  setColumns,
  columnFilterConfig,
  setData,
  loading,
  setRowPerPage,
  setActivePage,
  dataLength,
  pagingPage,
  initialRowsPerPage,
  downloadFile,
  FilterOnChangeFunction,
  getReply,
}) => {
  const [sideMenu, setSideMenu] = useState<SideMenuType>({
    open: false,
    row: null,
  });
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncActionObject, setSyncActionObject] = useState({
    disableButtons: false,
    resultText: "",
  });

  const onSync = () => {
    getOrCreateSyncFlag()
      .then(() => {
        setIsSyncModalOpen(false);
        enqueueSnackbar(t("synchronized"), { variant: "success" });
      })
      .catch((error) => {
        setSyncActionObject({
          disableButtons: true,
          resultText: error?.response?.data.message,
        });
      });
  };

  return (
    <StyledContentContainer>
      <StyledRoot>
        <StyledToolbar>
          <ToolbarIcon
            onClickFunction={() => setIsSyncModalOpen(true)}
            Icon={<SyncIcon />}
            data-testid={"sync-button"}
          />
          <StyledCustomizationButton>
            <TableCustomizationButton
              columns={columns}
              setColumns={setColumns}
              isDefault={false}
              hasColumnFreeze={true}
              tableKey={MAIL_LOG_TABLE_KEY}
            />
          </StyledCustomizationButton>
        </StyledToolbar>

        <StyledGridContainer>
          <StyledContent flex={1}>
            <StyledPaper>
              <GridTable
                columns={columns}
                columnFilterConfig={columnFilterConfig}
                rows={data}
                setRows={setData}
                rowOnClick={(row: MailLogDataType, deselect: boolean) => {
                  setSideMenu({ open: !deselect, row: row });
                }}
                loading={loading}
                filterOnChangeFunction={FilterOnChangeFunction}
              />
            </StyledPaper>
            <StyledPaper>
              <MailLogSide
                sideMenu={sideMenu}
                setSideMenu={setSideMenu}
                downloadFile={downloadFile}
                getReply={getReply}
              />
            </StyledPaper>
          </StyledContent>
        </StyledGridContainer>
        <StyledPagePagingContainer>
          <Paging
            onRowsPerPageChange={(number) => setRowPerPage(number)}
            onPageChange={(number) => setActivePage(number)}
            totalNumOfRows={dataLength}
            initialPage={pagingPage}
            initialRowsPerPage={initialRowsPerPage}
          />
        </StyledPagePagingContainer>
      </StyledRoot>

      {isSyncModalOpen && (
        <ClosableModal
          onClose={() => setIsSyncModalOpen(false)}
          open={isSyncModalOpen}
          width={375}
          height={syncActionObject.resultText ? 130 : 120}
          includeHeader={false}
          title={t("synchronize")}
          disableBackdropClick={false}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box display={"flex"} flex={1}>
              <StyledModalContent container spacing={2} direction={"column"}>
                <Grid item>
                  {syncActionObject.resultText || t("areYouSureToSyncMail")}
                </Grid>
              </StyledModalContent>
            </Box>
            <StyledFooter
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <GhostBtn
                onClick={() => setIsSyncModalOpen(false)}
                style={{ marginRight: "10px" }}
                data-testid={"cancel-button"}
              >
                {t("close")}
              </GhostBtn>
              {!syncActionObject.disableButtons && (
                <PrimaryBtn
                  onClick={onSync}
                  endIcon={<SyncIcon />}
                  data-testid={"confirm-button"}
                >
                  {t("sync")}
                </PrimaryBtn>
              )}
            </StyledFooter>
          </Box>
        </ClosableModal>
      )}
    </StyledContentContainer>
  );
};

export default MailLogPage;
