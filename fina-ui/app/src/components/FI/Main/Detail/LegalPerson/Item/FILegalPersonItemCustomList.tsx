import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTranslation } from "react-i18next";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { styled, useTheme } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import React from "react";

const StyledRoot = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
});

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  width: "100%",
  height: "80px",
  padding: "12px",
  cursor: "pointer",
  borderBottom: theme.palette.borderColor,
  "&.Mui-focusVisible": {
    backgroundColor: "none",
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

const commonTypographyStyles = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  paddingTop: "4px",
  width: "100%",
};

const StyledPrimaryText = styled(Typography)(({ theme }: any) => ({
  fontSize: "13px",
  color: theme.palette.textColor,
  fontWeight: 500,
  lineHeight: "20px",
  fontFamily: "Inter",
  ...commonTypographyStyles,
}));

const StyledSecondaryText = styled(Typography)(({ theme }) => ({
  fontSize: "11px",
  color: theme.palette.mode === "light" ? "#4F5863" : "#dedcdc",
  fontWeight: 400,
  lineHeight: "16px",
  ...commonTypographyStyles,
}));

interface FILegalPersonItemCustomListProps {
  onSelect: (person: LegalPersonDataType) => void;
  data: LegalPersonDataType[];
  itemId: number | string;
}

const FILegalPersonItemCustomList: React.FC<
  FILegalPersonItemCustomListProps
> = ({ onSelect, data, itemId }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const isSelected = (item: LegalPersonDataType) => {
    return itemId == item.id;
  };

  return (
    <StyledRoot
      display="flex"
      flexDirection="column"
      data-testid={"legalPersonList"}
    >
      <Box flex={1}>
        <List component="nav" disablePadding>
          {data?.map((item, i) => {
            return (
              <StyledListItem
                key={"reference-" + i}
                data-testid={"reference-" + i}
                autoFocus={isSelected(item)}
                dense
                value={"reference-" + i}
                selected={isSelected(item)}
                onClick={() => onSelect(item)}
              >
                <div key={i}>
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
                        sx={{ width: 10, height: 10, marginRight: "4px" }}
                      />
                    </Box>
                    <StyledHeaderText
                      style={{
                        color: isSelected(item)
                          ? "#F0F4FF"
                          : theme.palette.mode === "dark"
                          ? "#ABBACE"
                          : "#98A7BC",
                      }}
                    >
                      {item.residentStatus
                        ? t(item.residentStatus)
                        : t("legalPerson")}
                    </StyledHeaderText>
                  </Box>
                  <StyledPrimaryText>{item.name}</StyledPrimaryText>
                  <StyledSecondaryText>
                    {t("personId")} : {item.identificationNumber}
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

export default FILegalPersonItemCustomList;
