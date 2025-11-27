import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

import Dropdown from "../../../../../common/Button/Dropdown";
import PrimaryBtn from "../../../../../common/Button/PrimaryBtn";
import TableCustomizationButton from "../../../../../common/Button/TableCustomizationButton";
import { FI_BENEFICIARY_TABLE_KEY } from "../../../../../../api/TableCustomizationKeys";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";

import { BeneficiaryType } from "../../../../../../types/fi.type";
import { GridColumnType } from "../../../../../../types/common.type";

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}));

type BeneficiaryHeaderProps = {
  beneficiaryTypes: BeneficiaryType[];
  setSelectedType: (type: BeneficiaryType) => void;
  selectedType: BeneficiaryType | null;
  addNewItem: () => void;
  columns: GridColumnType[];
  setColumns: (cols: GridColumnType[]) => void;
};

const BeneficiaryHeader: React.FC<BeneficiaryHeaderProps> = ({
  beneficiaryTypes,
  setSelectedType,
  selectedType,
  addNewItem,
  columns,
  setColumns,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();

  return (
    <StyledHeader data-testid={"header"}>
      <Dropdown
        dropdownData={beneficiaryTypes.map(({ key, name, additional }) => ({
          key: key,
          name,
          additional,
        }))}
        setSelection={(val) => {
          const selected: BeneficiaryType = {
            key: String(val.key),
            name: val.name,
            additional: val.additional ?? "",
          };
          setSelectedType(selected);
        }}
        selectedType={
          selectedType
            ? {
                key: selectedType.key,
                name: selectedType.name,
                additional: selectedType.additional,
              }
            : undefined
        }
      />

      <Box display={"flex"} justifyContent={"center"}>
        <span>
          <TableCustomizationButton
            columns={columns}
            setColumns={setColumns}
            hasColumnFreeze={true}
            tableKey={FI_BENEFICIARY_TABLE_KEY}
          />
        </span>
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <div style={{ marginLeft: "8px" }}>
            <PrimaryBtn
              onClick={addNewItem}
              endIcon={<AddIcon />}
              data-testid={"create-button"}
            >
              {t("addNew")}
            </PrimaryBtn>
          </div>
        )}
      </Box>
    </StyledHeader>
  );
};

export default BeneficiaryHeader;
