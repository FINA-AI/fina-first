import { Box } from "@mui/material";
import Paging from "../../../../../common/Paging/Paging";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "flex-end",
  zIndex: theme.zIndex.drawer - 1,
  boxShadow: "3px -20px 8px -4px #bababa1a",
  position: "relative",
  height: theme.general.footerHeight,
}));

interface FIManagementPageFooterProps {
  managementsLength: number;
  pagingPage: number;
  pagingLimit: number;
  onPagingLimitChange: (number: number) => void;
  setPagingPage: (number: number) => void;
}

const FIManagementPageFooter: React.FC<FIManagementPageFooterProps> = ({
  managementsLength,
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
}) => {
  return (
    <StyledRoot>
      <Paging
        onRowsPerPageChange={(number) => onPagingLimitChange(number)}
        onPageChange={(number) => setPagingPage(number)}
        totalNumOfRows={managementsLength}
        initialPage={pagingPage}
        initialRowsPerPage={pagingLimit}
      />
    </StyledRoot>
  );
};

export default FIManagementPageFooter;
