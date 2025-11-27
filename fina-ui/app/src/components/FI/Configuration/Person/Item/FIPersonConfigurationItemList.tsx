import { Box, ListItemButton, Typography } from "@mui/material";
import List from "@mui/material/List";
import { useTranslation } from "react-i18next";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import React, { useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";

const StyledRoot = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
});

const StyledStatusText = styled(Typography)({
  marginLeft: "4px",
  color: "#7D95B3",
  fontSize: "11px",
  lineHeight: "12px",
  fontWeight: 500,
});

const StyledPrimaryText = styled(Typography)(({ theme }: any) => ({
  fontSize: "13px",
  color: theme.palette.textColor,
  fontWeight: 500,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  width: "100%",
  overflow: "hidden",
  lineHeight: "20px",
  marginTop: "4px",
  textTransform: "capitalize",
}));

const StyledSecondaryText = styled(StyledPrimaryText)(({ theme }) => ({
  fontSize: "11px",
  color: theme.palette.mode === "dark" ? "#ABBACE" : "#4F5863",
  fontWeight: 400,
  paddingTop: "5px",
  lineHeight: "16px",
  marginTop: "0px",
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }: any) => ({
  width: "100%",
  padding: "12px",
  borderBottom: theme.palette.borderColor,
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    backgroundColor: `${theme.palette.secondary.light}!important`,
    color: theme.palette.mode === "dark" ? "#2D3747" : "#FFF",
    "& p": {
      color: theme.palette.mode === "dark" ? "#2D3747" : "#FFF",
    },
    "&.MuiListItem-button:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

interface FIPersonConfigurationItemListProps {
  data: PhysicalPersonDataType[];
  onSelect: (personId: number) => void;
  itemId: string;
  selectedPerson?: PhysicalPersonDataType;
  setData: React.Dispatch<React.SetStateAction<PhysicalPersonDataType[]>>;
}

const FIPersonConfigurationItemList: React.FC<
  FIPersonConfigurationItemListProps
> = ({ data, onSelect, itemId, selectedPerson, setData }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedPerson && Object.keys(selectedPerson).length !== 0 && data) {
      const alreadyExists = data.some((item) => item.id === selectedPerson.id);
      if (!alreadyExists) {
        setData([selectedPerson, ...data]);
      }
    }
  }, [selectedPerson?.id, data]);

  const isSelected = (item: PhysicalPersonDataType) => {
    return Number(itemId) === item.id;
  };

  return (
    <StyledRoot
      display="flex"
      flexDirection="column"
      data-testid={"person-data-list"}
    >
      <Box flex={1}>
        <List component="nav" disablePadding>
          {data.map((item, i) => {
            return (
              <StyledListItemButton
                key={"reference-" + i}
                data-testid={"reference-" + i}
                autoFocus={isSelected(item)}
                selected={isSelected(item)}
                dense
                onClick={() => {
                  if (item.id === selectedPerson?.id) return;
                  onSelect(item.id);
                }}
              >
                <div key={item.fiPersonId}>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    alignContent={"center"}
                    style={{
                      color:
                        item.status === "ACTIVE"
                          ? theme.palette.mode === "dark"
                            ? "#47CD89"
                            : "#289E20"
                          : "#FF4128",
                    }}
                  >
                    <FiberManualRecordIcon sx={{ width: 10, height: 10 }} />
                    <StyledStatusText
                      style={{
                        color:
                          isSelected(item) && theme.palette.mode === "dark"
                            ? "#3C4D68"
                            : undefined,
                      }}
                    >
                      {item.status === "ACTIVE" ? t("active") : t("inactive")}
                    </StyledStatusText>
                  </Box>
                  <StyledPrimaryText>{item.name}</StyledPrimaryText>
                  <StyledSecondaryText
                    style={{
                      color:
                        isSelected(item) && theme.palette.mode === "dark"
                          ? "#194185"
                          : undefined,
                    }}
                  >
                    {t("personId")} : {item.identificationNumber}
                  </StyledSecondaryText>
                </div>
              </StyledListItemButton>
            );
          })}
        </List>
      </Box>
    </StyledRoot>
  );
};

export default FIPersonConfigurationItemList;
