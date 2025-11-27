import { Box, Grid, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { FiTypeDataType } from "../../../../types/fi.type";

const StyledCard = styled(Grid)(({ theme }: any) => ({
  boxSizing: "border-box",
  flexGrow: 1,
  minWidth: 164,
  width: "auto",
  border: theme.palette.borderColor,
  borderRadius: 4,
  padding: 12,
  boxShadow: "none",
  "&:hover": {
    boxShadow: "0px 2px 10px 0px #00000014",
    "& #editIcon": {
      color: "#2962FF",
    },
    "& #deleteIcon": {
      color: "#FF4128",
    },
  },
  backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "#344258",
  cursor: "pointer",
  margin: 4,
}));

const StyledName = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  height: 18,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 2,
  padding: "3px 6px 2px 6px",
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
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

const StyledEditIconContainer = styled(Box)({
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

const StyledEditIcon = styled(EditIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  color: theme.palette.mode === "light" ? "#9AA7BE" : "#5D789A",
  cursor: "pointer",
}));

const StyledDeleteIconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 22,
  height: 22,
  marginLeft: 4,
  "&:hover": {
    backgroundColor: "rgba(255, 65, 40, 0.1)",
    borderRadius: 37,
  },
});

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  color: theme.palette.mode === "light" ? "#9AA7BE" : "#5D789A",
  cursor: "pointer",
}));

const StyledSecondTitle = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  marginTop: 4,
  marginBottom: 2,
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
}));

const StyledButtonText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#4F5863",
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
  margin: "2px 0",
}));

interface FiTypeConfigCardProps {
  fiType: FiTypeDataType;
  onDeleteButton: (fiType: FiTypeDataType) => void;
  onEditButton: (fiType: FiTypeDataType) => void;
}

const FiTypeConfigCard: React.FC<FiTypeConfigCardProps> = ({
  onDeleteButton,
  fiType,
  onEditButton,
}) => {
  const { t } = useTranslation();
  return (
    <Grid
      item
      xl={3}
      md={4}
      sm={6}
      xs={12}
      data-testid={`fiConfig-fiType-card-${fiType.code}`}
    >
      <StyledCard item>
        <Box display={"flex"} justifyContent={"space-between"}>
          <StyledName> {fiType.code} </StyledName>
          <Box display={"flex"} alignItems={"center"}>
            <StyledEditIconContainer>
              <StyledEditIcon
                data-testid={"fiConfig-fiType-card-editBtn"}
                id={"editIcon"}
                onClick={() => {
                  onEditButton(fiType);
                }}
              />
            </StyledEditIconContainer>
            <StyledDeleteIconContainer>
              <StyledDeleteIcon
                data-testid={"fiConfig-fiType-card-deleteBtn"}
                id={"deleteIcon"}
                onClick={() => {
                  onDeleteButton(fiType);
                }}
              />
            </StyledDeleteIconContainer>
          </Box>
        </Box>
        <StyledTitle> {fiType.name} </StyledTitle>
        <StyledSecondTitle>
          {t("existingFinancialInstitutions")}
        </StyledSecondTitle>
        <Box display={"flex"} alignItems={"center"}>
          <FiberManualRecordIcon
            sx={{ width: 15, height: 10, color: "#289E20" }}
          />
          <StyledButtonText>
            {`${fiType.activeFisCount} ${t("active")}`}
          </StyledButtonText>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <FiberManualRecordIcon
            sx={{ width: 15, height: 10, color: "#FF4128" }}
          />
          <StyledButtonText>
            {`${fiType.inactiveFisCount} ${t("inactive")}`}
          </StyledButtonText>
        </Box>
      </StyledCard>
    </Grid>
  );
};

export default FiTypeConfigCard;
