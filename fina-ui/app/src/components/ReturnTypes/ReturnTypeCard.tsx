import { Box, Grid, IconButton, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import React, { useState } from "react";
import DeleteForm from "../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import useConfig from "../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";
import { PeriodType } from "../../types/period.type";
import { ReturnType } from "../../types/returnDefinition.type";
import { ReturnVersion } from "../../types/importManager.type";

interface ReturnTypeCardProps {
  item: ReturnType | PeriodType | ReturnVersion;
  setEditItem: (data: any) => void;
  setAddNewModalOpen: (isOpen: boolean) => void;
  deleteItemHandler: (id: number) => void;
  deleteFormAdditionalText: string;
  amendPermission: string;
  deletePermission: string;
}

const getIconStyles = (theme: any) => ({
  ...theme.smallIcon,
  padding: 2,
});

const StyledRoot = styled(Grid)({
  padding: "4px",
  cursor: "pointer",
  "& .MuiTypography-root": {
    textOverflow: "ellipsis!important",
    overflow: "hidden!important",
    whiteSpace: "noWrap",
  },
  "& .MuiButtonBase-root": {
    padding: 2,
  },
});

const StyledPaper = styled(Paper)(({ theme }: { theme: any }) => ({
  border: theme.palette.borderColor,
  background: theme.palette.mode === "light" ? "inherit" : "#344258",
  boxShadow: "none",
  borderRadius: "4px",
  fontFamily: "Inter",
  fontStyle: "normal",
  padding: "8px 12px",
  "&:hover": {
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
  },
}));

const StyledCodeText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontSize: 13,
  color: theme.palette.textColor,
  fontWeight: 500,
  lineHeight: "20px",
}));

const StyledCardWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const StyledCodeWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledEditIcon = styled(EditRoundedIcon)(({ theme }) => ({
  ...getIconStyles(theme),
}));

const StyledDeleteIcon = styled(DeleteRoundedIcon)(({ theme }) => ({
  ...getIconStyles(theme),
}));

const StyledName = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
}));

const StyledIconButton = styled(IconButton)({
  border: "none",
  "&:hover": {
    "& #editIcon": {
      color: "#2962FF",
    },
    "& #deleteIcon": {
      color: "#FF4128",
    },
  },
});

const ReturnTypeCard: React.FC<ReturnTypeCardProps> = ({
  item,
  setEditItem,
  setAddNewModalOpen,
  deleteItemHandler,
  deleteFormAdditionalText,
  amendPermission,
  deletePermission,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <StyledRoot item xs={3} data-testId={`return-type-${item.code}`}>
        <StyledPaper>
          <StyledCardWrapper>
            <StyledCodeWrapper>
              <StyledCodeText data-testid={"code"}>{item.code}</StyledCodeText>
              <Box>
                {hasPermission(amendPermission) && (
                  <StyledIconButton
                    onClick={() => {
                      setAddNewModalOpen(true);
                      setEditItem(item);
                    }}
                    data-testid={"edit-icon-button"}
                  >
                    <StyledEditIcon id={"editIcon"} />
                  </StyledIconButton>
                )}

                {hasPermission(deletePermission) && (
                  <StyledIconButton
                    onClick={() => setIsModalOpen(true)}
                    data-testid={"delete-icon-button"}
                  >
                    <StyledDeleteIcon id={"deleteIcon"} />
                  </StyledIconButton>
                )}
              </Box>
            </StyledCodeWrapper>
            <StyledName data-testid={"description"}>{item.name}</StyledName>
          </StyledCardWrapper>
        </StyledPaper>
      </StyledRoot>
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t(deleteFormAdditionalText)}
        isDeleteModalOpen={isModalOpen}
        setIsDeleteModalOpen={setIsModalOpen}
        onDelete={() => {
          deleteItemHandler(item.id);
          setIsModalOpen(false);
        }}
        showConfirm={false}
      />
    </>
  );
};

export default ReturnTypeCard;
