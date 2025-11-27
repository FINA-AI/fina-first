import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import { useTranslation } from "react-i18next";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { styled } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import React from "react";

const StyledRoot = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
});

const StyledHeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "11px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  color: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A !important",
  width: "100%",
  lineHeight: "12px",
  fontWeight: 500,
}));

const StyledPrimaryText = styled(Typography)(({ theme }: any) => ({
  fontSize: "13px",
  color: theme.palette.textColor,
  fontWeight: 500,
  lineHeight: "20px",
  fontFamily: "Inter",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  width: "100%",
  paddingTop: "4px",
}));

const StyledSecondaryText = styled(StyledPrimaryText)(({ theme }) => ({
  fontSize: "11px",
  color: theme.palette.mode === "light" ? "#4F5863" : "#dedcdc",
  fontWeight: 400,
  lineHeight: "16px",
}));

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  width: "100%",
  height: "80px",
  padding: "12px",
  borderBottom: theme.palette.borderColor,
  cursor: "pointer",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&:hover": {
    background:
      theme.palette.mode === "light" ? "rgba(80,80,80, 0.05)" : "#344258",
  },
  "&.Mui-selected": {
    color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    backgroundColor: `${theme.palette.primary.main} !important`,
    "& p": {
      color: theme.palette.mode === "dark" ? "#3C4D68 " : "#FFF",
    },
    "& .MuiListItem-button:hover": {
      backgroundColor: `${theme.palette.buttons.primary.hover} !important`,
    },
  },
}));

interface FIPhysicalPersonItemCustomListProps {
  data: PhysicalPersonDataType[];
  onSelect: (item: PhysicalPersonDataType) => void;
  itemId: string;
}

const FIPhysicalPersonItemCustomList: React.FC<
  FIPhysicalPersonItemCustomListProps
> = ({ data, onSelect, itemId }) => {
  const { t } = useTranslation();

  const isSelected = (item: PhysicalPersonDataType) => {
    return Number(itemId) === item.fiPersonId;
  };

  return (
    <StyledRoot
      display="flex"
      flexDirection="column"
      data-testid={"fi-physical-person-list"}
    >
      <Box flex={1}>
        <List component="nav" disablePadding>
          {data.map((item, i) => {
            return (
              <StyledListItem
                key={"reference-" + i}
                selected={isSelected(item)}
                dense
                // value={"reference-" + i}
                onClick={() => {
                  onSelect(item);
                }}
              >
                <div
                  key={item.fiPersonId}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                    }}
                  >
                    <Box
                      alignContent={"center"}
                      style={{
                        color: item.status === "ACTIVE" ? "#289E20" : "#FF4128",
                        display: "flex",
                        justifyContent: "start",
                      }}
                    >
                      <FiberManualRecordIcon
                        sx={{
                          width: 10,
                          height: 10,
                          marginRight: "4px",
                        }}
                      />
                    </Box>
                    <StyledHeaderText
                      style={{
                        color: isSelected(item) ? "#F0F4FF" : undefined,
                      }}
                    >
                      {item.residentStatus
                        ? t(item.residentStatus)
                        : t("physicalPerson")}
                    </StyledHeaderText>
                  </Box>
                  <StyledPrimaryText>{item.name}</StyledPrimaryText>
                  <StyledSecondaryText>
                    {t("personId")} : {item.identificationNumber} |{" "}
                    {t("fiPassport")} : {` ${item.passportNumber}`}
                  </StyledSecondaryText>
                </div>
              </StyledListItem>
            );
          })}
        </List>
      </Box>
    </StyledRoot>
  );
};

export default FIPhysicalPersonItemCustomList;
