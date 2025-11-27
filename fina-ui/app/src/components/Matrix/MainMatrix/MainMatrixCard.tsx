import { Box, Grid, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { MainMatrixDataType } from "../../../types/matrix.type";
import Tooltip from "../../common/Tooltip/Tooltip";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useTranslation } from "react-i18next";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import RegexModal from "./RegexModal";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Grid)(({ theme }: any) => ({
  boxSizing: "border-box",
  flexGrow: 1,
  minWidth: 164,
  width: "auto",
  border: theme.palette.borderColor,
  borderRadius: 4,
  padding: 12,
  boxShadow: "none",
  cursor: "pointer",
  margin: 4,
  "&:hover": {
    boxShadow: theme.palette.paperBoxShadow,
    "& .deleteIcon": {
      color: "#FF4128",
    },
  },
}));

export const StyledTypeName = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  height: 18,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 2,
  padding: "3px 6px 2px 6px",
}));

export const StyledTitle = styled(Typography)(({ theme }: any) => ({
  height: 20,
  color: theme.palette.textColor,
  marginTop: 12,
  marginBottom: 4,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "20px",
}));

export const StyledEditIconContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 22,
  height: 22,
  background: "none",
  "&:hover": {
    borderRadius: 37,
  },
}));

export const StyledEditIcon = styled(EditIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  cursor: "pointer",
}));

export const StyledDeleteIconContainer = styled(Box)(() => ({
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
}));

export const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  color: "#9AA7BE",
  cursor: "pointer",
}));

export const StyledSecondTitle = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.secondaryText,
  marginTop: 4,
  marginBottom: 2,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  padding: "2px",
}));

export const StyledActiveIcon = styled(FiberManualRecordIcon)(() => ({
  width: 15,
  height: 10,
  color: "#289E20",
}));

export const StyledInactiveIcon = styled(FiberManualRecordIcon)(() => ({
  width: 15,
  height: 10,
  color: "#FF4128",
}));

export const StyledTaskIcon = styled(TaskRoundedIcon)(({ theme }: any) => ({
  color: theme.palette.primary.main,
}));

interface MainMatrixCardProps {
  details: MainMatrixDataType;
  setIsDeleteModalOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      id?: number;
    }>
  >;
  setIsAddModalOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      data?: MainMatrixDataType;
    }>
  >;
}

const MainMatrixCard: React.FC<MainMatrixCardProps> = ({
  details,
  setIsDeleteModalOpen,
  setIsAddModalOpen,
}) => {
  const { t } = useTranslation();
  const [openRegexModal, setRegexModal] = useState<boolean>(false);
  const history = useHistory();

  return (
    <>
      <Grid item xl={3} md={4} sm={6} xs={12}>
        <StyledCard item onClick={() => history.push(`/matrix/${details.id}`)}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box display={"flex"}>
              <StyledTypeName>{details.fiTypeModel?.code}</StyledTypeName>
              <Box display={"flex"} alignItems={"center"} marginLeft={"8px"}>
                {details.enable ? <StyledActiveIcon /> : <StyledInactiveIcon />}
              </Box>
            </Box>

            <Box display={"flex"} alignItems={"center"}>
              <StyledEditIconContainer>
                <IconButton
                  style={{
                    background: "none",
                    border: "none",
                  }}
                >
                  <StyledEditIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddModalOpen({ open: true, data: details });
                    }}
                  />
                </IconButton>
              </StyledEditIconContainer>
              <StyledDeleteIconContainer>
                <StyledDeleteIcon
                  className="deleteIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen({ open: true, id: details.id });
                  }}
                />
              </StyledDeleteIconContainer>
            </Box>
          </Box>
          <Box display={"flex"}>
            <Tooltip title={details.pattern}>
              <StyledTitle maxWidth={"90%"}>
                {`${t("pattern")}: ${details.pattern}`}
              </StyledTitle>
            </Tooltip>
            <Box display={"flex"} alignItems={"center"} marginLeft={"8px"}>
              <Tooltip title={t("testpattern")}>
                <StyledTaskIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    setRegexModal(true);
                  }}
                />
              </Tooltip>
            </Box>
          </Box>

          <StyledSecondTitle>
            {`${t("periodType")}: ${details.periodType.name}`}
          </StyledSecondTitle>
          <StyledSecondTitle>
            {`${t("processengine")}: ${details.processEngine}`}
          </StyledSecondTitle>
          <StyledSecondTitle>
            {`${t("version")}: ${details?.returnVersion?.name}`}
          </StyledSecondTitle>
        </StyledCard>
      </Grid>
      {openRegexModal && (
        <RegexModal
          open={openRegexModal}
          onClose={() => setRegexModal(false)}
          pattern={details.pattern}
        />
      )}
    </>
  );
};
export default MainMatrixCard;
