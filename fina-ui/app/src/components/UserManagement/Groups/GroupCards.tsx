import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import GroupIcon from "@mui/icons-material/Group";
import { useHistory } from "react-router-dom";
import { GroupRouteName, groupsBaseRoute } from "./Common/GroupRoutes";
import Tooltip from "../../common/Tooltip/Tooltip";
import { styled } from "@mui/system";
import { Group } from "../../../types/group.type";

const StyledContainerBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  borderRadius: 4,
  height: 64,
  width: "auto",
  padding: 12,
  overflow: "hidden",
  cursor: "pointer",
  background: theme.palette.paperBackground,
  border: `1px solid ${theme.palette.mode === "dark" ? "#4d5c72" : "#EAEBF0"}`,
  "&:hover": {
    background: theme.palette.mode === "dark" ? "#a1bdd914" : "#F5F5F5",
  },
}));

const StyledGroupItem = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 100,
  backgroundColor: theme.palette.mode === "dark" ? "#2c3e50" : "#F0F4FF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
  minWidth: 40,
}));

const StyledGroupIcon = styled(GroupIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledTitle = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: 13,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "20px",
  marginBottom: "4px",
}));

const StyledDescription = styled(Typography)(() => ({
  color: "#9AA7BE",
  fontSize: 11,
  fontWeight: 400,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "16px",
}));

const StyledDUserCount = styled(Typography)(() => ({
  color: "#9AA7BE",
  fontSize: 11,
  fontWeight: 400,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "16px",
  maxWidth: "100%",
}));

const GroupCards = ({ group, index }: { group: Group; index: number }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onItemClick = () => {
    history.push(
      `${groupsBaseRoute}/${group.id}/${GroupRouteName.PERMISSIONS}`
    );
  };

  return (
    <Grid
      item
      xl={3}
      md={3}
      sm={6}
      xs={12}
      padding={"4px"}
      data-testid={"card-" + index}
    >
      <StyledContainerBox
        onClick={onItemClick}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} width={"100%"} minWidth={"0px"}>
          <StyledGroupItem>
            <StyledGroupIcon />
          </StyledGroupItem>
          <Box width={"100%"} minWidth={"0px"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Box flex={1} overflow={"hidden"}>
                <StyledTitle data-testid={"code"}>{group.code}</StyledTitle>
              </Box>
              <Box
                display={"flex"}
                flex={2}
                justifyContent={"flex-end"}
                overflow={"hidden"}
                alignItems={"center"}
                marginLeft={"5px"}
              >
                <StyledDUserCount data-testid={"user-count"}>
                  {`${group.userCount} ${t("user")}`}
                </StyledDUserCount>
              </Box>
            </Box>
            <Tooltip title={`${group.description}`}>
              <StyledDescription data-testid={"description"}>
                {group.description}
              </StyledDescription>
            </Tooltip>
          </Box>
        </Box>
      </StyledContainerBox>
    </Grid>
  );
};

export default GroupCards;
