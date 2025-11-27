import { Button, Grid, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import { useTranslation } from "react-i18next";
import { loadRegulationsCatalog } from "../../../api/services/CEMSSanctionService";
import { useEffect, useState } from "react";
import TextField from "../../common/Field/TextField";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledAddIcon = styled(AddIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledAddNewButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  textTransform: "none",
  fontSize: 11,
  fontWeight: 500,
}));

const emptyObj = () => {
  return {
    id: 0,
    regulationCatalog: null,
    value: null,
    actualValue: null,
  };
};
const CEMSanctionRegulation = ({
  editMode,
  regulations = [],
  onChangeData,
}) => {
  const { t } = useTranslation();
  let { sanctionId } = useParams();

  const [catalogData, setCatalogData] = useState([]);
  const [localRegulation, setLocalRegulations] = useState(regulations.concat());

  const initRegulationsData = () => {
    if (regulations.length > 0) {
      setLocalRegulations([...regulations]);
    } else {
      const tmp = [emptyObj()];
      setLocalRegulations(tmp);
      onChangeData(tmp);
    }
  };

  useEffect(() => {
    loadRegulationsCatalogData();
    if (sanctionId == 0) {
      onAddClick();
    }
  }, []);

  useEffect(() => {
    if (!editMode) {
      initRegulationsData();
    }
  }, [editMode]);

  const loadRegulationsCatalogData = async () => {
    const response = await loadRegulationsCatalog();
    setCatalogData(response.data);
  };

  const onChange = (regulationItem, value, fieldName) => {
    if (fieldName === "regulationCatalog") {
      regulationItem[fieldName] = value;
    } else {
      regulationItem[fieldName] = value;
    }
  };

  const onAddClick = () => {
    if (!editMode) {
      return;
    }

    const tmp = [emptyObj(), ...localRegulation];
    setLocalRegulations(tmp);
    onChangeData(tmp);
  };

  const onDelete = (index) => {
    localRegulation.splice(index, 1);
    setLocalRegulations([...localRegulation]);
    onChangeData([...localRegulation]);
  };

  const CatalogAutoComplete = ({ regulation }) => {
    CatalogAutoComplete.propTypes = {
      regulation: PropTypes.object,
    };

    return (
      <CustomAutoComplete
        disabled={!editMode}
        label={t("regulationCatalog")}
        data={catalogData}
        selectedItem={regulation.regulationCatalog}
        displayFieldName={"value"}
        valueFieldName={"key"}
        onChange={(value) => {
          onChange(regulation, value, "regulationCatalog");
        }}
        size={"default"}
      />
    );
  };

  const GetTextFields = ({ item }) => {
    GetTextFields.propTypes = {
      item: PropTypes.object,
    };
    return (
      <>
        <Grid item xs={3}>
          <TextField
            isDisabled={!editMode}
            label={t("setValue")}
            value={item.value}
            size={"default"}
            fieldName={"value"}
            onChange={(value) => {
              onChange(item, value, "value");
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            isDisabled={!editMode}
            label={t("actualValue")}
            value={item.actualValue}
            fieldName={"actualValue"}
            size={"default"}
            onChange={(value) => {
              onChange(item, value, "actualValue");
            }}
          />
        </Grid>
      </>
    );
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box marginTop={"10px"}>
        <StyledAddNewButton onClick={onAddClick} endIcon={<StyledAddIcon />}>
          {t("addNew")}
        </StyledAddNewButton>
      </Box>
      {localRegulation?.map((r, index) => (
        <Grid key={index} container spacing={2} paddingTop={"20px"}>
          <Grid item xs={3}>
            <CatalogAutoComplete regulation={r} />
          </Grid>
          <GetTextFields item={r} />
          <Grid item>
            {editMode && localRegulation.length > 1 && (
              <IconButton
                onClick={() => {
                  onDelete(index);
                }}
              >
                <DeleteRoundedIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

CEMSanctionRegulation.propTypes = {
  regulations: PropTypes.array,
  originalData: PropTypes.array,
  editMode: PropTypes.bool,
  onChangeData: PropTypes.func,
};
export default CEMSanctionRegulation;
