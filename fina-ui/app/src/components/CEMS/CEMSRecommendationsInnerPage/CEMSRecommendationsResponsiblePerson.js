import TextField from "../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Box } from "@mui/system";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledRootGrid = styled(Grid)(({ theme, isEditMode }) => ({
  "& .MuiOutlinedInput-root ": {
    "& .Mui-disabled": {
      "& .Mui-disabled": {
        "-webkit-text-fill-color": isEditMode
          ? ""
          : `${theme.palette.labelColor} !important`,
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#98A7BC",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: isEditMode
      ? ""
      : '${theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0"} !important',
  },
  alignItems: "center",
}));

const StyledAddNewBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.primary.main,
  paddingTop: 10,
  cursor: "pointer",
  maxWidth: 140,
}));

const CEMSRecommendationsResponsiblePerson = ({
  emsRecommendationDetails,
  isEditMode,
  data,
  setData,
  updateChild,
  onChangeEmsRecommendationDetails,
}) => {
  const { t } = useTranslation();
  let { recommendationId } = useParams();

  useEffect(() => {
    if (recommendationId === 0) {
      onChangeEmsRecommendationDetails({
        fiResponsiblePersons: [{ fullName: "", position: "" }],
      });
      setData({
        ...data,
        fiResponsiblePersons: [{ fullName: "", position: "" }],
      });
    }
  }, []);

  const addNewPerson = () => {
    const newPerson = {
      fullName: "",
      position: "",
    };
    let arr = emsRecommendationDetails.current.fiResponsiblePersons ?? [];
    onChangeEmsRecommendationDetails({
      fiResponsiblePersons: [newPerson, ...arr],
    });
    let fiResponsiblePersons = data.fiResponsiblePersons ?? arr;
    setData({
      ...data,
      fiResponsiblePersons: [newPerson, ...fiResponsiblePersons],
    });
  };

  const onDeleteFiResponsiblePerson = (index) => {
    let fiResponsiblePersonsArr = data.fiResponsiblePersons.filter(
      (person, inxd) => inxd !== index
    );
    let result = {
      ...data,
      fiResponsiblePersons: fiResponsiblePersonsArr,
    };
    setData(result);
    onChangeEmsRecommendationDetails({
      fiResponsiblePersons: fiResponsiblePersonsArr,
    });
  };

  const GetRows = ({ rowData, index }) => {
    GetRows.propTypes = {
      rowData: PropTypes.any,
      index: PropTypes.number,
    };
    return (
      <StyledRootGrid
        container
        spacing={2}
        paddingTop={"10px"}
        key={index}
        isEditMode={isEditMode}
      >
        <Grid item xs={6}>
          <TextField
            isDisabled={!isEditMode}
            label={t("personOfTheBankOfExecution")}
            value={rowData?.fullName}
            onChange={(val) => {
              updateChild(index, "fullName", val);
            }}
          />
        </Grid>
        <Grid item xs={6} maxHeight={"60px"}>
          <Grid container>
            <Grid item xs={11}>
              <TextField
                isDisabled={!isEditMode}
                label={t("position")}
                value={rowData?.position}
                onChange={(val) => {
                  updateChild(index, "position", val);
                }}
              />
            </Grid>
            <Grid item xs={1}>
              {isEditMode && data?.fiResponsiblePersons.length > 1 && (
                <IconButton
                  sx={{ color: "#8695B1", marginLeft: "5px" }}
                  onClick={() => {
                    onDeleteFiResponsiblePerson(index);
                  }}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </StyledRootGrid>
    );
  };

  return (
    <>
      {(isEditMode || recommendationId === 0) && (
        <StyledAddNewBox
          onClick={() => {
            isEditMode && addNewPerson();
          }}
        >
          <AddRoundedIcon fontSize={"small"} />
          <Typography fontSize={14}>{t("addNew")}</Typography>
        </StyledAddNewBox>
      )}
      {data?.fiResponsiblePersons?.map((item, index) => {
        const rowData = { ...item };
        return <GetRows rowData={rowData} index={index} />;
      })}
    </>
  );
};

CEMSRecommendationsResponsiblePerson.propTypes = {
  isEditMode: PropTypes.bool,
  emsRecommendationDetails: PropTypes.object,
  data: PropTypes.object,
  setData: PropTypes.func,
  updateChild: PropTypes.func,
  onChangeEmsRecommendationDetails: PropTypes.func,
};

export default CEMSRecommendationsResponsiblePerson;
