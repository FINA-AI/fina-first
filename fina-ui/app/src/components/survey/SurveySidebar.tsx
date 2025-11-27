import { IconButton, Typography } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import React from "react";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { Survey, SurveyResult, SurveySideMenu } from "../../types/survey.type";

interface SurveySidebarProps {
  setSideMenu: React.Dispatch<React.SetStateAction<SurveySideMenu>>;
  data: Survey | null;
  surveyResult: SurveyResult[];
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  background: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: 10,
  borderTop: theme.palette.borderColor,
  borderBottom: theme.palette.borderColor,
  alignItems: "center",
}));

const StyledTitle = styled(Typography)(({ theme }: { theme: any }) => ({
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  color: theme.palette.textColor,
}));

const StyledArrowIcon = styled(DoubleArrowRoundedIcon)(
  ({ theme }: { theme: any }) => ({
    color: "#C2CAD8",
    ...theme.smallIcon,
  })
);

const StyledQuestion = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 500,
  lineHeight: "12px",
  color: theme.palette.mode === "light" ? "#596D89" : "#a9bad5",
  paddingBottom: 4,
}));

const StyledAnswer = styled(Typography)(({ theme }: { theme: any }) => ({
  fontSize: 12,
  lineHeight: "20px",
  color: theme.palette.textColor,
  paddingBottom: 12,
}));

const StyledSurveyWrapper = styled(Box)(({ theme }: { theme: any }) => ({
  borderBottom: theme.palette.borderColor,
  paddingTop: 12,
}));

const SurveySidebar: React.FC<SurveySidebarProps> = ({
  setSideMenu,
  data,
  surveyResult,
}) => {
  return (
    <StyledRoot data-testid={"survey-sidebar"}>
      <StyledHeader data-testid={"header"}>
        <StyledTitle data-testid={"name"}>{data?.name}</StyledTitle>
        <IconButton
          onClick={() => {
            setSideMenu({ open: false, row: null });
          }}
          data-testid={"close-button"}
        >
          <StyledArrowIcon fontSize={"small"} />
        </IconButton>
      </StyledHeader>
      <Box overflow={"auto"} data-testid={"questions-container"}>
        {surveyResult.map((item, index) => {
          return (
            <StyledSurveyWrapper key={index} data-testid={"question-" + index}>
              <Box p={"0 12px"}>
                <StyledQuestion data-testid={"key"}>{item.key}</StyledQuestion>
                <StyledAnswer data-testid={"value"}>{item.value}</StyledAnswer>
              </Box>
            </StyledSurveyWrapper>
          );
        })}
      </Box>
    </StyledRoot>
  );
};

export default SurveySidebar;
