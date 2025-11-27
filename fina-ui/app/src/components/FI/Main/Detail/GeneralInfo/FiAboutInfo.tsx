import { Box, Grid, Typography } from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import GroupIcon from "@mui/icons-material/Group";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import React from "react";
import FiInput from "../../../Common/FiInput";
import { FieldType } from "../../../util/FiUtil";
import { FiDataType } from "../../../../../types/fi.type";

interface FiAboutInfoProps {
  fi: FiDataType;
  editMode: boolean;
  onValueChange: (name: string, value: string) => void;
}

const StyledText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "150%",
  textTransform: "capitalize",
  color: theme.palette.textColor,
  marginTop: "8px",
}));

const FiAboutInfo: React.FC<FiAboutInfoProps> = ({
  fi,
  editMode,
  onValueChange,
}) => {
  const { t } = useTranslation();

  const Header = () => {
    return (
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <StyledText>{t("aboutInfo")}</StyledText>
      </Box>
    );
  };

  return (
    <Box display={"flex"} width={"100%"} flexDirection={"column"}>
      <Header />
      <Grid container>
        <Grid item p={"4px"} xs={3}>
          <FiInput
            title={t("numberOfEmployes")}
            name={"numberOfEmploys"}
            value={fi.numberOfEmploys}
            icon={<GroupIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            inputTypeProp={{ inputType: FieldType.NUMBER }}
            width={"100%"}
            pattern={/^\d*$/}
          />
        </Grid>
        <Grid item xs={3} p={"4px"}>
          <FiInput
            title={t("numberOfMobileOffices")}
            name={"numberOfMobileOffices"}
            value={fi.numberOfMobileOffices}
            icon={<SmartphoneIcon />}
            editMode={editMode}
            onValueChange={onValueChange}
            inputTypeProp={{ inputType: FieldType.NUMBER }}
            width={"100%"}
            pattern={/^\d*$/}
          />
        </Grid>
        {!editMode &&
          fi.branchTypeCounterList?.map((item, index) => {
            return (
              <Grid item xs={3} p={"4px"} key={index}>
                <FiInput
                  title={item.name}
                  value={item.count}
                  icon={<HomeWorkIcon />}
                  editMode={editMode}
                  width={"100%"}
                />
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default FiAboutInfo;
