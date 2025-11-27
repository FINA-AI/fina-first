import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import SurveyToolbar from "./SurveyToolbar";
import SurveyGrid from "./SurveyGrid";
import ClosableModal from "../common/Modal/ClosableModal";
import UploadModal from "./Modals/UploadModal";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import React from "react";
import { GridColumnType } from "../../types/common.type";
import {
  Survey,
  SurveyResult,
  SurveyUploadModal,
} from "../../types/survey.type";

interface SurveyPageProps {
  columnHeaders: GridColumnType[];
  list: Survey[];
  setList: (list: Survey[]) => void;
  surveyResult: SurveyResult[];
  totalResult: number;
  pagingPage: number;
  pagingLimit: number;
  setPagingPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  uploadModal: SurveyUploadModal;
  setUploadModal: React.Dispatch<React.SetStateAction<SurveyUploadModal>>;
  uploadFile(file: File): void;
  orderRowByHeader(sortField: string, sortDir: string): void;
  setIsPublicUpload(value: boolean): void;
  onPagingLimitChange(limit: number): void;
  mapDataToSurvey(
    result: string,
    surveyName: string,
    username: string
  ): Promise<void>;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.mainLayout,
}));

const StyledTabName = styled(Typography)(({ theme }: { theme: any }) => ({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: "24px",
  color: theme.palette.textColor,
}));

const StyledContentBox = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  backgroundColor: theme.palette.paperBackground,
  marginTop: 16,
}));

const SurveyPage: React.FC<SurveyPageProps> = ({
  columnHeaders,
  list,
  setList,
  surveyResult,
  mapDataToSurvey,
  totalResult,
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  loading,
  setIsPublicUpload,
  uploadFile,
  uploadModal,
  setUploadModal,
  orderRowByHeader,
}) => {
  const { t } = useTranslation();

  return (
    <StyledRoot>
      <StyledTabName>Survey</StyledTabName>
      <StyledContentBox>
        <SurveyToolbar
          setUploadModal={setUploadModal}
          setIsPublicUpload={setIsPublicUpload}
        />
        <SurveyGrid
          columnHeaders={columnHeaders}
          list={list}
          setList={setList}
          surveyResult={surveyResult}
          mapDataToSurvey={mapDataToSurvey}
          totalResult={totalResult}
          pagingPage={pagingPage}
          pagingLimit={pagingLimit}
          onPagingLimitChange={onPagingLimitChange}
          setPagingPage={setPagingPage}
          loading={loading}
          orderRowByHeader={orderRowByHeader}
        />
      </StyledContentBox>
      <ClosableModal
        title={t(uploadModal.title)}
        onClose={() => setUploadModal({ title: "", open: false })}
        open={uploadModal.open}
        height={270}
        width={500}
      >
        <UploadModal uploadFile={uploadFile} setUploadModal={setUploadModal} />
      </ClosableModal>
    </StyledRoot>
  );
};

export default SurveyPage;
