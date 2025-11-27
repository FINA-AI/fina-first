import FeedbackCategoryCard from "./FeedbackCategoryCard";
import Grid from "@mui/material/Grid";
import Paging from "../../common/Paging/Paging";
import React from "react";
import { Box } from "@mui/system";
import { FeedbackCategoryType } from "../../../types/feedback.type";

interface FeedbackCategoryPageType {
  pagingPage: number;
  setPagingPage: (limit: number) => void;
  onPagingLimitChange: (limit: number) => void;
  pagingLimit: number;
  totalResult: number;
  onDeleteCategory: (id: number | null) => void;
  setIsAddNewOpen: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; card: FeedbackCategoryType }>
  >;
  data: FeedbackCategoryType[];
}

const FeedbackCategoryPage: React.FC<FeedbackCategoryPageType> = ({
  pagingPage,
  onPagingLimitChange,
  pagingLimit,
  setPagingPage,
  totalResult,
  data,
  onDeleteCategory,
  setIsAddNewOpen,
}) => {
  return (
    <>
      <Box
        sx={(theme) => ({
          height: "100%",
          minHeight: 0,
          borderTop: theme.palette.borderColor,
          paddingTop: "8px",
        })}
      >
        <Grid container>
          {data.map((item: FeedbackCategoryType, index) => {
            return (
              <FeedbackCategoryCard
                key={index}
                card={item}
                onDeleteCategory={onDeleteCategory}
                setIsEditOpen={setIsAddNewOpen}
                index={index}
              />
            );
          })}
        </Grid>
      </Box>
      <Box
        sx={(theme: any) => ({
          ...theme.pagePaging({ size: "default" }),
        })}
      >
        <Paging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={totalResult}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </Box>
    </>
  );
};

export default FeedbackCategoryPage;
