import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { CALENDAR_MONTHS } from "../../containers/Calendar/CalendarContainer";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box)({
  display: "flex",
  minWidth: "206px",
  borderRadius: "8px",
  flexDirection: "column",
});

const StyledHeader = styled(Box)({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 0px",
  fontSize: "500",
  borderBottom: "1px solid #EAEBF0",
});

const StyledArrowLeftBtn = styled("span")({
  marginRight: "10px",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    color: "#8695B1",
    display: "flex",
    alignItems: "center",
  },
});
const StyledArrowRightBtn = styled("span")({
  marginLeft: "10px",
  alignItems: "center",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    color: "#8695B1",
    display: "flex",
    alignItems: "center",
  },
});

const StyledBody = styled(Box)({
  flexDirection: "row",
  width: "206px",
  height: "116px",
  "& .MuiBox-root:hover": {
    background: "#F5F5F5",
  },
});
const StyledMonth = styled(Box)<{ isActive: boolean }>(
  ({ isActive, theme }: { isActive: boolean; theme: any }) => ({
    color: theme.palette.secondaryTextColor,
    fontSize: "12px",
    lineHeight: "12px",
    fontWeight: "400",
    textTransform: "capitalize",
    width: "50px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    float: "left",
    cursor: "pointer",

    ...(isActive && {
      background: `${theme.palette.primary.main} !important`,
      color: "#FFFFFF",
      borderRadius: "3px",
    }),
  })
);

interface MiniCalendarProps {
  currentDate: Date;
  onChange: (index: number, year: number) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  currentDate,
  onChange,
}) => {
  const { t } = useTranslation();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth());
  }, []);

  return (
    <StyledRoot>
      <StyledHeader>
        <StyledArrowLeftBtn onClick={() => setYear(year - 1)}>
          <KeyboardArrowLeftIcon />
        </StyledArrowLeftBtn>
        <Box>{year}</Box>
        <StyledArrowRightBtn onClick={() => setYear(year + 1)}>
          <KeyboardArrowRightIcon />
        </StyledArrowRightBtn>
      </StyledHeader>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        paddingLeft={"5px"}
        marginTop={"5px"}
      >
        <StyledBody>
          {CALENDAR_MONTHS.map((mon, index) => {
            return (
              <StyledMonth
                key={index}
                isActive={index === month && year === currentDate.getFullYear()}
                onClick={() => {
                  setMonth(index);
                  onChange(index, year);
                }}
              >
                {t(mon).slice(0, 3)}
              </StyledMonth>
            );
          })}
        </StyledBody>
      </Box>
    </StyledRoot>
  );
};

export default MiniCalendar;
