import { Box, IconButton, Typography } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../../../../../util/appUtil";
import useConfig from "../../../../../../hoc/config/useConfig";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React, { useState } from "react";
import MiniPaging from "../../../../../common/Paging/MiniPaging";
import { styled } from "@mui/material/styles";
import {
  LicenseHistoryDataType,
  LicensesDataType,
} from "../../../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  boxShadow: "10px 10px 20px 0px rgba(0, 0, 0, 0.75);",
  background: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: 10,
  borderBottom: theme.palette.borderColor,
  alignItems: "center",
}));

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  padding: 10,
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#FFF",
    "& p": {
      color: "#FFF",
    },
    "& .MuiButtonBase-root-MuiListItem-root:hover": {
      backgroundColor: theme.palette.buttons.primary.hover,
    },
  },
}));

const StyledHistoryIconBox = styled(Box)(({ theme }: any) => ({
  border: theme.palette.borderColor,
  height: 32,
  width: 32,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
  padding: 10,
  display: "flex",
  justifyContent: "center",
}));

interface FiHistoryBarProps {
  setHistoryBarOpen: (open: boolean) => void;
  historyPagingPage: number;
  setHistoryPagingPage: (page: number) => void;
  historyPagingLimit: number;
  historyModeHandler: (item: LicenseHistoryDataType | null) => void;
  historyList: LicenseHistoryDataType[];
  historyLength: number;
  setHistoryData: (data: any) => void;
  selectedHistory?: LicensesDataType;
  onHistoryPagingLimitChange?: (limit: number) => void;
}

const FiHistoryBar: React.FC<FiHistoryBarProps> = ({
  setHistoryBarOpen,
  historyPagingPage,
  setHistoryPagingPage,
  historyPagingLimit,
  historyModeHandler,
  historyList,
  historyLength,
  setHistoryData,
  selectedHistory,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [selectedItem, setSelectedItem] = useState<
    LicenseHistoryDataType | undefined
  >();

  const isSelected = (item: LicenseHistoryDataType) => {
    return selectedItem?.revisionNumber === item.revisionNumber;
  };

  return (
    <StyledRoot>
      <StyledHeader>
        <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
          {t("history")}
        </Typography>
        <IconButton onClick={() => setHistoryBarOpen(false)}>
          <DoubleArrowRoundedIcon
            sx={{ color: "#C2CAD8" }}
            fontSize={"small"}
          />
        </IconButton>
      </StyledHeader>
      <Box height={"100%"} overflow={"auto"}>
        <List component="nav" disablePadding>
          {historyList
            ?.sort((a, b) => b.revisionNumber - a.revisionNumber)
            .map((item: LicenseHistoryDataType, i) => (
              <StyledListItem
                key={"reference-" + i}
                autoFocus={isSelected(item)}
                dense
                selected={isSelected(item)}
                onClick={() => {
                  setSelectedItem(item);
                  historyModeHandler(item);
                  setHistoryBarOpen(false);

                  if (selectedHistory) {
                    setHistoryData({
                      ...item.entity,
                      allBankingOperations:
                        selectedHistory.allBankingOperations,
                      licenseType: selectedHistory.licenseType,
                    });
                  } else {
                    setHistoryData(item.entity);
                  }
                }}
              >
                <Box key={i} display={"flex"}>
                  <StyledHistoryIconBox>
                    <Box display={"flex"}>
                      <HistoryRoundedIcon
                        style={{
                          color: isSelected(item) ? "#FFF" : "#8695B1",
                        }}
                      />
                    </Box>
                  </StyledHistoryIconBox>
                  <Box paddingLeft={"10px"}>
                    <Typography fontSize={12} fontWeight={600}>
                      {getFormattedDateValue(
                        item.modifiedAt,
                        getDateFormat(true)
                      )}
                    </Typography>
                    <Typography fontSize={11} color={"#8695B1"}>
                      {item.modifiedBy}
                    </Typography>
                  </Box>
                </Box>
              </StyledListItem>
            ))}
        </List>
      </Box>
      <StyledPagingBox>
        <MiniPaging
          initialRowsPerPage={historyPagingLimit}
          onPageChange={(number) => setHistoryPagingPage(number)}
          totalNumOfRows={historyLength}
          initialedPage={historyPagingPage}
        />
      </StyledPagingBox>
    </StyledRoot>
  );
};

export default FiHistoryBar;
