import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTranslation } from "react-i18next";
import useConfig from "../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { ReturnSchedule } from "../../../types/returnCreationSchedule.type";
import React from "react";

interface RSCDetailCustomListProps {
  data?: ReturnSchedule[];
  itemId: number;

  onSelect(item: ReturnSchedule): void;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
  "& .MuiList-root": {
    border: theme.palette.borderColor,
  },
}));

const StyledScheduleTime = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#4F5863",
  fontSize: 11,
  lineHeight: "16px",
  display: "flex",
  paddingTop: 4,
}));

const StyledListItem = styled(ListItem)(({ theme }: { theme: any }) => ({
  width: "100%",
  padding: "12px",
  borderBottom: theme.palette.borderColor,
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    color: "#FFF",
    "& p": {
      color: "#FFF",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const StyledStatus = styled("span")({
  height: 8,
  width: 8,
  borderRadius: 50,
  marginRight: 5,
});

const StyledStatusText = styled(Typography)({
  color: "#98A7BC",
  fontSize: 11,
  lineHeight: "12px",
  fontWeight: 500,
});

const StyledUserName = styled(Typography)({
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "20px",
});

const RSCDetailCustomList: React.FC<RSCDetailCustomListProps> = ({
  onSelect,
  data,
  itemId,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const isSelected = (item: ReturnSchedule) => {
    return itemId == item.id;
  };

  return (
    <StyledRoot display="flex" flexDirection="column">
      <Box flex={1}>
        <List component="nav" disablePadding data-testid={"return-form-list"}>
          {data?.map((item, i) => {
            return (
              <StyledListItem
                key={"reference-" + i}
                autoFocus={isSelected(item)}
                dense
                value={"reference-" + i}
                selected={isSelected(item)}
                onClick={() => onSelect(item)}
              >
                <div key={i}>
                  <Box display={"flex"} alignItems={"center"}>
                    <StyledStatus
                      style={{
                        backgroundColor: item.status ? "#289E20" : "#FF4128",
                      }}
                    />
                    <StyledStatusText>
                      {item.status ? t("active") : t("inactive")}
                    </StyledStatusText>
                  </Box>
                  <Box pt={"4px"}>
                    <Box display={"flex"}>
                      <StyledUserName>{item.taskName}</StyledUserName>
                    </Box>
                    <StyledScheduleTime>
                      <Typography fontSize={12}>Schedule Time:</Typography>
                      <Typography pl={"5px"}>
                        {getFormattedDateValue(
                          item.scheduleTime,
                          getDateFormat(true)
                        )}
                      </Typography>
                    </StyledScheduleTime>
                  </Box>
                </div>
              </StyledListItem>
            );
          })}
        </List>
      </Box>
    </StyledRoot>
  );
};

export default RSCDetailCustomList;
