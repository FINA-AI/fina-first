import { Box } from "@mui/system";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import ActionBtn from "../../common/Button/ActionBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import DeleteForm from "../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import { FeedbackType } from "../../../types/feedback.type";
import { GridColumnType } from "../../../types/common.type";

interface FeedbackMainPageType {
  data: FeedbackType[];
  columns: GridColumnType[];
  pagingPage: number;
  pagingLimit: number;
  totalResult: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  onDelete: (id: number) => void;
  setData: (data: FeedbackType[]) => void;
}

const FeedbackMainPage: React.FC<FeedbackMainPageType> = ({
  data,
  columns,
  pagingPage,
  onPagingLimitChange,
  pagingLimit,
  setPagingPage,
  totalResult,
  onDelete,
  setData,
}) => {
  const { t } = useTranslation();
  const feedbackEmptyObj = {
    id: 0,
    feedbackCategory: { id: 0, name: "", nameStrId: 0 },
    description: "",
    nameStrId: 0,
    rating: 0,
  };
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    row: FeedbackType;
  }>({
    open: false,
    row: feedbackEmptyObj,
  });

  let actionButtons = (row: FeedbackType, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => {
            setDeleteModal({ open: true, row: row });
          }}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
        />
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          minHeight: 0,
        }}
      >
        <GridTable
          columns={columns}
          rows={data}
          setRows={setData}
          selectedRows={[]}
          actionButtons={actionButtons}
        />
      </Box>
      <Box sx={(theme: any) => ({ ...theme.pagePaging({ size: "default" }) })}>
        <Paging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={totalResult}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </Box>
      {deleteModal.open && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("feedback")}
          isDeleteModalOpen={true}
          setIsDeleteModalOpen={() =>
            setDeleteModal({ open: false, row: feedbackEmptyObj })
          }
          onDelete={() => {
            onDelete(deleteModal.row.id);
            setDeleteModal({ open: false, row: feedbackEmptyObj });
          }}
        />
      )}
    </>
  );
};

export default FeedbackMainPage;
