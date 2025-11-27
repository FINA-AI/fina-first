import { Box, Grid, IconButton } from "@mui/material";
import React, { memo, useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import CopyButton from "../../../../common/Button/CopyButton";
import PhoneIcon from "@mui/icons-material/Phone";
import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FiMainInfoMiniSkeleton from "../../../Skeleton/GeneralInfo/FiMainInfoMiniSkeleton";
import { styled } from "@mui/material/styles";
import { LegalFormIcon } from "../../../../../api/ui/icons/LegalFormIcon";
import { SwiftCodeIcon } from "../../../../../api/ui/icons/SwiftCodeIcon";

const StyledRoot = styled(Box)({
  overflow: "hidden",
  "& .MuiAccordionSummary-content": {
    margin: "10px 0 !important",
  },
  "& .MuiAccordionSummary-root": {
    minHeight: "0!important",
  },
  borderRadius: "4px",
});

const StyledFiTitle = styled(Box)(({ theme }) => ({
  paddingLeft: 10,
  paddingRight: 10,
  height: "40px",
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "4px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginRight: 10,
}));

const StyledCodeContainer = styled(Box)(({ theme }) => ({
  borderRadius: "4px",
  backgroundColor: theme.palette.paperBackground,
  boxSizing: "border-box",
  height: "40px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light" ? "#D4E0FF !important" : "#8695B1",
    color: "rgba(104, 122, 158, 0.8) !important",
  },
  display: "flex",
  alignItems: "center",
  marginRight: 12,
  padding: "5px 12px",
}));

const StyledLogoContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light" ? "#F0F4FF" : "rgb(69, 87, 112)",
  width: "40px",
  height: "40px",
  borderRadius: "6px",
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "dark" ? "#5D789A" : "#9AA7BE",
  },
}));

const StyledArrowBtn = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiButtonBase-root:nth-of-type(1)": {
    "&:hover": {
      color: "rgba(104, 122, 158, 0.8) !important",
    },
  },
});

const StyledItemContainer = styled(Box)(({ theme }) => ({
  "& :hover": {
    "& #logoContainer": {
      backgroundColor:
        theme.palette.mode === "light"
          ? "#D4E0FF !important"
          : "rgb(69, 87, 112)",
      color: "rgba(104, 122, 158, 0.8) !important",
    },
  },
}));

const StyledCode = styled(Box)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "13px",
  lineHeight: "20px",
  color: theme.palette.mode === "light" ? "#4F5863" : "#ABBACE",
  marginRight: "5px",
}));

const StyledBoxItem = styled(Box)({
  "& .MuiAccordionSummary-expandIconWrapper": {
    display: "none !important",
  },
});

const StyledText = styled(Typography)(({ theme }) => ({
  width: "90%",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "13px",
  lineHeight: "20px",
  color: theme.palette.mode === "light" ? "#2C3644" : "#FFFFFF",
}));

const StyledTitle = styled(Typography)({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  color: "#98A7BC",
  marginBottom: "4px",
});

const FiMainInfoMini = ({ fi, fiSeeMore, setFISeeMore }) => {
  const Item = ({ title, value, icon }) => {
    const { t } = useTranslation();
    const [showCopyButton, setShowCopyButton] = useState(false);

    return (
      <StyledItemContainer
        display={"flex"}
        onMouseEnter={() => {
          if (value) {
            setShowCopyButton(true);
          }
        }}
        onMouseLeave={() => {
          if (value) {
            setShowCopyButton(false);
          }
        }}
        data-testid={title}
      >
        <Box display={"flex"} flex={1} flexDirection={"row"} width={"100%"}>
          <Grid container direction={"row"}>
            <Grid item xs={1}>
              <StyledLogoContainer
                id={"logoContainer"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flex={1}
              >
                {icon}
              </StyledLogoContainer>
            </Grid>
            <Grid item xs={10} style={{ paddingLeft: 15 }}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                width={"100%"}
                flex={1}
                ml={2}
                justifyContent={"space-between"}
              >
                <StyledTitle noWrap data-testid={"title"}>
                  {t(title)}
                </StyledTitle>
                <StyledText noWrap data-testid={"value"}>
                  {value}
                </StyledText>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Box
                display={"flex"}
                flex={0}
                flexDirection={"column"}
                justifyContent={"center"}
              >
                {showCopyButton && <CopyButton text={value} />}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </StyledItemContainer>
    );
  };

  const BoxItem = ({ children }) => {
    BoxItem.propTypes = {
      children: PropTypes.any,
    };

    return (
      <StyledBoxItem display={"flex"} flex={1} width={"20%"}>
        <Grid container mr={"8px"}>
          <Grid item width={"100%"}>
            {children}
          </Grid>
        </Grid>
      </StyledBoxItem>
    );
  };

  return !fi ? (
    <FiMainInfoMiniSkeleton />
  ) : (
    <StyledRoot width={"100%"} data-testid={"fi-main-info-mini"}>
      <Accordion expanded={fiSeeMore}>
        <AccordionSummary>
          <Grid container>
            <Grid item xs={10} display={"flex"}>
              <BoxItem>
                <StyledFiTitle display={"flex"} alignItems={"center"}>
                  <Typography
                    noWrap
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "21px",
                    }}
                    data-testid={"fi-name-label"}
                  >
                    {fi.name}
                  </Typography>
                </StyledFiTitle>
              </BoxItem>
              <BoxItem>
                <Item
                  title={"legalForm"}
                  value={fi.additionalInfo?.businessEntity?.description}
                  icon={<LegalFormIcon />}
                />
              </BoxItem>
              <BoxItem>
                <Item
                  title={"managementFieldmail"}
                  value={fi.email}
                  icon={<MailIcon />}
                />
              </BoxItem>
              <BoxItem>
                <Item title={"phone"} value={fi.phone} icon={<PhoneIcon />} />
              </BoxItem>
            </Grid>
            <Grid item xs={2} display={"flex"}>
              <BoxItem>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Box
                    display={"flex"}
                    flex={1}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                  >
                    <StyledCodeContainer>
                      <StyledCode data-testid={"fi-code-label"}>
                        {fi.code}
                      </StyledCode>
                      <CopyButton text={fi.code} width={15} height={16} />
                    </StyledCodeContainer>
                  </Box>
                </Box>
              </BoxItem>
              <StyledArrowBtn>
                <IconButton
                  onClick={() => setFISeeMore(!fiSeeMore)}
                  size="large"
                  sx={{ width: "40px", height: "40px" }}
                  data-testid={`see-${fiSeeMore ? "less" : "more"}-button`}
                >
                  {fiSeeMore ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </StyledArrowBtn>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container display={"flex"}>
            <Grid item display={"flex"} xs={10}>
              <BoxItem>
                <Item
                  title={"swiftCode"}
                  value={fi.swiftCode}
                  icon={<SwiftCodeIcon />}
                />
              </BoxItem>
              <BoxItem>
                <Item
                  title={"address"}
                  value={fi.addressString}
                  icon={<LocationOnIcon />}
                />
              </BoxItem>
              <BoxItem>
                <Item
                  title={"webSite"}
                  value={fi.webSite}
                  icon={<DesktopMacIcon />}
                />
              </BoxItem>
              <BoxItem>
                <Item
                  title={"representativePerson"}
                  value={fi.representativePerson}
                  icon={<HowToRegIcon />}
                />
              </BoxItem>
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </StyledRoot>
  );
};

FiMainInfoMini.propTypes = {
  fi: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.any,
  fiSeeMore: PropTypes.bool,
  setFISeeMore: PropTypes.func,
};

export default memo(FiMainInfoMini);
