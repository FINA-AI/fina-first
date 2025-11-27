import { Box, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Divider from "@mui/material/Divider";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Popover from "@mui/material/Popover";
import CheckboxBtn from "../../../common/Checkbox/CheckboxBtn";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import FilterChip from "../../../common/Chip/FilterChip";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const StyledCloseIcon = styled(CloseIcon)({
  color: "#9AA7BE",
  fontSize: 15,
});

const StyledPopoverInnerBox = styled(Box)(({ theme }) => ({
  width: 200,
  borderRadius: 4,
  border: theme.palette.borderColor,
}));

const StyledFilterIcon = styled(FilterListIcon, {
  shouldForwardProp: (prop) => prop !== "anchorEl",
})(({ theme, anchorEl }) => ({
  marginRight: 8,
  marginLeft: 8,
  color: theme.palette.mode === "light" ? "#8695B1" : "#5D789A",
  height: "100%",
  cursor: "pointer",
  borderRadius: 22,
  padding: "2px",
  background: !!anchorEl
    ? theme.palette.mode === "light"
      ? "#F5F5F5"
      : "#45577e"
    : "none",
  "&:hover": {
    background: theme.palette.mode === "dark" ? "#1F2532" : "#F5F5F5",
    borderRadius: 22,
  },
}));

const StyledClearAll = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: 12,
  marginLeft: 8,
  marginRight: 8,
  display: "flex",
  alignSelf: "center",
  cursor: "pointer",
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: 15,
  margin: 10,
  color: theme.palette.textColor,
}));

const StyledFilterItem = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColor,
  fontWeight: 400,
  fontSize: 13,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const StyledSecondHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 12,
  marginTop: 12,
  marginBottom: 5,
  marginLeft: 10,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: theme.palette.secondaryTextColor,
}));

const StyledExpandFilterItem = styled(Typography)(({ theme }) => ({
  boxSizing: "border-box",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  borderBottom: theme.palette.borderColor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
}));

const StyledFilterItemContainer = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  height: 30,
});

const StyledDivider = styled(Divider)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0",
}));

const PersonsFilter = ({ onFilterClick, onClearFilters }) => {
  const [currFilters, setCurrFilters] = useState([]);
  const [filters, setFilters] = useState([
    { name: "active", checked: false },
    { name: "inactive", checked: false },
    { name: "financeInstitute", checked: false },
    { name: "otherLegalEntity", checked: false },
    { name: "management", checked: false },
    { name: "beneficiary", checked: false },
    { name: "branch", checked: false },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorOthers, setAnchorOthers] = useState(null);
  const { t } = useTranslation();

  const check = (name) => {
    if (filters.find((filter) => filter.name === name)?.checked) {
      setCurrFilters(currFilters.filter((item) => item !== name));
    } else setCurrFilters([...currFilters, name]);

    setFilters(
      filters.map((filter) =>
        filter.name === name
          ? {
              ...filter,
              checked: !filter.checked,
            }
          : filter
      )
    );
  };
  const getFilterOption = (name) => {
    return (
      <StyledFilterItemContainer display={"flex"}>
        <CheckboxBtn
          onClick={() => {
            check(name);
          }}
          checked={filters.find((filter) => filter.name === name)?.checked}
        />
        <StyledFilterItem>{t(name)}</StyledFilterItem>
      </StyledFilterItemContainer>
    );
  };

  const otherFiltersPopover = () => {
    let tmp = currFilters.map((item) => item);
    return (
      <>
        {tmp.splice(2).map((item, index) => {
          return (
            <StyledExpandFilterItem display={"flex"} key={index}>
              <StyledFilterItem sx={{ padding: "5px" }}>
                {t(item)}
              </StyledFilterItem>
              <StyledCloseIcon
                onClick={() => {
                  check(item);
                }}
              />
              &#160;
            </StyledExpandFilterItem>
          );
        })}
      </>
    );
  };

  const constructFilter = () => {
    const filterObj = {
      active: !filters.find((f) => f.name === "inactive").checked,
    };
    let fiChecked = filters.find((f) => f.name === "financeInstitute").checked;
    let legalEntityChecked = filters.find(
      (f) => f.name === "otherLegalEntity"
    ).checked;

    if (fiChecked || legalEntityChecked) {
      const organizationArray = [];
      if (fiChecked) {
        organizationArray.push("FI");
      }

      if (legalEntityChecked) {
        organizationArray.push("LEGAL_PERSON");
      }
      filterObj["organizationType"] = organizationArray;
    }

    let management = filters.find((f) => f.name === "management").checked;
    let beneficiary = filters.find((f) => f.name === "beneficiary").checked;

    let branch = filters.find((f) => f.name === "branch").checked;

    const arr = [];
    if (management) {
      arr.push("MANAGEMENT");
    }

    if (branch) {
      arr.push("BRANCHES");
    }

    if (beneficiary) {
      arr.push("SHAREHOLDERS");
    }

    filterObj.pages = arr;

    return filterObj;
  };

  return (
    <Box display={"flex"} padding={"10px"}>
      {currFilters[0] && (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <FilterChip
            name={currFilters[0]}
            icon={
              <StyledCloseIcon
                onClick={() => {
                  check(currFilters[0]);
                }}
              />
            }
            chipKey={currFilters?.[0]}
          />
        </Box>
      )}
      {currFilters[1] && (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <FilterChip
            name={currFilters[1]}
            icon={
              <StyledCloseIcon
                onClick={() => {
                  check(currFilters[1]);
                }}
              />
            }
            chipKey={currFilters?.[1]}
          />
        </Box>
      )}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        onClick={(event) => {
          setAnchorOthers(event.currentTarget);
        }}
      >
        {currFilters.length > 2 && (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <FilterChip
              name={t("Other ") + (currFilters.length - 2)}
              chipKey={"others-dropdown"}
              icon={
                !!anchorOthers ? (
                  <ExpandLessIcon sx={{ color: "#9AA7BE", fontSize: 15 }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#9AA7BE", fontSize: 15 }} />
                )
              }
            />
          </Box>
        )}
      </Box>
      <Popover
        open={!!anchorOthers}
        anchorEl={anchorOthers}
        onClose={() => setAnchorOthers(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box width={109}>{otherFiltersPopover()}</Box>
      </Popover>

      <Box display={"flex"} alignItems={"center"}>
        <StyledClearAll
          onClick={() => {
            setFilters(
              filters.map((filter) => ({
                ...filter,
                checked: false,
              }))
            );
            setCurrFilters([]);
            onClearFilters();
          }}
        >
          {t("clearAll")}
        </StyledClearAll>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        <StyledFilterIcon
          anchorEl={anchorEl}
          onClick={(event) => {
            setAnchorEl(event.target);
          }}
        />
      </Box>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <StyledPopoverInnerBox display={"flex"} flexDirection={"column"}>
          <StyledHeader>{t("filter")}</StyledHeader>
          <StyledDivider orientation="horizontal" flexItem />
          <Box
            display={"flex"}
            flexDirection={"column"}
            padding={"0px 20px 10px 10px"}
          >
            <Box>
              <StyledSecondHeader>{t("status")}</StyledSecondHeader>
              {getFilterOption("active")}
              {getFilterOption("inactive")}
            </Box>

            <StyledDivider orientation="horizontal" flexItem />
            <Box>
              <StyledSecondHeader>{t("organisationType")}</StyledSecondHeader>
              {getFilterOption("financeInstitute")}
              {getFilterOption("otherLegalEntity")}
            </Box>

            <StyledDivider orientation="horizontal" flexItem />
            <Box>
              <StyledSecondHeader>{t("pages")}</StyledSecondHeader>
              <>
                {getFilterOption("management")}
                {getFilterOption("beneficiary")}
                {getFilterOption("branch")}
              </>
            </Box>
          </Box>
          <StyledDivider orientation="horizontal" flexItem />
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <PrimaryBtn
              height={42}
              onClick={() => {
                onFilterClick(constructFilter());
                setAnchorEl(null);
              }}
            >
              {t("filter")}
            </PrimaryBtn>
          </Box>
        </StyledPopoverInnerBox>
      </Popover>
    </Box>
  );
};

PersonsFilter.propTypes = {
  onFilterClick: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default PersonsFilter;
