import { Grid, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import TextField from "../../common/Field/TextField";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

const emptyObj = () => {
  return {
    id: 0,
    employeeName: null,
    value: null,
    actualValue: null,
  };
};

const StyledAddButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  textTransform: "none",
  fontSize: 11,
  fontWeight: 500,
}));

const CEMSSanctionEmployeeList = ({
  editMode,
  employees = [],
  onChangeData,
}) => {
  const { t } = useTranslation();
  let { sanctionId } = useParams();

  const [localEmployees, setLocalEmployees] = useState(employees.concat());

  const initRegulationsData = () => {
    if (employees.length > 0) {
      setLocalEmployees([...employees]);
    } else {
      const tmp = [emptyObj()];
      setLocalEmployees(tmp);
      onChangeData(tmp);
    }
  };
  useEffect(() => {
    if (sanctionId == 0) {
      onAddClick();
    }
  }, []);

  useEffect(() => {
    if (!editMode) {
      initRegulationsData();
    }
  }, [editMode]);

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

    const tmp = [emptyObj(), ...localEmployees];
    setLocalEmployees(tmp);
    onChangeData(tmp);
  };

  const onDelete = (index) => {
    localEmployees.splice(index, 1);
    setLocalEmployees([...localEmployees]);
    onChangeData([...localEmployees]);
  };

  const GetTextFields = ({ index, item }) => {
    GetTextFields.propTypes = {
      index: PropTypes.number,
      item: PropTypes.object,
    };
    return (
      <Grid key={index} container spacing={2} paddingTop={"20px"}>
        <Grid item xs={3}>
          <TextField
            isDisabled={!editMode}
            label={t("employeeName")}
            value={item.employeeName}
            size={"default"}
            fieldName={"employeeName"}
            onChange={(value) => {
              onChange(item, value, "employeeName");
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            isDisabled={!editMode}
            label={t("employeeId")}
            value={item.employeeId}
            size={"default"}
            fieldName={"employeeId"}
            onChange={(value) => {
              onChange(item, value, "employeeId");
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            isDisabled={!editMode}
            label={t("employeePosition")}
            value={item.employeePosition}
            fieldName={"employeePosition"}
            size={"default"}
            onChange={(value) => {
              onChange(item, value, "employeePosition");
            }}
          />
        </Grid>
        <Grid item>
          <Box flex={0}>
            {editMode && localEmployees.length > 1 && (
              <IconButton
                onClick={() => {
                  onDelete(index);
                }}
              >
                <DeleteRoundedIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box marginTop={"10px"}>
        <StyledAddButton onClick={onAddClick} endIcon={<AddIcon />}>
          {t("addNew")}
        </StyledAddButton>
      </Box>
      {localEmployees.map((r, index) => {
        return <GetTextFields index={index} item={r} />;
      })}
    </Box>
  );
};

CEMSSanctionEmployeeList.propTypes = {
  employees: PropTypes.array,
  onChangeData: PropTypes.func,
  editMode: PropTypes.bool,
};
export default CEMSSanctionEmployeeList;
