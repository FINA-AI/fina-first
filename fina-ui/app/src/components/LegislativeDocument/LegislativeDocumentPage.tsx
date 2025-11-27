import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useMemo, useState } from "react";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import EditIcon from "@mui/icons-material/Edit";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import GhostBtn from "../common/Button/GhostBtn";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import UploadIcon from "@mui/icons-material/Upload";
import TreeGrid from "../common/TreeGrid/TreeGrid";
import ActionBtn from "../common/Button/ActionBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForm from "../common/Delete/DeleteForm";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClosableModal from "../common/Modal/ClosableModal";
import CategoryModal from "./Modal/CategoryModal";
import UploadModal from "./Modal/UploadModal";
import {
  CategoryAttachmentType,
  CategoryType,
  LegislativeDocumentType,
  UploadDataType,
} from "../../types/legislativeDocument.type";
import { TreeGridColumnType, TreeGridStateType } from "../../types/common.type";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/system";
import withLoading from "../../hoc/withLoading";

interface LegislativeDocumentPageProps {
  treeState: TreeGridStateType;
  setTreeState: React.Dispatch<React.SetStateAction<TreeGridStateType>>;
  data: LegislativeDocumentType[];
  loader: boolean;
  columns: TreeGridColumnType[];
  fetchFunction: (
    parentId: number,
    data: LegislativeDocumentType[],
    row: CategoryType
  ) => void;
  onDeleteFile: (row: CategoryAttachmentType) => void;
  onFileUpload: (category: CategoryType, uploadData: UploadDataType) => void;
  addCategories: (data: CategoryType[]) => void;
  onRefresh: () => void;
}

const StyledMainBox = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.mainLayout,
}));
const StyledContentContainer = styled(Grid)(({ theme }: { theme: any }) => ({
  ...theme.page,
}));
const StyledTypography = styled(Typography)(({ theme }: { theme: any }) => ({
  ...theme.pageTitle,
}));
const StyledBox = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.pageContent,
}));
const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.pageToolbar,
  padding: "8px 16px",
  justifyContent: "flex-end",
  borderBottom: theme.palette.borderColor,
}));
const StyledIcon = styled(Box)(({ theme }: { theme: any }) => ({
  "& .MuiButtonBase-root": {
    width: "32px",
    height: "32px",
  },
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
}));

const LegislativeDocumentPage: React.FC<LegislativeDocumentPageProps> = ({
  treeState,
  setTreeState,
  data,
  columns,
  loader,
  fetchFunction,
  onDeleteFile,
  onFileUpload,
  addCategories,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const hasAmendPermission = hasPermission(
    PERMISSIONS.LEGISLATIVE_DOCUMENT_AMEND
  );

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    row: null | CategoryAttachmentType;
  }>({ isOpen: false, row: null });
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    {} as CategoryType
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<{
    isOpen: boolean;
    row: null | CategoryAttachmentType | CategoryType;
  }>({
    isOpen: false,
    row: null,
  });

  const rowSelectHandler = (
    row: CategoryType,
    __: any,
    ___: any,
    alreadySelected: boolean
  ) => {
    if (alreadySelected) {
      setSelectedCategory({} as CategoryType);
      return;
    }
    if (row.level !== 2) {
      setSelectedCategory(row);
      return;
    }
    setSelectedCategory({} as CategoryType);
  };

  let actionButtons = (row: CategoryAttachmentType, index: number) => {
    return (
      <>
        {row.level === 2 && (
          <>
            {hasAmendPermission && (
              <ActionBtn
                onClick={() => {
                  setIsUploadModalOpen({ isOpen: true, row: row });
                }}
                children={<EditIcon />}
                rowIndex={index}
                buttonName={"edit"}
              />
            )}
            {hasPermission(PERMISSIONS.LEGISLATIVE_DOCUMENT_DELETE) && (
              <ActionBtn
                onClick={() => {
                  setDeleteModal({ isOpen: true, row: row });
                }}
                children={<DeleteIcon />}
                color={"#FF735A"}
                rowIndex={index}
                buttonName={"delete"}
              />
            )}
          </>
        )}
      </>
    );
  };

  const PageToolbar = () => {
    return (
      <StyledToolbar data-testid="toolbar">
        <Box display={"flex"}>
          <StyledIcon marginRight={"8px"}>
            <ToolbarIcon
              disabled={loader}
              onClickFunction={onRefresh}
              Icon={<RefreshIcon />}
              isSquare={true}
              data-testid={"refresh-icon"}
            />
          </StyledIcon>

          <GhostBtn
            onClick={() => {
              setIsCategoryModalOpen(true);
            }}
            style={{ marginRight: "8px" }}
            height={33}
            disabled={!hasAmendPermission || loader}
            startIcon={<LineWeightIcon />}
            data-testid={"category-button"}
          >
            {t("category")}
          </GhostBtn>

          <PrimaryBtn
            onClick={() => {
              setIsUploadModalOpen({
                isOpen: true,
                row: selectedCategory,
              });
            }}
            fontSize={12}
            disabled={
              !hasAmendPermission ||
              !(selectedCategory && selectedCategory.level === 1)
            }
            endIcon={<UploadIcon />}
            data-testid={"uploadFile-button"}
          >
            {t("uploadFile")}
          </PrimaryBtn>
        </Box>
        {isUploadModalOpen && (
          <ClosableModal
            title={t("uploadFile")}
            onClose={() => setIsUploadModalOpen({ isOpen: false, row: null })}
            open={isUploadModalOpen.isOpen}
            height={400}
            width={700}
          >
            <UploadModal
              onFileUpload={onFileUpload}
              setIsUploadModalOpen={setIsUploadModalOpen}
              row={isUploadModalOpen.row}
              data={data}
            />
          </ClosableModal>
        )}
      </StyledToolbar>
    );
  };

  const memoizedTreeGrid = useMemo(
    () => (
      <TreeGrid
        treeState={treeState}
        setTreeState={setTreeState}
        fetchFunction={fetchFunction}
        data={data}
        columns={columns}
        rowSelectHandler={rowSelectHandler}
        idName={"id"}
        parentIdName={"parentRowId"}
        rootId={0}
        rowDeleteFunction={() => {}}
        loading={loader}
        actionButtons={actionButtons}
        selectedElements={[selectedCategory]}
        hideCheckBox={true}
      />
    ),
    [data, loader, treeState]
  );

  return (
    <StyledMainBox>
      <StyledContentContainer>
        <StyledTypography>{t("legislativeDocument")}</StyledTypography>
        <StyledBox>
          <PageToolbar />
          <Grid style={{ overflow: "auto" }} height={"100%"}>
            <Grid flex={1} height={"100%"}>
              {memoizedTreeGrid}
            </Grid>
          </Grid>
        </StyledBox>
      </StyledContentContainer>
      {isCategoryModalOpen && (
        <ClosableModal
          onClose={() => setIsCategoryModalOpen(false)}
          open={isCategoryModalOpen}
          title={t("categories")}
          width={600}
          height={480}
        >
          <CategoryModal
            setIsCategoryModalOpen={setIsCategoryModalOpen}
            addCategories={addCategories}
          />
        </ClosableModal>
      )}

      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("document")}
        isDeleteModalOpen={deleteModal.isOpen}
        setIsDeleteModalOpen={() =>
          setDeleteModal({ isOpen: false, row: null })
        }
        onDelete={() => {
          if (deleteModal.row) {
            onDeleteFile(deleteModal.row);
            setDeleteModal({ isOpen: false, row: null });
          }
        }}
        showConfirm={false}
      />
    </StyledMainBox>
  );
};

export default withLoading(LegislativeDocumentPage);
