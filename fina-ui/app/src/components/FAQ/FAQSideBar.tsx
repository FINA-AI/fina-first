import { Box } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import React, { FC } from "react";
import { getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { useTranslation } from "react-i18next";
import { FaqDataType } from "../../types/faq.type";
import { styled } from "@mui/material/styles";

interface FAQSideBarProps {
  setSideMenu: React.Dispatch<
    React.SetStateAction<{ open: boolean; row: FaqDataType | null }>
  >;
  setSelectedRow: React.Dispatch<React.SetStateAction<FaqDataType | null>>;
  data: FaqDataType | null;
}

const StyledRoot = styled(Box)({
  display: "flex",
  height: "100%",
  flexDirection: "column",
});

const StyledDateBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 4,
  marginTop: 4,
  fontSize: 12,
  lineHeight: "20px",
});

const StyledSequenceBox = styled(Box)({
  backgroundColor: "#FFF4E5",
  padding: "2px 4px",
  fontSize: 11,
  lineHeight: "12px",
  color: "#FF8D00",
  width: "fit-content",
  marginTop: 8,
});

const StyledTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
});

const StyledSecondaryText = styled(Typography)({
  color: "#98A7BC",
  fontSize: 12,
  lineHeight: "20px",
});

const StyledPrimaryText = styled(Typography)({
  fontSize: 12,
  lineHeight: "20px",
});

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: 10,
  borderTop: theme.palette.borderColor,
  borderBottom: theme.palette.borderColor,
  alignItems: "center",
}));

const StyledContentBox = styled(Box)(({ theme }: any) => ({
  padding: 12,
  borderBottom: theme.palette.borderColor,
}));

const StyledDoubleArrowIcon = styled(DoubleArrowRoundedIcon)(
  ({ theme }: any) => ({
    ...theme.smallIcon,
  })
);

const FAQSideBar: FC<FAQSideBarProps> = ({
  setSideMenu,
  setSelectedRow,
  data,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  return (
    data && (
      <StyledRoot>
        <StyledHeader>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <StyledTitle>{data.user}</StyledTitle>
            <IconButton
              onClick={() => {
                setSideMenu({ open: false, row: null });
                setSelectedRow(null);
              }}
            >
              <StyledDoubleArrowIcon fontSize={"small"} />
            </IconButton>
          </Box>
          <Box>
            <StyledDateBox>
              {getFormattedDateValue(data.publish, getDateFormat(true))}
              <StyledSecondaryText>{t("publishDate")}</StyledSecondaryText>
            </StyledDateBox>
            <StyledSequenceBox>{`${t("sequence")}: ${
              data.sequence
            }`}</StyledSequenceBox>
          </Box>
        </StyledHeader>
        <Box>
          <StyledContentBox>
            <StyledSecondaryText>{t("question")}</StyledSecondaryText>
            <StyledPrimaryText>{data.question}</StyledPrimaryText>
          </StyledContentBox>
        </Box>
        <StyledContentBox>
          <StyledSecondaryText>{t("answer")}</StyledSecondaryText>
          <StyledPrimaryText>{data.answer}</StyledPrimaryText>
        </StyledContentBox>
      </StyledRoot>
    )
  );
};

export default FAQSideBar;
