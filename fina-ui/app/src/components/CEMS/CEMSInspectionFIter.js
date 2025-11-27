import { Box } from "@mui/system";
import Divider from "@mui/material/Divider";
import { Grid, IconButton, Typography } from "@mui/material";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import Popover from "@mui/material/Popover";
import FilterListIcon from "@mui/icons-material/FilterList";
import GhostBtn from "../common/Button/GhostBtn";
import TextField from "../common/Field/TextField";
import FilterChip from "../common/Chip/FilterChip";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import { styled } from "@mui/material/styles";

const StyledHeader = styled(Box)({
  color: "#2C3644",
  fontWeight: 600,
  fontSize: 15,
  margin: 10,
  paddingLeft: 12,
});

const StyledItem = styled(Box)(({ theme }) => ({
  paddingTop: "8px",
  paddingBottom: "8px",
  paddingInline: "16px",
  width: 650,
  fontSize: "13px",
  border: theme.palette.borderColor,
}));

const StyledDivider = styled("span")(({ theme }) => ({
  margin: "0 5px",
  height: "100%",
  width: 1,
  backgroundColor: theme.palette.mode === "light" ? "#EAEBF0" : "#596c87",
}));

const CEMSInspectionFIter = ({ onFilterClickFunc }) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [customFilter, setCustomFilter] = useState();

  const clearEmptyChipHandler = (key) => {
    let filter = { ...customFilter };
    delete filter[key];
    setCustomFilter({ ...filter });
  };

  const onClear = () => {
    setCustomFilter(null);
  };

  const onDeleteChip = (key) => {
    let filter = { ...customFilter };
    delete filter[key[0]];
    setCustomFilter({ ...filter });
  };

  const setValue = (key, value) => {
    let filter = { ...customFilter };
    filter[key] = value;
    setCustomFilter({ ...filter });
  };

  return (
    <Box display={"flex"} sx={{ color: "#8695B1", cursor: "pointer" }}>
      <Box display={"flex"} alignItems={"center"}>
        <StyledDivider />
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.target);
          }}
        >
          <FilterListIcon fontSize={"small"} />
        </IconButton>
      </Box>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPaper-root": {
            overflow: "hidden !important",
          },
        }}
      >
        <StyledItem>
          <StyledHeader>{t("filter")}</StyledHeader>
          <Divider />
          <Box>
            <Box display={"flex"} alignItems={"center"} height={"40px"}>
              {customFilter &&
                Object.entries(customFilter).map((item, index) => {
                  return (
                    item[1] !== "" && (
                      <FilterChip
                        data={item}
                        key={index}
                        maxWidth={"80px"}
                        icon={
                          <CloseIcon
                            sx={{ color: "#9AA7BE", fontSize: 15 }}
                            onClick={() => onDeleteChip(item)}
                          />
                        }
                      />
                    )
                  );
                })}
              {customFilter && Object.keys(customFilter).length >= 2 && (
                <Typography
                  onClick={() => {
                    onClear();
                  }}
                  sx={{
                    color: "#8695B1",
                    fontSize: 12,
                    fontWeight: 400,
                    cursor: "pointer",
                  }}
                >
                  {t("clearAll")}
                </Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Box>
            <Grid container m={"10px 0"}>
              <Grid item xs={12}>
                <TextField
                  label={t("personOfTheBankOfExecution")}
                  value={customFilter?.executionPerson}
                  onChange={(val) => {
                    setValue("executionPerson", val);
                    if (val === "") {
                      clearEmptyChipHandler("executionPerson");
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid container m={"10px 0"}>
              <Grid item xs={4} paddingRight={"10px"}>
                <TextField
                  label={t("groundsForHoldingTheCPU")}
                  value={customFilter?.CPU}
                  onChange={(val) => {
                    setValue("CPU", val);
                    if (val === "") {
                      clearEmptyChipHandler("CPU");
                    }
                  }}
                  multiline={true}
                  rows={2}
                />
              </Grid>
              <Grid item xs={4} paddingRight={"10px"}>
                <TextField
                  label={t("ordersContent")}
                  value={customFilter?.ordersContent}
                  onChange={(val) => {
                    setValue("ordersContent", val);
                    if (val === "") {
                      clearEmptyChipHandler("ordersContent");
                    }
                  }}
                  multiline={true}
                  rows={2}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={t("note")}
                  value={customFilter?.note}
                  onChange={(val) => {
                    setValue("note", val);
                    if (val === "") {
                      clearEmptyChipHandler("note");
                    }
                  }}
                  multiline={true}
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box paddingTop={"10px"} justifyContent={"flex-end"} display={"flex"}>
            <GhostBtn
              onClick={() => {
                setAnchorEl(null);
              }}
              sx={(theme) => ({
                fontSize: "13px",
                fontWeight: "400",
                color: theme.palette.textColor,
                borderRadius: "5px",
                border: `0.5px solid ${
                  theme.palette.mode === "light" ? "lightgrey" : "#3C4D68"
                }`,
                textTransform: "none",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light" ? "#e6e6e6" : "#3C4D68",
                  border: `0.5px solid ${
                    theme.palette.mode === "light" ? "lightgrey" : "#3C4D68"
                  }`,
                },
              })}
            >
              {t("cancel")}
            </GhostBtn>
            <PrimaryBtn
              variant="contained"
              color="primary"
              onClick={() => {
                onFilterClickFunc(customFilter);
                setAnchorEl(null);
              }}
              sx={(theme) => ({
                fontSize: "13px",
                fontWeight: "400",
                borderRadius: "5px",
                textTransform: "none",
                marginLeft: "5px",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              })}
              endIcon={<FilterListRoundedIcon fontSize={"small"} />}
            >
              {t("filter")}
            </PrimaryBtn>
          </Box>
        </StyledItem>
      </Popover>
    </Box>
  );
};

CEMSInspectionFIter.propTypes = {
  onFilterClickFunc: PropTypes.func,
};

export default CEMSInspectionFIter;
