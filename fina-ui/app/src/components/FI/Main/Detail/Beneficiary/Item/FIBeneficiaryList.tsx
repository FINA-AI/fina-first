import { Box, ListItemText, Tooltip } from "@mui/material";
import List from "@mui/material/List";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import { BeneficiariesDataType } from "../../../../../../types/fi.type";

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  width: "100%",
  padding: "12px",
  borderBottom: theme.palette.borderColor,
  cursor: "pointer",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
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

const StyledIconContainer = styled(Box)({
  fontSize: "11px",
  display: "flex",
  color: "#9AA7BE",
  "& .MuiSvgIcon-root": {
    width: "15px",
    height: "15px",
  },
});

const StyledTextContainer = styled(Box)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: "2px 0",
});

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontSize: "13px",
    color: theme.palette.mode === "dark" ? "#F5F7FA" : "#2C3644",
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: 500,
  },
  "& .MuiListItemText-secondary": {
    fontSize: "11px",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#596D89",
    lineHeight: "16px",
    fontWeight: 400,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    paddingTop: 2,
  },
}));

interface FIBeneficiaryListProps {
  data: BeneficiariesDataType[];
  onSelect: (item: BeneficiariesDataType) => void;
  itemId?: string;
}

const FIBeneficiaryList: React.FC<FIBeneficiaryListProps> = ({
  data,
  onSelect,
  itemId,
}) => {
  const [hasTooltip, setHasTooltip] = useState(false);

  const onMouseEnterFunction = (
    event: React.MouseEvent<HTMLSpanElement | HTMLDivElement>
  ) => {
    setHasTooltip(
      event.currentTarget.scrollWidth > event.currentTarget.clientWidth
    );
  };

  const { t } = useTranslation();

  const getPrimaryTextWithTooltip = (item: BeneficiariesDataType) => {
    if (item) {
      let text = item.legalPerson
        ? item.legalPerson?.name
        : item.physicalPerson?.name;
      return (
        <span onMouseEnter={(event) => onMouseEnterFunction(event)}>
          <Tooltip title={hasTooltip ? text : ""} arrow>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <StyledIconContainer>
                {item.legalPerson ? (
                  <span>{t("legalPerson")}</span>
                ) : (
                  <span>{t("physicalperson")}</span>
                )}
              </StyledIconContainer>
              <StyledTextContainer>{text}</StyledTextContainer>
            </div>
          </Tooltip>
        </span>
      );
    }
  };

  const getSecondaryTextWithTooltip = (item: BeneficiariesDataType) => {
    let text = item.legalPerson
      ? item.legalPerson?.identificationNumber
      : item.physicalPerson?.identificationNumber;

    return (
      <span onMouseEnter={(event) => onMouseEnterFunction(event)}>
        <Tooltip title={hasTooltip ? text : ""} arrow>
          <span>
            {t("personId")} : {text}
          </span>
        </Tooltip>
      </span>
    );
  };

  const isSelected = (item: BeneficiariesDataType) => {
    return Number(itemId) === item.id;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ width: "100%", height: "100%", overflow: "auto" }}
      data-testid={"fi-beneficiary-list"}
    >
      <Box flex={1}>
        <List component="nav" disablePadding>
          {data.map((item, i) => {
            return (
              <StyledListItem
                key={"reference-" + i}
                autoFocus={Number(itemId) == item.id}
                dense
                value={"reference-" + i}
                selected={isSelected(item)}
                onClick={() => onSelect(item)}
                data-testid={"item-" + i}
              >
                <StyledListItemText
                  primary={getPrimaryTextWithTooltip(item)}
                  secondary={getSecondaryTextWithTooltip(item)}
                />
              </StyledListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default FIBeneficiaryList;
