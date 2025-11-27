import { Box, Grid } from "@mui/material";
import DeleteForm from "../../../common/Delete/DeleteForm";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ClosableModal from "../../../common/Modal/ClosableModal";
import FiTypeConfigCard from "./FiTypeConfigCard";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import FiTypeCreateForm from "./FiTypeCreateForm";
import CardGridSkeleton from "../../Skeleton/Configuration/CardGridSkeleton";
import NoRecordIndicator from "../../../common/NoRecordIndicator/NoRecordIndicator";
import { styled } from "@mui/system";
import { FiTypeDataType } from "../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  boxSizing: "border-box",
  padding: theme.toolbar.padding,
  margin: 0,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  borderBottom: theme.palette.borderColor,
}));

const StyledBody = styled(Grid)(({ loading }: { loading: boolean }) => ({
  boxSizing: "border-box",
  position: "relative",
  height: "100%",
  padding: "8px 12px",
  margin: 0,
  overflow: loading ? "hidden" : "auto",
}));

interface FiTypeConfigMainPageProps {
  fiTypesData: FiTypeDataType[];
  loading: boolean;
  addNewFiType: (newFiType: Partial<FiTypeDataType>) => void;
  editFiType: (fiType: FiTypeDataType) => void;
  deleteFiType: (id: number) => void;
}

const FiTypeConfigMainPage: React.FC<FiTypeConfigMainPageProps> = ({
  fiTypesData,
  loading,
  addNewFiType,
  editFiType,
  deleteFiType,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [currFiType, setCurrFiType] = useState<Partial<FiTypeDataType>>({});
  const { t } = useTranslation();

  return (
    <StyledRoot>
      <StyledHeader>
        <div>
          <PrimaryBtn
            data-testid={`fiConfig-fiType-addNewButton`}
            onClick={() => {
              setAddForm(true);
            }}
            endIcon={<AddIcon />}
          >
            <>{t("addNew")}</>
          </PrimaryBtn>
        </div>
      </StyledHeader>

      <StyledBody loading={loading}>
        {!loading && fiTypesData.length === 0 && <NoRecordIndicator />}
        {loading ? (
          <CardGridSkeleton cardNumber={fiTypesData.length} fiType={true} />
        ) : (
          <Grid container item xs={12} direction={"row"} wrap={"wrap"}>
            {fiTypesData.map((item) => (
              <FiTypeConfigCard
                key={item.id}
                fiType={item}
                onEditButton={(fiType) => {
                  setCurrFiType(fiType);
                  setEditForm(true);
                }}
                onDeleteButton={(fiType) => {
                  setCurrFiType(fiType);
                  setIsDeleteConfirmOpen(true);
                }}
              />
            ))}
          </Grid>
        )}
      </StyledBody>

      <ClosableModal
        onClose={() => {
          setAddForm(false);
        }}
        open={addForm}
        includeHeader={true}
        width={400}
        title={t("addFiType")}
        disableBackdropClick={true}
      >
        <FiTypeCreateForm
          onSave={addNewFiType}
          onCancel={() => setAddForm(false)}
        />
      </ClosableModal>

      <ClosableModal
        onClose={() => {
          setEditForm(false);
        }}
        open={editForm}
        includeHeader={true}
        width={400}
        title={t("editFiType")}
        disableBackdropClick={true}
      >
        <FiTypeCreateForm
          onSave={editFiType}
          onCancel={() => {
            setEditForm(false);
          }}
          currFiType={currFiType}
        />
      </ClosableModal>

      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("fiType")}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          if (currFiType.id) {
            deleteFiType(currFiType.id);
          }
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
    </StyledRoot>
  );
};

export default FiTypeConfigMainPage;
