import { Box, Grid } from "@mui/material";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import CriminalRecordCard from "./CriminalRecordCard";
import CriminalRecordSkeleton from "../../../Skeleton/FiCriminalRecord/CriminalRecordSkeleton";
import ToolbarIcon from "../../../../common/Icons/ToolbarIcon";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import FICriminalRecordHistoryContainer from "../../../../../containers/FI/Main/CriminalRecord/FICriminalRecordHistoryContainer";
import NoRecordIndicator from "../../../../common/NoRecordIndicator/NoRecordIndicator";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { CriminalRecordDataType } from "../../../../../types/fi.type";

const StyledGrid = styled(Grid)(({ theme }: any) => ({
  width: "100%",
  padding: theme.toolbar.padding,
  borderBottom: theme.palette.borderColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
}));

const StyledBody = styled(Grid)({
  padding: "12px 0",
  boxSizing: "border-box",
  height: `100%`,
  position: "relative",
  margin: 0,
  overflow: "auto",
});

interface FICriminalRecordMainPageProps {
  loading: boolean;
  criminalRecords: CriminalRecordDataType[];
  editMode: { editable: number | null };
  setEditMode: React.Dispatch<
    React.SetStateAction<{ editable: number | null }>
  >;
  onAdd: (record: CriminalRecordDataType) => void;
  onEdit: (record: CriminalRecordDataType) => void;
  onDelete: (id: number) => void;
  fiId: number;
}

const FICriminalRecordMainPage: React.FC<FICriminalRecordMainPageProps> = ({
  loading,
  criminalRecords,
  editMode,
  setEditMode,
  onAdd,
  onEdit,
  onDelete,
  fiId,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [criminalRecord, setCriminalRecord] =
    useState<CriminalRecordDataType | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const onCloseHistoryClick = () => {
    setIsHistoryModalOpen(false);
  };

  return (
    <Box height={"100%"}>
      <Box width={"100%"}>
        <StyledGrid>
          <Box display={"flex"} marginRight={"5px"}>
            <ToolbarIcon
              onClickFunction={() => {
                setIsHistoryModalOpen(true);
              }}
              Icon={<HistoryRoundedIcon />}
              data-testid={"history-button"}
            />
          </Box>
          {hasPermission(PERMISSIONS.FI_AMEND) && (
            <PrimaryBtn
              onClick={() => {
                setAddNew(true);
                setEditMode({ editable: -1 });
              }}
              fontSize={12}
              endIcon={<AddIcon />}
              data-testid={"create-button"}
            >
              {t("addNew")}
            </PrimaryBtn>
          )}
        </StyledGrid>
      </Box>
      {loading ? (
        <CriminalRecordSkeleton />
      ) : (
        <StyledBody>
          {!loading && !addNew && criminalRecords.length === 0 && (
            <NoRecordIndicator />
          )}
          <Grid overflow={"auto"} container item xs={12}>
            {addNew && (
              <CriminalRecordCard
                onAdd={onAdd}
                onEdit={onEdit}
                item={{ editable: -1 }}
                editMode={editMode}
                setEditMode={setEditMode}
                setAddNew={setAddNew}
                dataTestId={"new-card"}
              />
            )}
            {criminalRecords.map((item, i) => {
              return (
                <CriminalRecordCard
                  key={item.id}
                  item={item}
                  setAddNew={setAddNew}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  onAdd={onAdd}
                  onEdit={onEdit}
                  onDeleteButton={() => {
                    setCriminalRecord(item);
                    setIsDeleteModalOpen(true);
                  }}
                  dataTestId={`card-${i + 1}`}
                />
              );
            })}
          </Grid>
        </StyledBody>
      )}
      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("criminalRecord")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDelete={() => {
            setIsDeleteModalOpen(false);
            if (criminalRecord) onDelete(criminalRecord.id);
          }}
        />
      )}
      {isHistoryModalOpen && (
        <FICriminalRecordHistoryContainer
          onCloseHistoryClick={onCloseHistoryClick}
          fiId={fiId}
        />
      )}
    </Box>
  );
};

export default FICriminalRecordMainPage;
