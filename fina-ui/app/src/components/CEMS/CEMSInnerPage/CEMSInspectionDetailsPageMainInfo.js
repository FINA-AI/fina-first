import PropTypes from "prop-types";
import { Box } from "@mui/system";
import FiInput from "../../FI/Common/FiInput";
import { Grid } from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PersonIcon from "@mui/icons-material/Person";
import PortraitIcon from "@mui/icons-material/Portrait";
import { FieldType } from "../../FI/util/FiUtil";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledRootBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  padding: "10px 0px",
  borderBottom: `1px dashed ${
    theme.palette.mode === "dark" ? "#8d9299" : "#EAEBF0"
  }`,
  paddingBottom: "20px",
}));

const StyledInputContainer = styled(Box)({
  padding: "4px 9px",
});

const CEMSInspectionDetailsPageMainInfo = ({
  editMode,
  onChangeInspectionData,
  data,
  phase,
}) => {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    setSelectedUser(data.manager ? { ...data.manager } : {});
  }, [data]);

  const typeOfInspection = [
    { label: t("complexCheck"), value: "COMPLEX_CHECK" },
    { label: t("targetedVerification"), value: "TARGETED_VERIFICATION" },
    { label: t("topicCheck"), value: "TOPIC_CHECK" },
  ];

  return (
    <StyledRootBox>
      <Grid container>
        <Grid item xs={12} md={6} lg={4}>
          <StyledInputContainer>
            <FiInput
              title={t("typeOfInspection")}
              name={"typeOfInspection"}
              value={data.type}
              icon={<FactCheckIcon />}
              editMode={editMode}
              inputTypeProp={{
                inputType: FieldType.LIST,
                listData: typeOfInspection,
              }}
              width={"100%"}
              onValueChange={(value) => {
                onChangeInspectionData("type", value);
              }}
              readOnly={phase === 2}
            />
          </StyledInputContainer>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StyledInputContainer>
            {!editMode && (
              <FiInput
                title={t("headOfInspection")}
                value={selectedUser?.login ? selectedUser.login : ""}
                icon={<PersonIcon />}
                onValueChange={() => {}}
                editMode={false}
                inputTypeProp={{ inputType: FieldType.STRING }}
                width={"100%"}
              />
            )}
            {editMode && (
              <FiInput
                title={t("headOfInspection")}
                value={selectedUser && selectedUser.id ? [selectedUser] : []}
                icon={<PersonIcon />}
                onValueChange={(user) => {
                  let val =
                    typeof user === "object" && user.id ? { ...user } : null;
                  setSelectedUser(val);
                  onChangeInspectionData("manager", val);
                }}
                editMode={true}
                inputTypeProp={{ inputType: FieldType.USERS }}
                width={"100%"}
                readOnly={phase === 2}
              />
            )}
          </StyledInputContainer>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StyledInputContainer>
            <FiInput
              title={t("positionOfTheHeadOfInspection")}
              value={data["managerPosition"]}
              icon={<PortraitIcon />}
              onValueChange={(value) => {
                onChangeInspectionData("managerPosition", value);
              }}
              editMode={editMode}
              inputTypeProp={{ inputType: FieldType.STRING }}
              width={"100%"}
              readOnly={phase === 2}
            />
          </StyledInputContainer>
        </Grid>
      </Grid>
    </StyledRootBox>
  );
};

CEMSInspectionDetailsPageMainInfo.propTypes = {
  editMode: PropTypes.bool,
  onChangeInspectionData: PropTypes.any,
  data: PropTypes.object,
  phase: PropTypes.number,
};

export default CEMSInspectionDetailsPageMainInfo;
