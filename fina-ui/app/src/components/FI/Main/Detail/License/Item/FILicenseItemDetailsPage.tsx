import { Box, Grid, IconButton } from "@mui/material";
import CopyCellButton from "../../../../../common/Grid/CopyCellButton";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import TextButton from "../../../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { FieldType } from "../../../../util/FiUtil";
import FiInput from "../../../../Common/FiInput";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GradingIcon from "@mui/icons-material/Grading";
import FILicenseItemComment from "./FILicenseItemComment";
import FILicenseItemBankingOperation from "./FILicenseItemBankingOperation";
import ConfirmModal from "../../../../../common/Modal/ConfirmModal";
import { SaveIcon } from "../../../../../../api/ui/icons/SaveIcon";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ToolbarIcon from "../../../../../common/Icons/ToolbarIcon";
import FiHistoryBar from "../History/FiHistoryBar";
import GhostBtn from "../../../../../common/Button/GhostBtn";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import {
  CommentType,
  LicenseHistoryDataType,
  LicensesDataType,
} from "../../../../../../types/fi.type";
import { CancelIcon } from "../../../../../../api/ui/icons/CancelIcon";

const StyledHeaderText = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "150%",
  "& .MuiIconButton-root": {
    padding: "0px !important",
  },
}));

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#AEB8CB" : "#5D789A",
  cursor: "pointer",
  width: "16px",
  height: "16px",
}));

const StyledArrowIconButton = styled(IconButton)({
  transform: "rotate(180deg)",
  color: "#C2CAD8",
  marginLeft: 10,
});

const StyledHistoryContainer = styled(Box)({
  width: 350,
  height: "100%",
  position: "absolute",
  backgroundColor: "#FFF",
  top: 0,
  right: 0,
  transitionDuration: "0.5s",
  zIndex: 99999,
  transition: "linear 1s",
});

const StyledToolbarIconsBox = styled(Box)({
  minWidth: 210,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "6px",
});

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: 23,
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  marginLeft: 8,
}));

const StyledGrid = styled(Grid)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
}));

interface FILicenseItemDetailsPageProps {
  licenseDetails: LicensesDataType;
  onSaveFunction: (data: LicensesDataType) => void;
  saveLicenseCommentFunction: (comment: any) => Promise<any | string>;
  deleteLicenseCommentFunction: (comment: CommentType) => void;
  saveBankingOperationCommentFunc: (
    comment: any,
    operationId: number
  ) => Promise<any>;
  deleteBankingOperationCommentFunc: (commentId: number) => void;
  setSelectedLicense: (data: LicensesDataType | null) => void;
  isLicenseModalOpen: boolean;
  setIsLicenseModalOpen: (val: boolean) => void;
  setIsEdit: (val: boolean) => void;
  isEdit: boolean;
  historyPagingPage: number;
  setHistoryPagingPage: (page: number) => void;
  historyPagingLimit: number;
  onHistoryPagingLimitChange: (limit: number) => void;
  originalSelectedLicense: LicensesDataType | null;
  getLicenseHistory: () => void;
  historyList: LicenseHistoryDataType[];
  historyListLength: number;
  generalEditMode: boolean;
  setGeneralEditMode: (val: boolean) => void;
  reviewAsPDF: () => void;
}

export interface LicenseData {
  licenseNumber: string | null;
  registrationDate: number | null;
  status: string;
  comments: any;
}

const FILicenseItemDetailsPage: React.FC<FILicenseItemDetailsPageProps> = ({
  licenseDetails,
  onSaveFunction,
  saveLicenseCommentFunction,
  deleteLicenseCommentFunction,
  saveBankingOperationCommentFunc,
  deleteBankingOperationCommentFunc,
  setSelectedLicense,
  isLicenseModalOpen,
  setIsLicenseModalOpen,
  setIsEdit,
  isEdit,
  historyPagingPage,
  setHistoryPagingPage,
  historyPagingLimit,
  originalSelectedLicense,
  getLicenseHistory,
  historyList,
  historyListLength,
  generalEditMode,
  setGeneralEditMode,
  reviewAsPDF,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [licenseData, setLicenseData] = useState<LicenseData>({
    licenseNumber: null,
    registrationDate: null,
    status: "ACTIVE",
    comments: [],
  });

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);
  const [isHistoryBarOpen, setHistoryBarOpen] = useState(false);

  const getLicenseDetailsClone = () => {
    if (licenseDetails) {
      return JSON.parse(JSON.stringify(licenseDetails));
    }
  };

  const historyModeHandler = (item: LicenseHistoryDataType | null) => {
    if (item) setHistoryMode(true);
  };
  const cancelMainInfoEdit = () => {
    setIsLicenseModalOpen(true);
  };

  const onConfirmCancel = () => {
    setSelectedLicense(getLicenseDetailsClone());
    setIsEdit(false);
    setIsLicenseModalOpen(false);
    setGeneralEditMode(false);
  };

  const onMainInfoSave = () => {
    setConfirmOpen(true);
  };

  useEffect(() => {
    setLicenseData({
      licenseNumber: licenseDetails.code ?? null,
      registrationDate: licenseDetails.creationDate!,
      status: licenseDetails.licenceStatus,
      comments: licenseDetails.comments ?? [],
    });
  }, [licenseDetails]);

  const saveGeneral = () => {
    setIsEdit(false);
    setConfirmOpen(false);
    let data: LicensesDataType = { ...licenseDetails };
    data.code = licenseData.licenseNumber as string;
    data.creationDate = Number(licenseData.registrationDate);
    data.licenceStatus = licenseData.status ? licenseData.status : "SUSPENDED";
    data.comments = licenseData.comments;
    onSaveFunction(data);
    setGeneralEditMode(false);
  };

  return (
    licenseDetails && (
      <Box
        height={"100%"}
        sx={(theme: any) => ({
          backgroundColor: theme.palette.paperBackground,
          display: "flex",
          flexDirection: "column",
        })}
      >
        <StyledHistoryContainer
          style={{
            transform: isHistoryBarOpen ? "translate(0)" : "translate(350px)",
          }}
        >
          <FiHistoryBar
            setHistoryBarOpen={setHistoryBarOpen}
            historyPagingPage={historyPagingPage}
            setHistoryPagingPage={setHistoryPagingPage}
            historyPagingLimit={historyPagingLimit}
            historyModeHandler={historyModeHandler}
            setHistoryData={setSelectedLicense}
            historyList={historyList}
            historyLength={historyListLength}
            selectedHistory={licenseDetails}
          />
        </StyledHistoryContainer>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          padding={"13px 16px"}
          alignItems={"center"}
        >
          <StyledHeaderText display={"flex"}>
            {licenseDetails.licenseType?.name}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              margin={"0px 5px"}
            >
              <StyledDivider />
              <CopyCellButton text={licenseDetails.licenseType?.name} />
            </Box>
          </StyledHeaderText>
          <StyledToolbarIconsBox>
            {!isEdit ? (
              !historyMode ? (
                <>
                  <ToolbarIcon
                    onClickFunction={() => {
                      setHistoryBarOpen(true);
                      getLicenseHistory();
                    }}
                    Icon={<HistoryRoundedIcon />}
                    data-testid={"history-button"}
                  />
                  <ToolbarIcon
                    onClickFunction={reviewAsPDF}
                    Icon={<InsertDriveFileIcon />}
                    data-testid={"download-pdf-button"}
                  />
                  {hasPermission(PERMISSIONS.FI_AMEND) && (
                    <StyledEditIcon
                      style={{ opacity: generalEditMode ? 0.6 : 1 }}
                      onClick={() => {
                        if (!generalEditMode) {
                          setIsEdit(true);
                          setGeneralEditMode(true);
                        }
                      }}
                      data-testid={"edit-button"}
                    />
                  )}
                </>
              ) : (
                <Box>
                  <GhostBtn
                    onClick={() => {
                      setHistoryMode(false);
                      setSelectedLicense(originalSelectedLicense);
                    }}
                    endIcon={<UndoRoundedIcon />}
                  >
                    {t("backToOriginal")}
                  </GhostBtn>
                  <StyledArrowIconButton
                    onClick={() => setHistoryBarOpen(true)}
                  >
                    <DoubleArrowRoundedIcon fontSize={"small"} />
                  </StyledArrowIconButton>
                </Box>
              )
            ) : (
              <>
                <TextButton
                  color={"secondary"}
                  onClick={() => cancelMainInfoEdit()}
                >
                  {t("cancel")}
                </TextButton>
                <span
                  style={{
                    borderLeft: "1px solid #687A9E",
                    height: 14,
                  }}
                >
                  &nbsp;
                </span>
                <TextButton
                  onClick={() => onMainInfoSave()}
                  endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
                >
                  {t("save")}
                </TextButton>
              </>
            )}
          </StyledToolbarIconsBox>
        </Box>
        <div style={{ maxHeight: "100%", overflow: "auto" }}>
          <StyledGrid container padding={"0px 12px 12px 12px"}>
            <Grid item xs={12} md={6} lg={4}>
              <div style={{ padding: "0px 4px" }}>
                <FiInput
                  title={t("licenseNumber")}
                  name={"licenseNumber"}
                  value={licenseData.licenseNumber}
                  icon={<ImportContactsIcon />}
                  editMode={isEdit}
                  onValueChange={(value) => {
                    licenseData["licenseNumber"] = value;
                  }}
                  inputTypeProp={{ inputType: FieldType.STRING }}
                  width={"100%"}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <div style={{ padding: "0px 4px" }}>
                <FiInput
                  title={t("registrationDate")}
                  name={"registrationDate"}
                  value={licenseData.registrationDate}
                  icon={<CalendarTodayIcon />}
                  editMode={isEdit}
                  onValueChange={(value) => {
                    licenseData["registrationDate"] = value;
                  }}
                  inputTypeProp={{ inputType: FieldType.DATE }}
                  width={"100%"}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <div style={{ padding: "0px 4px" }}>
                <FiInput
                  title={t("status")}
                  name={"status"}
                  value={licenseData.status}
                  icon={<GradingIcon />}
                  editMode={isEdit}
                  onValueChange={(value) => {
                    licenseData["status"] = value;
                  }}
                  inputTypeProp={{
                    inputType: FieldType.LIST,
                    listData: [
                      { label: t("active"), value: "ACTIVE" },
                      { label: t("inactive"), value: "SUSPENDED" },
                    ],
                  }}
                  width={"100%"}
                />
              </div>
            </Grid>
          </StyledGrid>
          <FILicenseItemComment
            licenseData={licenseData}
            saveLicenseCommentFunction={saveLicenseCommentFunction}
            deleteLicenseCommentFunction={deleteLicenseCommentFunction}
            generalEditMode={generalEditMode}
            setGeneralEditMode={setGeneralEditMode}
          />
          <FILicenseItemBankingOperation
            licenseDetails={licenseDetails}
            onSaveFunction={(data) => {
              onSaveFunction(data);
              setGeneralEditMode(false);
            }}
            saveBankingOperationCommentFunc={saveBankingOperationCommentFunc}
            deleteBankingOperationCommentFunc={
              deleteBankingOperationCommentFunc
            }
            generalEditMode={generalEditMode}
            setGeneralEditMode={setGeneralEditMode}
          />
        </div>
        <ConfirmModal
          isOpen={isConfirmOpen}
          setIsOpen={setConfirmOpen}
          onConfirm={saveGeneral}
          confirmBtnTitle={t("save")}
          headerText={t("saveHeaderText")}
          bodyText={t("saveBodyText")}
          additionalBodyText={t("changes")}
          icon={<SaveIcon />}
        />
        <ConfirmModal
          isOpen={isLicenseModalOpen}
          setIsOpen={setIsLicenseModalOpen}
          onConfirm={onConfirmCancel}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          additionalBodyText={t("changes")}
          bodyText={t("cancelBodyText")}
          icon={<CancelIcon />}
        />
      </Box>
    )
  );
};

export default FILicenseItemDetailsPage;
