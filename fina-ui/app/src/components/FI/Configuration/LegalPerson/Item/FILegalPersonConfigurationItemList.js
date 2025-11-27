import { Box, ListItemButton, Typography } from "@mui/material";
import List from "@mui/material/List";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import React from "react";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
});

const StyledListItemButton = styled(ListItemButton)({
  width: "100%",
  height: "92px",
  padding: "14px 24px",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    backgroundColor: "#157AFF!important",
    color: "#FFF",
    "& p": {
      color: "#FFF",
    },
    "&.MuiListItem-button:hover": {
      backgroundColor: "#157AFF",
    },
  },
});

const StyledPrimaryText = styled(Typography)({
  fontSize: "14px",
  color: "#2C3644",
  fontWeight: 500,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  width: "100%",
  overflow: "hidden",
  lineHeight: "20px",
  marginTop: "3px",
  textTransform: "capitalize",
});

const StyledSecondaryText = styled(StyledPrimaryText)({
  fontSize: "11px",
  fontWeight: 400,
  paddingTop: "5px",
  lineHeight: "16px",
});

const FILegalPersonConfigurationItemList = ({ data, onSelect, itemId }) => {
  const { t } = useTranslation();

  const isSelected = (item) => {
    return Number(itemId) === item.id;
  };

  return (
    <StyledRoot display="flex" flexDirection="column">
      <Box flex={1}>
        <List component="nav" disablePadding>
          {data.map((item, i) => {
            return (
              <StyledListItemButton
                key={"reference-" + i}
                selected={isSelected(item)}
                dense
                onClick={() => {
                  onSelect(item.id);
                }}
              >
                <div key={item.fiPersonId}>
                  <Typography
                    style={{
                      color: isSelected(item)
                        ? "#F0F4FF"
                        : "rgba(104, 122, 158, 0.8)",
                      opacity: isSelected(item) ? 0.6 : 1,
                    }}
                  >
                    {t("legalPerson")} {t(item.residentStatus)}
                  </Typography>
                  <StyledPrimaryText>{item.name}</StyledPrimaryText>
                  <StyledSecondaryText>
                    {t("legalPersonId")} : {item.identificationNumber}
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

FILegalPersonConfigurationItemList.propTypes = {
  onSelect: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  itemId: PropTypes.any.isRequired,
};

export default FILegalPersonConfigurationItemList;
