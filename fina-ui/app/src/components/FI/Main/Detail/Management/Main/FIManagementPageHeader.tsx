import { Box, Grid } from "@mui/material";
import PrimaryBtn from "../../../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import FiManagementCreateContainer from "../../../../../../containers/FI/Main/Management/FiManagementCreateContainer";
import React, { useState } from "react";
import Dropdown from "../../../../../common/Button/Dropdown";
import ClosableModal from "../../../../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import TableCustomizationButton from "../../../../../common/Button/TableCustomizationButton";
import { FI_MANAGEMENT_TABLE_KEY } from "../../../../../../api/TableCustomizationKeys";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import {
  FiManagementType,
  ManagementDataType,
} from "../../../../../../types/fi.type";
import { GridColumnType } from "../../../../../../types/common.type";

const StyledRoot = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  background: theme.palette.mode === "dark" ? "rgb(43, 55, 72)" : "inherit",
}));

const StyledGrid = styled(Grid)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  float: "right",
  width: "100%",
  justifyContent: "space-between",
}));

interface FIManagementPageHeaderProps {
  fiId: number;
  setSelection: (type: FiManagementType) => void;
  selectedType?: FiManagementType;
  managementType: FiManagementType[];
  setManagement: React.Dispatch<React.SetStateAction<ManagementDataType[]>>;
  management: ManagementDataType[];
  columns: GridColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
}

const FIManagementPageHeader: React.FC<FIManagementPageHeaderProps> = ({
  fiId,
  setSelection,
  selectedType,
  managementType,
  setManagement,
  management,
  columns,
  setColumns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [isAddNewFiManagementOpen, setIsAddNewFiManagementOpen] =
    useState(false);

  return (
    <StyledRoot data-testid={"header"}>
      <StyledGrid>
        <div>
          <Dropdown
            dropdownData={managementType.map((item) => ({
              key: item.id,
              id: item.id,
              additional: "",
              name: item.name,
              code: item.code,
            }))}
            setSelection={(val) => {
              const selected = managementType.find((m) => m.id === val.id);
              if (selected) {
                setSelection(selected);
              }
            }}
            selectedType={
              selectedType
                ? {
                    key: selectedType.id,
                    id: selectedType.id,
                    additional: "",
                    name: selectedType.name,
                    code: selectedType.code,
                  }
                : undefined
            }
            width={"150px"}
          />
        </div>

        <Box display={"flex"}>
          {selectedType && (
            <>
              <span style={{ paddingRight: "8px" }}>
                <TableCustomizationButton
                  columns={columns}
                  setColumns={setColumns}
                  isDefault={false}
                  hasColumnFreeze={true}
                  tableKey={`${FI_MANAGEMENT_TABLE_KEY}${selectedType.id}`}
                />
              </span>
            </>
          )}

          {hasPermission(PERMISSIONS.FI_AMEND) && (
            <PrimaryBtn
              onClick={() => {
                setIsAddNewFiManagementOpen(true);
              }}
              fontSize={12}
              endIcon={<AddIcon />}
              data-testid={"create-button"}
            >
              {t("addNew")}
            </PrimaryBtn>
          )}
        </Box>
      </StyledGrid>
      <ClosableModal
        onClose={() => setIsAddNewFiManagementOpen(false)}
        open={isAddNewFiManagementOpen}
        includeHeader={false}
        disableBackdropClick={true}
      >
        <FiManagementCreateContainer
          fiId={fiId}
          setOpen={setIsAddNewFiManagementOpen}
          selectedType={selectedType ?? ({} as FiManagementType)}
          submitCallback={(respData, isSameType) => {
            if (isSameType || selectedType?.id === -1) {
              setManagement([{ ...respData }, ...management]);
            }
          }}
        />
      </ClosableModal>
    </StyledRoot>
  );
};

export default FIManagementPageHeader;
