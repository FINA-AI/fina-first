import React, { useState } from "react";
import SearchField from "../../../common/Field/SearchField";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import FiConfigurationCreateWizard from "../FiConfigurationCreateWizard";
import FIManagementConfigurationPageBody from "./FIManagementConfigurationPageBody";
import { FiConfigurationTabs } from "../../fiTabs";
import { styled } from "@mui/material/styles";
import { BranchTypes } from "../../../../types/fi.type";

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
}));

const StyledSearchFieldBox = styled(Box)(({ theme }: any) => ({
  [theme.breakpoints.down("xl")]: {
    width: "300px",
    "& .MuiInputBase-root": {
      width: "300px",
    },
  },
  [theme.breakpoints.down("md")]: {
    width: "200px",
    "& .MuiInputBase-root": {
      width: "200px",
    },
  },
}));

interface Props {
  managementTypes: BranchTypes[];
  afterSubmitSuccess: (data: BranchTypes, type: "add" | "edit") => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const FIManagementConfigurationPage: React.FC<Props> = ({
  managementTypes,
  afterSubmitSuccess,
  onDelete,
  loading,
}) => {
  const { t } = useTranslation();
  const [isFiConfigurationWizardOpen, setIsFiConfigurationWizardOpen] =
    useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"}>
      <StyledToolbar>
        <StyledSearchFieldBox>
          <SearchField
            onClear={() => {
              setSearchValue("");
            }}
            withFilterButton={false}
            onFilterChange={(value) => setSearchValue(value)}
          />
        </StyledSearchFieldBox>
        <div style={{ order: 2 }}>
          <PrimaryBtn
            onClick={() => setIsFiConfigurationWizardOpen(true)}
            data-testid={"addNewBtn"}
            endIcon={<AddIcon />}
          >
            {t("addNew")}
          </PrimaryBtn>
        </div>
        {isFiConfigurationWizardOpen && (
          <FiConfigurationCreateWizard
            isOpen={isFiConfigurationWizardOpen}
            setIsOpen={setIsFiConfigurationWizardOpen}
            type={FiConfigurationTabs.MANAGEMENT}
            afterSubmitSuccess={afterSubmitSuccess}
          />
        )}
      </StyledToolbar>
      <Box flex={1} overflow={loading ? "hidden" : "auto"}>
        <FIManagementConfigurationPageBody
          managementTypes={managementTypes ?? []}
          onDelete={onDelete}
          afterEditSubmitSuccess={afterSubmitSuccess}
          loading={loading}
          searchValue={searchValue}
        />
      </Box>
    </Box>
  );
};

export default FIManagementConfigurationPage;
