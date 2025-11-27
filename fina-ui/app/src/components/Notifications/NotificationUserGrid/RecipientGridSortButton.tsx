import React, { FC, useEffect } from "react";
import SouthIcon from "@mui/icons-material/South";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { RecipientFilterType } from "../../../types/messages.type";
import { styled } from "@mui/material/styles";

interface RecipientGridSortButtonProps {
  initData: (filters: RecipientFilterType) => void;
  filters: RecipientFilterType;
  dataLength: number;
}

const StyledRoot = styled(Box)({
  height: 33,
  borderRadius: 8,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
});

const StyledGridButton = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  userSelect: "none",
  borderRadius: 4,
  padding: "0 8px",
  height: 28,
  color: "#FFFFFF",
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    "& .visible": {
      display: "flex",
      color: "#FFFFFF",
    },
  },
  cursor: "pointer",
  "&.disabled": {
    opacity: 0.5,
    cursor: "default",
    "&:hover": {
      "& .visible": {
        display: "none !important",
      },
    },
  },
}));

const StyledSortText = styled(Typography)(({ theme }: any) => ({
  fontSize: 16,
  color: theme.palette.textColor,
}));

const StyledSouthIcon = styled(SouthIcon)<any>(({ theme, isActive }) => ({
  color: isActive
    ? theme.palette.mode === "light"
      ? "#c8c8c8 !important"
      : "#5D789A !important"
    : "",
}));

const RecipientGridSortButton: FC<RecipientGridSortButtonProps> = ({
  initData,
  filters,
  dataLength,
}) => {
  const { t } = useTranslation();
  const [userSortDirection, setUserSortDirection] = React.useState("");
  const [statusSortDirection, setStatusSortDirection] = React.useState("");

  useEffect(() => {
    if (dataLength <= 0) {
      if (userSortDirection) {
        setUserSortDirection("");
      }
      if (statusSortDirection) {
        setStatusSortDirection("");
      }
    }
  }, [dataLength]);
  return (
    <StyledRoot>
      <StyledSortText>{t("sortBy")}:</StyledSortText>
      <StyledGridButton
        className={dataLength === 0 ? "disabled" : ""}
        onClick={() => {
          if (dataLength > 0) {
            setUserSortDirection(userSortDirection === "down" ? "up" : "down");
            initData({
              ...filters,
              sortField: "login",
              sortDirection: userSortDirection === "down" ? "asc" : "desc",
            });
            setStatusSortDirection("");
          }
        }}
        data-testid={"login-sort-button"}
      >
        {t("login")}
        <Box width={"18px"}>
          {dataLength > 0 &&
            (userSortDirection === "down" ? (
              <StyledSouthIcon
                isActive={!!userSortDirection}
                className={"visible"}
                sx={{
                  display: !userSortDirection ? "none" : "flex",
                  transition: "transform 0.3s ease",
                }}
              />
            ) : (
              <StyledSouthIcon
                isActive={!!userSortDirection}
                className={"visible"}
                sx={{
                  display: !userSortDirection ? "none" : "flex",
                  transition: "transform 0.3s ease",
                  transform: `rotate(-180deg)`,
                }}
              />
            ))}
        </Box>
      </StyledGridButton>
      <StyledGridButton
        className={dataLength === 0 ? "disabled" : ""}
        onClick={() => {
          if (dataLength > 0) {
            setStatusSortDirection(
              statusSortDirection === "down" ? "up" : "down"
            );
            initData({
              ...filters,
              sortField: "status",
              sortDirection: statusSortDirection === "down" ? "asc" : "desc",
            });
            setUserSortDirection("");
          }
        }}
        data-testid={"status-sort-button"}
      >
        {t("status")}
        <Box width={"18px"}>
          {dataLength > 0 &&
            (statusSortDirection === "down" ? (
              <StyledSouthIcon
                isActive={!!statusSortDirection}
                className={"visible"}
                sx={{
                  display: !statusSortDirection ? "none" : "flex",
                  transition: "transform 0.3s ease",
                }}
              />
            ) : (
              <StyledSouthIcon
                isActive={!!statusSortDirection}
                className={"visible"}
                sx={{
                  display: !statusSortDirection ? "none" : "flex",
                  transition: "transform 0.3s ease",
                  transform: `rotate(-180deg)`,
                }}
              />
            ))}
        </Box>
      </StyledGridButton>
    </StyledRoot>
  );
};

export default RecipientGridSortButton;
