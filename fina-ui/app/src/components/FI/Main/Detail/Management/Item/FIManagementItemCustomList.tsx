import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { styled, useTheme } from "@mui/material/styles";
import React from "react";
import { ManagementDataType } from "../../../../../../types/fi.type";

const StyledRoot = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
});

const StyledHeaderText = styled(Typography)(({ theme }: any) => ({
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "20px",
  color: theme.palette.textColor,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

const StyledSecondaryText = styled(Typography)(({ theme }) => ({
  fontSize: "11px",
  color: theme.palette.mode === "light" ? "#596D89" : "#FFFFFF",
  fontWeight: 400,
  lineHeight: "16px",
  paddingTop: "4px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  width: "100%",
  height: "72px",
  padding: "12px",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  cursor: "pointer",
  borderBottom: theme.palette.borderColor,
  "&.Mui-selected": {
    color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    backgroundColor: `${theme.palette.primary.main} !important`,
    "& span": {
      color: theme.palette.mode === "dark" ? "#194185 !important" : "#FFF",
    },
    "& div": {
      color: theme.palette.mode === "dark" ? "#3C4D68 !important" : "#FFF",
    },
    "&.MuiListItem-button:hover": {
      backgroundColor: `${theme.palette.buttons.primary.hover} !important`,
    },
  },
}));

interface FIManagementItemCustomListProps {
  data: ManagementDataType[];
  onSelect: (item: ManagementDataType) => void;
  itemId: string;
}

const FIManagementItemCustomList: React.FC<FIManagementItemCustomListProps> = ({
  data,
  onSelect,
  itemId,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const isSelected = (item: ManagementDataType) => {
    return Number(itemId) === item.id;
  };

  const getFullName = (managementItem: ManagementDataType) => {
    if (managementItem.person) {
      return managementItem.person.name;
    }
  };

  const getPassportNumner = (item: ManagementDataType) => {
    if (item.person) {
      return (
        <span>{` | ${t("fiPassport")} : ${item.person.passportNumber}`}</span>
      );
    }
  };

  return (
    <StyledRoot display="flex" flexDirection="column">
      <Box flex={1}>
        <List component="nav" disablePadding>
          {data.map((item, i) => {
            return (
              <StyledListItem
                key={"reference-" + i}
                autoFocus={isSelected(item)}
                dense
                value={"reference-" + i}
                selected={isSelected(item)}
                onClick={() => onSelect(item)}
              >
                <div key={i}>
                  <StyledHeaderText
                    style={{
                      color:
                        Number(itemId) == item.id
                          ? theme.palette.mode === "dark"
                            ? "#194185"
                            : "#E8EEFF"
                          : theme.palette.mode === "dark"
                          ? "#F5F7FA"
                          : "#2C3644",
                    }}
                  >
                    {getFullName(item)}
                  </StyledHeaderText>
                  <StyledSecondaryText>
                    <span>
                      {t("personId")} : {item.person?.identificationNumber}
                    </span>

                    {getPassportNumner(item)}
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

FIManagementItemCustomList.propTypes = {
  onSelect: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  itemId: PropTypes.any.isRequired,
};

export default FIManagementItemCustomList;
