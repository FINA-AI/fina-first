import { Box } from "@mui/system";
import { Divider, Select, Typography } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import CopyCellButton from "../common/Grid/CopyCellButton";
import { useTranslation } from "react-i18next";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import React, { useState } from "react";
import TextButton from "../common/Button/TextButton";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import ConnectedCompaniesInfo from "./ConnectedCompaniesInfo";
import LegalPersonLinkButton from "../common/Button/LegalPersonLinkButton";
import { styled } from "@mui/material/styles";
import { ConnectedCompaniesDataType } from "../../types/connectedCompanies.type";
import { BeneficiariesDataType } from "../../types/fi.type";

const StyledRootBox = styled(Box)(({ theme }: { theme: any }) => ({
  paddingBottom: 20,
  width: "100%",
  "& .MuiAccordionSummary-content": {
    margin: "0!important",
  },
  "& .MuiAccordionDetails-root": {
    padding: "0!important",
  },
  "& .MuiButtonBase-root": {
    padding: "0!important",
    minHeight: "0 !important",
  },
  "& .MuiPaper-root": {
    boxShadow: "none",
  },
  borderLeft: theme.palette.borderColor,
}));

const StyledCompanyInfo = styled(Box)({
  padding: "15px 15px 0 15px",
  marginRight: 10,
});

const StyledCompanyText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontSize: "14px",
  fontWeight: 600,
  color: theme.palette.textColor,
  marginRight: "8px",
  marginLeft: "8px",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
  overflow: "hidden",
}));

const StyledCompanyInfoValues = styled(Typography)(
  ({ theme }: { theme: any }) => ({
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.textColor,
    paddingTop: 5,
  })
);

const StyledBeneficiaryInfoBox = styled(Box)(({}) => ({
  backgroundColor: "#F5F5F5",
  padding: "8px 0 8px 10px",
  marginBottom: 5,
  borderRadius: 2,
  border: "1px solid #F5F5F5",
  display: "flex",
  alignItems: "center",
}));

const StyledBeneficiaryHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 11,
  color: theme.palette.mode === "light" ? "#707C93" : "#bfd0e8",
  marginBottom: 5,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  width: 75,
  height: 30,
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-select": {
    width: "150px",
    height: "20px",
    background: theme.palette.mode === "light" ? "#f2f7ff" : "#43586b",
    borderRadius: "2px",
    padding: "4px 8px 4px 4px",
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: 400,
    alignItems: "center",
  },
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#2A3341",
  padding: "12px 20px",
  "&:hover": {
    backgroundColor: "#3f4754",
    cursor: "pointer",
  },
  "& .MuiTypography-root": {
    color: "#fff",
  },
  "& .MuiSvgIcon-root": {
    color: "#fff !important",
    fontSize: 16,
  },
}));

const seeMoreLessStyles = {
  color: "#2962FF",
  fontSize: 12,
  cursor: "pointer",
};

const StyledSeeMoreLessText = styled(Typography)({
  ...seeMoreLessStyles,
});

const StyledKeyboardArrowUpRounded = styled(KeyboardArrowUpRounded)({
  ...seeMoreLessStyles,
});

const StyledKeyboardArrowDownRounded = styled(KeyboardArrowDownRounded)({
  ...seeMoreLessStyles,
});

const StyledConnectedCompaniesHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#707C93" : "#bfd0e8",
  fontSize: 11,
  paddingTop: "6px",
}));

const MenuProps = {
  PaperProps: {
    sx: {
      width: "150px",
      boxSizing: "border-box",
      maxHeight: "300px",
      "& .MuiMenuItem-root": {
        background: "inherit",
        fontSize: "11px",
        lineHeight: "16px",
        fontWeight: 400,
        textTransform: "capitalize",
        padding: "4px",
        minWidth: "200px",
      },
      "& .Mui-selected": {
        background: "rgba(255, 255, 255, 0.1)",
      },
      "& .MuiMenuItem-root:hover": {
        background: "#FFFFFF0D",
      },
    },
  },
};

interface ConnectedCompaniesGeneralInfoProps {
  setIsRightSideOpen: (value: boolean) => void;
  selectedItem: ConnectedCompaniesDataType;
}

const ConnectedCompaniesGeneralInfo: React.FC<
  ConnectedCompaniesGeneralInfoProps
> = ({ setIsRightSideOpen, selectedItem }) => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);
  const [filterDependencyType, setFilterDependencyType] = useState("all");
  const [connectedCompaniesExpand, setConnectedCompaniesExpand] =
    useState(false);

  const GetBeneficiaryInfo = (
    item: BeneficiariesDataType,
    key: number | string
  ) => {
    return (
      <StyledBeneficiaryInfoBox key={key}>
        <LegalPersonLinkButton id={item.id} />
        <Typography color={"#2962FF"} fontSize={13} fontWeight={500}>
          {item.dependencyType === "AFFILIATED"
            ? item.legalPerson?.name
            : item.legalPerson?.name}
        </Typography>
        <Typography color={"#434B59"} fontSize={12} pl={"5px"}>
          - {item.legalPerson?.name}
        </Typography>
        <Typography color={"#8695B1"} fontSize={12} pl={"5px"}>
          {item.identificationNumber}
        </Typography>
      </StyledBeneficiaryInfoBox>
    );
  };

  return (
    <StyledRootBox>
      <StyledCompanyInfo>
        <Box display={"flex"} justifyContent={"space-between"} pb={"8px"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            alignContent={"center"}
            paddingTop={"5px"}
          >
            <div
              style={{
                backgroundColor:
                  selectedItem.source.status === "ACTIVE"
                    ? "#289E20"
                    : "#ff4128",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                marginRight: "5px",
              }}
            />
            <Typography
              sx={{ fontSize: 11, color: "#AEB8CB", paddingTop: "1px" }}
            >
              {selectedItem.source.status ?? t("inactive").toUpperCase()}
            </Typography>
          </Box>
          <Box
            onClick={() => setIsRightSideOpen(false)}
            sx={{ cursor: "pointer" }}
          >
            <DoubleArrowRoundedIcon sx={{ color: "#c2cad8" }} />
          </Box>
        </Box>
        <Box>
          <Box display={"flex"} alignItems={"end"}>
            <LegalPersonLinkButton id={selectedItem.source.id} />
            <StyledCompanyText>{selectedItem.source.name}</StyledCompanyText>
            <Typography sx={{ fontSize: "12px", color: "#9AA7BE" }}>
              {selectedItem.source.identificationNumber}
            </Typography>
            <CopyCellButton text={selectedItem.source.identificationNumber} />
          </Box>
          <Box>
            <Box display={"flex"} alignItems={"center"} pt={"6px"}>
              <Typography
                sx={{ fontSize: 14, color: "#9AA7BE", marginRight: "5px" }}
              >
                {t("country")} :
              </Typography>
              <StyledCompanyInfoValues>
                {selectedItem.source.country?.name}
              </StyledCompanyInfoValues>
            </Box>
          </Box>
        </Box>
      </StyledCompanyInfo>
      <Divider sx={{ paddingTop: "8px" }} />
      <StyledCompanyInfo>
        <StyledBeneficiaryHeader>{t("beneficiaries")}</StyledBeneficiaryHeader>
        <Box>
          <Accordion expanded={expanded}>
            <AccordionSummary>
              <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                {selectedItem.source.beneficiaries
                  ?.slice(0, 3)
                  .map((item, index) => {
                    return GetBeneficiaryInfo(item, index);
                  })}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {selectedItem.source.beneficiaries
                ?.slice(3)
                .map((item, index) => {
                  return GetBeneficiaryInfo(item, `${index}_beneficiary`);
                })}
            </AccordionDetails>
          </Accordion>
          {selectedItem.source.beneficiaries?.length > 3 && (
            <div>
              <TextButton
                onClick={() => setExpanded(!expanded)}
                endIcon={
                  expanded ? (
                    <KeyboardArrowUpRounded />
                  ) : (
                    <KeyboardArrowDownRounded />
                  )
                }
              >
                {expanded ? t("seeLess") : t("seeMore")}
              </TextButton>
            </div>
          )}
        </Box>
      </StyledCompanyInfo>
      <Divider />
      <StyledCompanyInfo>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignContent={"center"}
          pb={"8px"}
        >
          <StyledConnectedCompaniesHeader>
            {t("connectedCompanies")}
          </StyledConnectedCompaniesHeader>
          <Box>
            <StyledSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterDependencyType}
              MenuProps={MenuProps}
              onChange={(event) =>
                setFilterDependencyType(event.target.value as string)
              }
            >
              <StyledMenuItem value={"all"}>{t("ALL")}</StyledMenuItem>
              <StyledMenuItem value={"ASSOCIATED"}>
                {t("shares")}
              </StyledMenuItem>
              <StyledMenuItem value={"AFFILIATED"}>
                {t("management")}
              </StyledMenuItem>
            </StyledSelect>
          </Box>
        </Box>

        {selectedItem.legalPerson && !selectedItem.dependencies && (
          <ConnectedCompaniesInfo
            company={{
              dependencyType: selectedItem.dependencyType,
              legalPerson: selectedItem.legalPerson,
            }}
          />
        )}
        <Box width={"100%"} paddingTop={"8px"}>
          <Accordion expanded={connectedCompaniesExpand}>
            <AccordionSummary>
              <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                {selectedItem.dependencies
                  ?.filter(
                    (item) => item.dependencyType !== filterDependencyType
                  )
                  .slice(0, 3)
                  .map((company, index) => {
                    return (
                      <ConnectedCompaniesInfo company={company} index={index} />
                    );
                  })}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {selectedItem.dependencies
                ?.filter((item) => item.dependencyType !== filterDependencyType)
                .slice(3)
                .map((company, index) => {
                  return (
                    <ConnectedCompaniesInfo
                      company={company}
                      index={`${index}_connectedInfo`}
                    />
                  );
                })}
            </AccordionDetails>
          </Accordion>
          {(selectedItem.dependencies?.length ?? 0) > 3 && (
            <Box
              onClick={() =>
                setConnectedCompaniesExpand(!connectedCompaniesExpand)
              }
              sx={{
                display: "flex",
                alignItems: "center",
                wrap: "nowrap",
                marginTop: "5px",
              }}
            >
              <StyledSeeMoreLessText>
                {connectedCompaniesExpand ? t("seeLess") : t("seeMore")}
              </StyledSeeMoreLessText>
              {connectedCompaniesExpand ? (
                <StyledKeyboardArrowUpRounded />
              ) : (
                <StyledKeyboardArrowDownRounded />
              )}
            </Box>
          )}
        </Box>
      </StyledCompanyInfo>
    </StyledRootBox>
  );
};

export default ConnectedCompaniesGeneralInfo;
