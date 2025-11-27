import { Box, Grid } from "@mui/material";
import GhostBtn from "../../../../../common/Button/GhostBtn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import TableCustomizationButton from "../../../../../common/Button/TableCustomizationButton";
import { FI_PHYSICAL_PERSON_HISTORY_TABLE_KEY } from "../../../../../../api/TableCustomizationKeys";
import { styled } from "@mui/material/styles";
import { GridColumnType } from "../../../../../../types/common.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "secondToolbarActive",
})(({ secondToolbarActive }: { secondToolbarActive: boolean }) => ({
  padding: secondToolbarActive ? "0px" : "12px 16px",
}));

const StyledSecondaryToolbar = styled(Box)({
  width: "530px",
  background: "#157AFF",
  borderRadius: "10px 10px 0px 10px",
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
  paddingTop: "12px",
  paddingBottom: "12px",
  paddingRight: "20px",
});

const StyledDivider = styled("span")({
  minHeight: "30px",
  minWidth: "2px",
  display: "inline-block",
  background: "#FFFFFF",
  marginLeft: "20px",
});

const StyledRecordIcon = styled(FiberManualRecordIcon)({
  color: "#FFFFFF",
  marginLeft: "20px",
  width: "15px",
  height: "10px",
});

interface FILegalPersonHeaderProps {
  columns: GridColumnType[];
  selectedRows: PhysicalPersonDataType[];
  setSelectedRows: React.Dispatch<
    React.SetStateAction<PhysicalPersonDataType[]>
  >;
  deleteMultyBranchsFunction: () => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const FILegalPersonHeader: React.FC<FILegalPersonHeaderProps> = ({
  columns,
  selectedRows,
  setSelectedRows,
  deleteMultyBranchsFunction,
  setColumns,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <StyledRoot secondToolbarActive={selectedRows.length > 1}>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Box />
        {selectedRows.length < 2 && (
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <span>
              <TableCustomizationButton
                columns={columns}
                setColumns={setColumns}
                hasColumnFreeze={true}
                tableKey={FI_PHYSICAL_PERSON_HISTORY_TABLE_KEY}
              />
            </span>
          </Grid>
        )}
        {selectedRows.length > 1 && (
          <StyledSecondaryToolbar>
            <span>
              <TableCustomizationButton
                columns={columns}
                setColumns={setColumns}
                hasColumnFreeze={true}
                tableKey={FI_PHYSICAL_PERSON_HISTORY_TABLE_KEY}
              />
            </span>
            <StyledRecordIcon />
            <span
              style={{
                color: "#FFFFFF",
              }}
            >
              {t("selectedItemsFi", { itemsLength: selectedRows.length })}
            </span>
            <GhostBtn
              onClick={() => setDeleteModalOpen(true)}
              height={32}
              style={{ marginLeft: "15px" }}
              endIcon={<DeleteIcon />}
            >
              {t("delete")}
            </GhostBtn>
            <StyledDivider />
            <span
              style={{ cursor: "pointer", marginLeft: "20px" }}
              onClick={() => setSelectedRows([])}
            >
              {t("cancel")}
            </span>
          </StyledSecondaryToolbar>
        )}
      </Box>
      {deleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={deleteModalOpen}
          setIsDeleteModalOpen={setDeleteModalOpen}
          onDelete={() => {
            deleteMultyBranchsFunction();
            setDeleteModalOpen(false);
          }}
        />
      )}
    </StyledRoot>
  );
};

export default FILegalPersonHeader;
