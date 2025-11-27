import { useTranslation } from "react-i18next";
import { Box, Select, Typography } from "@mui/material";
import Tooltip from "../common/Tooltip/Tooltip";
import Accordion from "@mui/material/Accordion";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import MenuItem from "@mui/material/MenuItem";
import LegalPersonLinkButton from "../common/Button/LegalPersonLinkButton";
import { styled } from "@mui/material/styles";
import { FullConnectionStructureType } from "../../types/connectedCompanies.type";

const StyledSectionHeaderText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 12,
  color: theme.palette.mode === "light" ? "#707C93" : "#c1d3e7",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  marginRight: 3,
  cursor: "pointer",
}));

const StyledSectionBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  paddingBottom: 20,
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
}));

const StyledCard = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#44556b",
  border: theme.palette.borderColor,
  borderRadius: 2,
  padding: "8px 0 8px 10px",
  display: "flex",
  alignItems: "center",
  marginBottom: 5,
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

const StyledMenuItem = styled(MenuItem)({
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
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const StyledSelect = styled(Select)(({ theme }) => ({
  width: 70,
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
    display: "block",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const StyledSeeMoreContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  wrap: "nowrap",
  marginTop: 5,
}));

const StyledId = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#9ea9c0",
  fontSize: 12,
  marginLeft: 5,
}));

const MenuProps = {
  PaperProps: {
    sx: {
      width: "170px",
      boxSizing: "border-box",
      maxHeight: "300px",
      backgroundColor: "#2A3341",
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

const StyledConnection = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isConnectionShares",
})<{ isConnectionShares: boolean }>(({ isConnectionShares }) => ({
  color: isConnectionShares ? "#2962FF" : "#FD6B0A",
  marginRight: "5px",
  fontSize: "12px",
  marginLeft: "5px",
}));

interface ConnectedCompaniesSectionProps {
  name: string;
  data: FullConnectionStructureType[];
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConnectedCompaniesSection: React.FC<ConnectedCompaniesSectionProps> = ({
  name,
  data,
  expand,
  setExpand,
}) => {
  const { t } = useTranslation();
  const [filterDependencyType, setFilterDependencyType] = useState("all");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (filterDependencyType === "all") {
      setFilteredData(data);
    } else {
      let newFilteredData = data.filter(
        (item) =>
          item.dependencies.find((row) => row.legalPerson.name === name)
            ?.dependencyType === filterDependencyType ||
          item.dependencies.find((row) => row.legalPerson.name === name)
            ?.dependencyType === "BOTH"
      );
      setFilteredData(newFilteredData);
    }
  }, [filterDependencyType]);

  const AccordionCard = (item: FullConnectionStructureType, index: number) => {
    let type = item.dependencies.find(
      (row) => row.legalPerson.name === name
    )?.dependencyType;
    return (
      <StyledCard key={index}>
        <LegalPersonLinkButton id={item.source.id} />
        <StyledConnection isConnectionShares={type === "AFFILIATED"}>
          {item.source.name}
        </StyledConnection>
        <StyledId>{item.source.identificationNumber}</StyledId>
      </StyledCard>
    );
  };

  return (
    <StyledSectionBox>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"8px"}
      >
        <Tooltip title={`${name}'s Connected Companies`}>
          <StyledSectionHeaderText>
            {`${name}'s Connected Companies`}
          </StyledSectionHeaderText>
        </Tooltip>
        <Box display={"flex"} alignItems={"center"}>
          <StyledSelect
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterDependencyType}
            MenuProps={MenuProps}
            onChange={(event) => {
              setFilterDependencyType(event.target.value as string);
            }}
          >
            <StyledMenuItem value={"all"}>{t("ALL")}</StyledMenuItem>
            <StyledMenuItem value={"AFFILIATED"}>{t("shares")}</StyledMenuItem>
            <StyledMenuItem value={"ASSOCIATED"}>
              {t("management")}
            </StyledMenuItem>
          </StyledSelect>
        </Box>
      </Box>
      <Box>
        <Accordion expanded={expand}>
          <AccordionSummary>
            <Box display={"flex"} flexDirection={"column"} width={"100%"}>
              {filteredData?.slice(0, 3).map((item, index) => {
                return AccordionCard(item, index);
              })}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {filteredData?.slice(3).map((item, index) => {
              return AccordionCard(item, index);
            })}
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box display={"flex"}>
        {data?.length > 3 && (
          <StyledSeeMoreContainer onClick={() => setExpand(!expand)}>
            <StyledSeeMoreLessText>
              {expand ? t("seeLess") : t("seeMore")}
            </StyledSeeMoreLessText>
            {expand ? (
              <StyledKeyboardArrowUpRounded />
            ) : (
              <StyledKeyboardArrowDownRounded />
            )}
          </StyledSeeMoreContainer>
        )}
      </Box>
    </StyledSectionBox>
  );
};

export default ConnectedCompaniesSection;
