import { Box, Grid, Typography } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface PeriodTypeToolbarProps {
  setAddNewModalOpen: (val: boolean) => void;
}

const StyledGridHeader = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "12px 16px",
  borderBottom: "1px solid #EAEBF0",
  border: "1px solid red",
});

const StyledText = styled(Typography)({
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  marginRight: "8px",
});

const PeriodTypeToolbar: React.FC<PeriodTypeToolbarProps> = ({
  setAddNewModalOpen,
}) => {
  const { t } = useTranslation();
  return (
    <StyledGridHeader container>
      <PrimaryBtn
        onClick={() => {
          setAddNewModalOpen(true);
        }}
      >
        <Box display={"flex"} alignItems={"center"} alignContent={"center"}>
          <StyledText>{t("addNew")}</StyledText>
          <AddRoundedIcon />
        </Box>
      </PrimaryBtn>
    </StyledGridHeader>
  );
};

export default PeriodTypeToolbar;
