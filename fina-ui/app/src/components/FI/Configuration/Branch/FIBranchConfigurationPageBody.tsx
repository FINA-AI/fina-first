import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ResponsiveCard from "../ResponsiveCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import FiConfigurationCreateWizard from "../FiConfigurationCreateWizard";
import { FiConfigurationTabs } from "../../fiTabs";
import DeleteForm from "../../../common/Delete/DeleteForm";
import CardGridSkeleton from "../../Skeleton/Configuration/CardGridSkeleton";
import NoRecordIndicator from "../../../common/NoRecordIndicator/NoRecordIndicator";
import { styled } from "@mui/material/styles";
import { BranchStepType, BranchTypes } from "../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  boxSizing: "border-box",
  borderTop: theme.palette.borderColor,
  background: theme.palette.paperBackground,
  padding: "8px 12px",
  borderBottomRightRadius: "8px",
  borderBottomLeftRadius: "8px",
  "& .MuiPaper-rounded": {
    backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "#344258",
    boxShadow: "none",
    "&:hover": {
      boxShadow: "0px 2px 10px 0px #00000014",
    },
  },
}));

const StyledFullName = styled(Typography)(({ theme }: any) => ({
  textTransform: "uppercase",
  height: 20,
  color: theme.palette.textColor,
  marginTop: 12,
  marginBottom: 4,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "20px",
}));

const StyledDefText = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  marginTop: 4,
  marginBottom: 2,
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
}));

const StyledEditBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 22,
  height: 22,
  "&:hover": {
    backgroundColor: "rgba(41, 98, 255, 0.1)",
    borderRadius: 37,
  },
});

const StyledDeleteBox = styled(StyledEditBox)({
  marginLeft: 4,
  "&:hover": {
    backgroundColor: "rgba(255, 65, 40, 0.1)",
  },
});

const StyledOtherText = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
  marginBottom: 4,
  margin: "2px 0",
}));

const StyledShortName = styled(Typography)(({ theme }) => ({
  textTransform: "uppercase",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  height: 18,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 2,
  padding: "3px 6px 2px 6px",
}));

const StyledCardContent = styled(Grid)({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  justifyContent: "space-between",
});

const StyledCardRoot = styled(Grid)({
  padding: 12,
  "&:hover": {
    "& #editIcon": {
      color: "#2962FF",
    },
    "& #deleteIcon": {
      color: "#FF4128",
    },
  },
});

const commonIconStyles = (theme: any) => ({
  ...theme.smallIcon,
  color: theme.palette.mode === "light" ? "#9AA7BE" : "#5D789A",
  cursor: "pointer",
});

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

interface FIBranchConfigurationPageBodyProps {
  branchTypes: BranchTypes[];
  onDelete: (id: number) => void;
  afterEditSubmitSuccess?: (data: BranchTypes, type: "add" | "edit") => void;
  loading?: boolean;
  searchValue?: string;
}

const FIBranchConfigurationPageBody: React.FC<
  FIBranchConfigurationPageBodyProps
> = ({
  branchTypes,
  onDelete,
  afterEditSubmitSuccess,
  loading = false,
  searchValue = "",
}) => {
  const { t } = useTranslation();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [isFiConfigurationWizardOpen, setIsFiConfigurationWizardOpen] =
    useState(false);
  const [editItem, setEditItem] = useState<BranchTypes | null>(null);

  const getColumnNumber = (steps: BranchStepType[]) => {
    let number = 0;
    for (const o of steps) {
      number += o.columns.length;
    }
    return number;
  };

  const onEditClick = (item: BranchTypes) => {
    setEditItem(item);
    setIsFiConfigurationWizardOpen(true);
  };

  const createCardContent = (item: BranchTypes) => {
    return (
      <StyledCardRoot data-testid={`fiConfig-branch-card-${item.code}`}>
        <StyledCardContent item xs={12}>
          <StyledShortName>{item.code}</StyledShortName>
          <div style={{ marginLeft: 10, order: 1, display: "flex" }}>
            <StyledEditBox>
              <StyledEditIcon
                data-testid={"fiConfig-branch-card-editBtn"}
                id={"editIcon"}
                onClick={(e) => {
                  onEditClick(item);
                  e.stopPropagation();
                }}
              />
            </StyledEditBox>
            <StyledDeleteBox>
              <StyledDeleteIcon
                data-testid={"fiConfig-branch-card-deleteBtn"}
                id={"deleteIcon"}
                onClick={() => {
                  setSelectedID(item.id ?? null);
                  setIsDeleteConfirmOpen(true);
                }}
              />
            </StyledDeleteBox>
          </div>
        </StyledCardContent>
        <StyledFullName>{item.name}</StyledFullName>
        <StyledDefText>{t("otherDetails")}</StyledDefText>
        <StyledOtherText>
          {`${item.steps.length}  ${t("registrationSteps")}`}
        </StyledOtherText>
        <StyledOtherText>
          {`${getColumnNumber(item.steps)} ${t("numberOfTextInputs")}`}
        </StyledOtherText>
      </StyledCardRoot>
    );
  };

  return (
    <StyledRoot>
      {loading ? (
        <CardGridSkeleton cardNumber={branchTypes.length} />
      ) : (
        <Grid
          container
          item
          xs={12}
          height={"100%"}
          alignContent={"flex-start"}
        >
          {!loading && branchTypes.length === 0 && <NoRecordIndicator />}
          {branchTypes
            .filter(
              (item) =>
                item.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((el, index) => (
              <ResponsiveCard key={index}>
                {createCardContent(el)}
              </ResponsiveCard>
            ))}
        </Grid>
      )}
      {isFiConfigurationWizardOpen && editItem && (
        <FiConfigurationCreateWizard
          isOpen={isFiConfigurationWizardOpen}
          setIsOpen={() => {
            setIsFiConfigurationWizardOpen(false);
            setEditItem(null);
          }}
          type={FiConfigurationTabs.BRANCH}
          afterSubmitSuccess={afterEditSubmitSuccess}
          editItem={{ ...editItem }}
        />
      )}
      {isDeleteConfirmOpen && selectedID !== null && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("branchtype")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            onDelete(selectedID);
            setIsDeleteConfirmOpen(false);
          }}
          showConfirm={false}
        />
      )}
    </StyledRoot>
  );
};

export default FIBranchConfigurationPageBody;
