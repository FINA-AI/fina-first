import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import ResponsiveCard from "../ResponsiveCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import FiConfigurationCreateWizard from "../FiConfigurationCreateWizard";
import DeleteForm from "../../../common/Delete/DeleteForm";
import CardGridSkeleton from "../../Skeleton/Configuration/CardGridSkeleton";
import { FiConfigurationTabs } from "../../fiTabs";
import NoRecordIndicator from "../../../common/NoRecordIndicator/NoRecordIndicator";
import { styled } from "@mui/material/styles";
import { BranchTypes } from "../../../../types/fi.type";

const commonIconStyles = (theme: any) => ({
  ...theme.smallIcon,
  color: "#9AA7BE",
  cursor: "pointer",
});

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

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

const StyledCardRoot = styled(Grid)(({ theme }) => ({
  padding: "12px",
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "light" ? "#9AA7BE" : "#5D789A",
    height: "20px",
  },
  "&:hover": {
    "& #editIcon": {
      color: "#2962FF",
    },
    "& #deleteIcon": {
      color: "#FF4128",
    },
  },
}));

const StyledCardContent = styled(Grid)({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  justifyContent: "space-between",
});

const StyledShortName = styled(Box)(({ theme }) => ({
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

const StyledFullName = styled(Box)(({ theme }: any) => ({
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

const StyledDefText = styled(Box)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  marginTop: 4,
  marginBottom: 2,
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
}));

const StyledOtherText = styled(Box)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
  margin: "2px 0",
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

interface Props {
  managementTypes: BranchTypes[];
  onDelete: (id: number) => void;
  afterEditSubmitSuccess: (data: BranchTypes, type: "add" | "edit") => void;
  loading: boolean;
  searchValue: string;
}

const FIManagementConfigurationPageBody: React.FC<Props> = ({
  managementTypes,
  onDelete,
  afterEditSubmitSuccess,
  loading,
  searchValue,
}) => {
  const { t } = useTranslation();
  const [isFiConfigurationWizardOpen, setIsFiConfigurationWizardOpen] =
    useState<boolean>(false);
  const [editItem, setEditItem] = useState<BranchTypes | undefined>();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<number | null>(null);

  const getColumnNumber = (steps: any) => {
    let number = 0;
    if (steps) {
      for (let o of steps) {
        number += o.columns.length;
      }
    }

    return number;
  };

  const onEditClick = (item: BranchTypes) => {
    setEditItem(item);
    setIsFiConfigurationWizardOpen(true);
  };

  const createCardContent = (item: BranchTypes) => {
    return (
      <StyledCardRoot data-testid={`mgmt-card-${item.code}`}>
        <StyledCardContent item xs={12}>
          <StyledShortName>{item.code}</StyledShortName>
          <div
            style={{
              marginLeft: "10px",
              order: "1",
              display: "flex",
            }}
          >
            <StyledEditBox>
              <StyledEditIcon
                id={"editIcon"}
                onClick={() => onEditClick(item)}
              />
            </StyledEditBox>
            <StyledDeleteBox>
              <StyledDeleteIcon
                id={"deleteIcon"}
                onClick={() => {
                  if (item.id) setSelectedID(item.id);
                  setIsDeleteConfirmOpen(true);
                }}
              />
            </StyledDeleteBox>
          </div>
        </StyledCardContent>
        <StyledCardContent item xs={12}>
          <StyledFullName>{item.name}</StyledFullName>
        </StyledCardContent>
        <StyledDefText>{t("otherDetails")}</StyledDefText>
        <StyledCardContent item xs={12}>
          <StyledOtherText>
            {`${item.steps?.length}  ${t("registrationSteps")}`}
          </StyledOtherText>
        </StyledCardContent>
        <Grid item xs={12}>
          <StyledOtherText>
            {`${getColumnNumber(item.steps)} ${t("numberOfTextInputs")}`}
          </StyledOtherText>
        </Grid>
      </StyledCardRoot>
    );
  };

  return (
    <StyledRoot data-testid={"configuration-management-body"}>
      {loading ? (
        <CardGridSkeleton cardNumber={managementTypes.length} />
      ) : (
        <Grid container alignContent={"flex-start"} height={"100%"}>
          {!loading && managementTypes.length === 0 ? (
            <NoRecordIndicator />
          ) : (
            managementTypes
              .filter(
                (item) =>
                  item.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                  item.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((el, index) => (
                <ResponsiveCard key={index}>
                  {createCardContent(el)}
                </ResponsiveCard>
              ))
          )}
        </Grid>
      )}
      {isFiConfigurationWizardOpen && editItem && (
        <FiConfigurationCreateWizard
          isOpen={isFiConfigurationWizardOpen}
          setIsOpen={setIsFiConfigurationWizardOpen}
          type={FiConfigurationTabs.MANAGEMENT}
          afterSubmitSuccess={afterEditSubmitSuccess}
          editItem={{ ...editItem }}
        />
      )}
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("management")}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          if (selectedID !== null) {
            onDelete(selectedID);
            setIsDeleteConfirmOpen(false);
          }
        }}
        showConfirm={false}
      />
    </StyledRoot>
  );
};

export default FIManagementConfigurationPageBody;
