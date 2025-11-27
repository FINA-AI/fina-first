import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import TagField from "../../common/Field/TagField";
import { Box } from "@mui/system";
import { loadMeasureOfReasonsCatalogData } from "../../../api/services/CEMSSanctionService";
import { Checkbox, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledTextBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "315px",
  height: "68px",
  backgroundColor: theme.palette.mode === "dark" ? "#1f2b3b" : "#F0F4FF",
  textOverflow: "ellipsis",
  overflow: "auto",
  whiteSpace: "break-spaces",
}));

const StyledCheckbox = styled(Checkbox)({
  padding: 5,
  "& .MuiSvgIcon-root": {
    width: "16px",
    height: "16px",
  },
});

const CEMSMeasureOfReasonsField = ({ editMode, originalData, onChange }) => {
  const { t } = useTranslation();
  const [measureReasonsCatalog, setMeasureReasonsCatalogData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    const catalog = await loadMeasureOfReasonsCatalogData();
    setMeasureReasonsCatalogData(catalog.data);
  };

  const ValueItems = () => {
    return (
      <Grid container spacing={2}>
        {originalData?.measureReasonCatalog?.map((item) => (
          <Grid item key={item.key}>
            <StyledTextBox>
              <Box>
                <StyledCheckbox size={"small"} checked disabled={!editMode} />
              </Box>
              <Box style={{ fontSize: "12px" }}>{item.value}</Box>
            </StyledTextBox>
          </Grid>
        ))}
      </Grid>
    );
  };

  const onSelectChange = (item) => {
    if (onChange) {
      let result = item
        .map((measure) => {
          return measureReasonsCatalog.find(
            (child) => child["key"] === measure
          );
        })
        .filter((measure) => measure);
      onChange(result);
    }
  };

  return editMode ? (
    <TagField
      label={t("cemsMeasureInfoGroupTitle")}
      disabled={!editMode}
      data={measureReasonsCatalog}
      selectedValues={originalData.measureReasonCatalog.map((s) => s.key)}
      size={"default"}
      onChange={onSelectChange}
      filter={true}
    />
  ) : (
    <ValueItems />
  );
};

CEMSMeasureOfReasonsField.propTypes = {
  editMode: PropTypes.bool,
  originalData: PropTypes.object,
  onChange: PropTypes.func,
};

export default CEMSMeasureOfReasonsField;
