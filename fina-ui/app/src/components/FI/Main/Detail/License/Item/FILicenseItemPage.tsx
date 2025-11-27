import { Box, Grid } from "@mui/material";
import ToolbarListSearch from "../../../../../Catalog/MiniCatalog/ListSearch";
import MiniPaging from "../../../../../common/Paging/MiniPaging";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import FILicenseList from "./FILicenseList";
import FILicenseItemDetailsPage from "./FILicenseItemDetailsPage";
import LicenseItemSkeleton from "../../../../Skeleton/FiLicense/LicenseItemSkeleton";
import FIListSkeleton from "../../../../../common/Skeletons/FIListSkeleton";
import ToolbarListSearchSkeleton from "../../../../../common/Skeletons/ToolbarListSearchSkeleton";
import MiniPagingSkeleton from "../../../../../common/Skeletons/MiniPagingSkeleton";
import { styled } from "@mui/material/styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  CommentType,
  LicenseHistoryDataType,
  LicensesDataType,
} from "../../../../../../types/fi.type";

const StyledContentContainer = styled(Grid)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
}));

const StyledLeftContainer = styled(Grid)(({ theme }: any) => ({
  height: "100%",
  borderRight: theme.palette.borderColor,
}));

const StyledDrawerContainer = styled(Box)({
  height: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
});

const StyledPagesBox = styled(Box)(({ theme }: any) => ({
  bottom: "0",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  borderBottomLeftRadius: "8px",
}));

interface ParamsType {
  id: string;
  licenseItemId: string;
}

interface FILicenseItemPageProps {
  licenseLength: number;
  pagingPage: number;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  loading: boolean;
  licenses: LicensesDataType[];
  onFilterClick: (searchValue: string) => void;
  filterValue: string;
  onLicenseItemClick: (license: LicensesDataType) => void;
  selectedLicense: LicensesDataType;
  onSaveFunction: (data: LicensesDataType) => void;
  saveLicenseCommentFunction: (comment: any) => Promise<any | string>;
  deleteLicenseCommentFunction: (comment: CommentType) => void;
  saveBankingOperationCommentFunc: (
    comment: any,
    operationId: number
  ) => Promise<any>;
  deleteBankingOperationCommentFunc: (commentId: number) => void;
  setSelectedLicense: React.Dispatch<
    React.SetStateAction<LicensesDataType | null>
  >;
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
}

const FILicenseItemPage: React.FC<FILicenseItemPageProps> = ({
  licenseLength,
  pagingPage,
  pagingLimit,
  setPagingPage,
  loading,
  licenses,
  onFilterClick,
  filterValue,
  onLicenseItemClick,
  selectedLicense,
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
  onHistoryPagingLimitChange,
  originalSelectedLicense,
  getLicenseHistory,
  historyList,
  historyListLength,
  generalEditMode,
  setGeneralEditMode,
}) => {
  const { id, licenseItemId } = useParams<ParamsType>();
  const pageRef = useRef<HTMLDivElement>(null);

  const ItemLeftSide = () => (
    <StyledDrawerContainer>
      <div>
        {loading ? (
          <ToolbarListSearchSkeleton />
        ) : (
          <ToolbarListSearch
            onFilter={onFilterClick}
            to={`/fi/${id}/license`}
            height={55}
            filterValue={filterValue}
          />
        )}
      </div>
      {loading ? (
        <FIListSkeleton listItemCount={7} />
      ) : (
        <div style={{ height: "100%", overflow: "auto" }}>
          <FILicenseList
            data={licenses}
            onSelect={onLicenseItemClick}
            itemId={licenseItemId}
          />
        </div>
      )}
      <StyledPagesBox>
        {loading ? (
          <MiniPagingSkeleton />
        ) : (
          <MiniPaging
            totalNumOfRows={licenseLength}
            initialedPage={pagingPage}
            onPageChange={setPagingPage}
            initialRowsPerPage={pagingLimit}
          />
        )}
      </StyledPagesBox>
    </StyledDrawerContainer>
  );

  const reviewAsPDF = () => {
    const input = pageRef.current;

    if (!input) return;

    const originalHeight = input.style.height;
    input.style.height = "auto";
    input.style.overflow = "visible";

    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");

        input.style.height = originalHeight;
        input.style.overflow = "auto";
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  return (
    <Box height="100%">
      <StyledContentContainer container>
        <StyledLeftContainer item xs={2} data-testid={"left-container"}>
          {ItemLeftSide()}
        </StyledLeftContainer>
        <Grid
          item
          xs={10}
          sx={(theme: any) => ({
            height: "100%",
            position: "relative",
            paddingBottom: "60px",
            backgroundColor: theme.palette.paperBackground,
          })}
          data-testid={"right-container"}
        >
          <div ref={pageRef} style={{ height: "100%", overflow: "auto" }}>
            {loading ? (
              <LicenseItemSkeleton />
            ) : (
              <FILicenseItemDetailsPage
                licenseDetails={selectedLicense}
                onSaveFunction={onSaveFunction}
                saveLicenseCommentFunction={saveLicenseCommentFunction}
                deleteLicenseCommentFunction={deleteLicenseCommentFunction}
                saveBankingOperationCommentFunc={
                  saveBankingOperationCommentFunc
                }
                deleteBankingOperationCommentFunc={
                  deleteBankingOperationCommentFunc
                }
                setSelectedLicense={setSelectedLicense}
                isLicenseModalOpen={isLicenseModalOpen}
                setIsLicenseModalOpen={setIsLicenseModalOpen}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                historyPagingPage={historyPagingPage}
                setHistoryPagingPage={setHistoryPagingPage}
                historyPagingLimit={historyPagingLimit}
                onHistoryPagingLimitChange={onHistoryPagingLimitChange}
                originalSelectedLicense={originalSelectedLicense}
                getLicenseHistory={getLicenseHistory}
                historyList={historyList}
                historyListLength={historyListLength}
                generalEditMode={generalEditMode}
                setGeneralEditMode={setGeneralEditMode}
                reviewAsPDF={reviewAsPDF}
              />
            )}
          </div>
        </Grid>
      </StyledContentContainer>
    </Box>
  );
};

export default FILicenseItemPage;
