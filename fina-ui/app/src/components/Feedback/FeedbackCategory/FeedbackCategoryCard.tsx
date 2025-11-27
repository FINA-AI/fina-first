import { Box } from "@mui/system";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import Grid from "@mui/material/Grid";
import { IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import DeleteForm from "../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { FeedbackCategoryType } from "../../../types/feedback.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  padding: "12px 4px",
  border: theme.palette.borderColor,
  display: "flex",
  justifyContent: "space-between",
}));

const StyledFeedbackIcon = styled(FeedbackRoundedIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  color: theme.palette.mode === "dark" ? "#818fa4" : "#98A7BC",
}));

const StyledIconBox = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F0F4FF",
  width: 40,
  height: 40,
  borderRadius: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 8,
}));

const StyledTypography = styled(Typography)(({ theme }: any) => ({
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "20px",
  color: theme.palette.textColor,
  marginLeft: 8,
}));

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

interface FeedbackCategoryCardProps {
  card: FeedbackCategoryType;
  index: number;
  onDeleteCategory: (id: number | null) => void;
  setIsEditOpen: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; card: FeedbackCategoryType }>
  >;
}

const FeedbackCategoryCard: React.FC<FeedbackCategoryCardProps> = ({
  card,
  onDeleteCategory,
  setIsEditOpen,
  index,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [isDeleteFormOpen, setDeleteFormOpen] = useState<{
    open: boolean;
    cardId: number | null;
  }>({
    open: false,
    cardId: null,
  });

  return (
    <Grid item xs={3} p={"4px"} data-testid={"card-" + index}>
      <StyledRoot>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <StyledIconBox>
            <StyledFeedbackIcon />
          </StyledIconBox>
          <StyledTypography data-testid={"name"}>{card.name}</StyledTypography>
        </Box>
        <Box>
          {hasPermission(PERMISSIONS.FEEDBACK_CATEGORY_AMEND) && (
            <>
              <IconButton sx={{ padding: "2px" }}>
                <StyledEditIcon
                  onClick={() => {
                    setIsEditOpen({ isOpen: true, card });
                  }}
                  data-testid={"edit-button"}
                />
              </IconButton>
              <IconButton sx={{ padding: "2px" }}>
                <StyledDeleteIcon
                  onClick={() => {
                    setDeleteFormOpen({ open: true, cardId: card.id });
                  }}
                  data-testid={"delete-button"}
                />
              </IconButton>
            </>
          )}
        </Box>
      </StyledRoot>
      {isDeleteFormOpen.open && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("category")}
          isDeleteModalOpen={isDeleteFormOpen.open}
          setIsDeleteModalOpen={() =>
            setDeleteFormOpen({ open: false, cardId: null })
          }
          onDelete={() => {
            onDeleteCategory(isDeleteFormOpen.cardId);
            setDeleteFormOpen({ open: false, cardId: null });
          }}
          showConfirm={false}
        />
      )}
    </Grid>
  );
};

export default FeedbackCategoryCard;
