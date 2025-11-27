import React, { useState } from "react";
import FIBranchConfigurationPageBody from "./FIBranchConfigurationPageBody";
import SearchField from "../../../common/Field/SearchField";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import FiConfigurationCreateWizard from "../FiConfigurationCreateWizard";
import { FiConfigurationTabs } from "../../fiTabs";
import { styled } from "@mui/material/styles";
import { BranchTypes } from "../../../../types/fi.type";

interface FIBranchConfigurationPageProps {
  branchTypes: BranchTypes[];
  afterSubmitSuccess?: (data: BranchTypes, type: "add" | "edit") => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  background: theme.palette.paperBackground,
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
}));

const StyledSearchFieldBox = styled(Box)(({ theme }) => ({
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

const FIBranchConfigurationPage: React.FC<FIBranchConfigurationPageProps> = ({
  branchTypes,
  afterSubmitSuccess,
  onDelete,
  loading = false,
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
            withFilterButton={false}
            onFilterClick={(value: string) => setSearchValue(value)}
            onFilterChange={(value: string) => setSearchValue(value)}
            onClear={() => setSearchValue("")}
          />
        </StyledSearchFieldBox>
        <div
          style={{
            marginLeft: "auto",
            order: 2,
            paddingRight: "23px",
          }}
        >
          <PrimaryBtn
            data-testid={`fiConfig-branch-addNewButton`}
            onClick={() => setIsFiConfigurationWizardOpen(true)}
            endIcon={<AddIcon />}
          >
            {t("addNew")}
          </PrimaryBtn>
        </div>
        {isFiConfigurationWizardOpen && (
          <FiConfigurationCreateWizard
            isOpen={isFiConfigurationWizardOpen}
            setIsOpen={setIsFiConfigurationWizardOpen}
            type={FiConfigurationTabs.BRANCH}
            afterSubmitSuccess={afterSubmitSuccess}
          />
        )}
      </StyledToolbar>
      <Box
        flex={1}
        sx={{
          overflow: loading ? "hidden" : "auto",
        }}
      >
        <FIBranchConfigurationPageBody
          branchTypes={branchTypes}
          onDelete={onDelete}
          afterEditSubmitSuccess={afterSubmitSuccess}
          loading={loading}
          searchValue={searchValue}
        />
      </Box>
    </Box>
  );
};

export default FIBranchConfigurationPage;
