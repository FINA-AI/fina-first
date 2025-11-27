import { Box } from "@mui/system";
import MiniPaging from "../../../../../common/Paging/MiniPaging";
import { IconButton, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import React, { useState } from "react";
import HistoryIcon from "@mui/icons-material/History";
import ToolbarIcon from "../../../../../common/Icons/ToolbarIcon";
import useConfig from "../../../../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { BeneficiariesDataType } from "../../../../../../types/fi.type";

interface FIBeneficiaryHistoryPageProps {
  pagingPage: number;
  onPagingLimitChange?: (limit: number) => void;
  onPagingPageChange: (page: number) => void;
  pagingLimit: number;
  onCloseHistory: () => void;
  shareholders: BeneficiariesDataType[];
  onChangeHistory: (history: BeneficiariesDataType) => void;
  selectedHistory: BeneficiariesDataType | null;
  loading: boolean;
  shareholdersHistoryLength: number;
  onSelectHistory: (history: BeneficiariesDataType) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: theme.palette.borderColor,
  background: theme.palette.paperBackground,
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "center",
  borderTop: theme.palette.borderColor,
  padding: "12px 16px",
  background: theme.palette.paperBackground,
}));

const StyledTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "20px",
});

const StyledInfoName = styled("span")(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const StyledInfoDate = styled("span", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(
  ({ theme, active }: { theme: any; active: boolean | null }) => ({
    color: active
      ? "#FFFFFF"
      : theme.palette.mode === "light"
      ? "#8695B1"
      : "#a7b2cc",
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "16px",
  })
);

const StyledHistoryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  cursor: "pointer",
  padding: "8px 16px",
  "&:hover": {
    background: "rgba(80,80,80, 0.05)",
  },
  "&.activeHistoryItem": {
    background: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.primary.main,
    },
    "& .MuiSvgIcon-root": {
      color: "#FFFFFF",
    },
    "& .MuiButtonBase-root": {
      background: theme.palette.secondary.dark,
      border: "none",
    },
  },
}));

const FIBeneficiaryHistoryPage: React.FC<FIBeneficiaryHistoryPageProps> = ({
  pagingPage,
  onPagingPageChange,
  pagingLimit,
  onCloseHistory,
  shareholders,
  onChangeHistory,
  selectedHistory,
  loading,
  shareholdersHistoryLength,
  onSelectHistory,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [selected, setSelected] = useState<BeneficiariesDataType | null>(
    selectedHistory
  );

  const isRowActive = (item: BeneficiariesDataType) => {
    return selected && selected["index"] === item["index"];
  };

  const date = getFormattedDateValue(new Date().getTime(), getDateFormat(true));

  return (
    <StyledRoot component={Paper} data-testid={"history-slide"}>
      <StyledHeader data-testid={"header"}>
        <StyledTitle>{t("history")}</StyledTitle>
        <IconButton
          size={"small"}
          onClick={onCloseHistory}
          data-testid={"close"}
        >
          <KeyboardDoubleArrowRightIcon sx={{ color: "#C2CAD8" }} />
        </IconButton>
      </StyledHeader>
      {!loading && (
        <>
          <Box sx={{ height: "100%", overflow: "auto" }}>
            {shareholders.map((item, index) => (
              <StyledHistoryItem
                key={index}
                className={isRowActive(item) ? "activeHistoryItem" : ""}
                onClick={() => {
                  setSelected(item);
                  onChangeHistory(item);
                  onSelectHistory(item);
                }}
                data-testid={"item-" + index}
              >
                <ToolbarIcon
                  onClickFunction={() => {}}
                  Icon={<HistoryIcon />}
                  isSquare={false}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "12px",
                  }}
                >
                  <StyledInfoName data-testid={"name-label"}>
                    {item.legalPerson
                      ? item.legalPerson.name
                      : item.physicalPerson?.name}
                  </StyledInfoName>
                  <StyledInfoDate
                    active={isRowActive(item) ?? false}
                    data-testid={"date-label"}
                  >
                    {date}
                  </StyledInfoDate>
                </Box>
              </StyledHistoryItem>
            ))}
          </Box>
          <StyledFooter>
            <MiniPaging
              totalNumOfRows={shareholdersHistoryLength}
              initialedPage={pagingPage}
              onPageChange={(number) => onPagingPageChange(number)}
              initialRowsPerPage={pagingLimit}
            />
          </StyledFooter>
        </>
      )}
    </StyledRoot>
  );
};

export default FIBeneficiaryHistoryPage;
