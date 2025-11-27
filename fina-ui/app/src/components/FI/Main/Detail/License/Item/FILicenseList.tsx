import React from "react";
import { Box, List, ListItem, Tooltip } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useTranslation } from "react-i18next";
import useConfig from "../../../../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../../../../util/appUtil";
import { LicensesDataType } from "../../../../../../types/fi.type";

const StyledRoot = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "auto",
  overflowX: "hidden",
});

const StyledStatusBox = styled(Box)({
  "& .MuiBox-root": {
    height: "17px !important",
  },
  "& .MuiSvgIcon-root": {
    width: "13px",
    height: "13px",
  },
});

const StyledStatusText = styled(Box)({
  color: "#98A7BC",
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
});

const StyledLicenseName = styled(Box)({
  color: "#2C3644",
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "20px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginTop: "4px",
});

const StyledLicenseNumber = styled(Box)({
  lineHeight: "16px",
  fontWeight: 400,
  fontSize: "11px",
  paddingTop: "4px",
});

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  width: "100%",
  padding: "12px",
  display: "block !important",
  borderBottom: theme.palette.borderColor,
  cursor: "pointer",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    backgroundColor: `${theme.palette.primary.main} !important`,
    "& p": {
      color: theme.palette.mode === "dark" ? "#3C4D68 !important" : "#FFF",
    },
    "& div": {
      color: theme.palette.mode === "dark" ? "#3C4D68 !important" : "#FFF",
    },
    "&.MuiListItem-button:hover": {
      backgroundColor: `${theme.palette.buttons.primary.hover} !important`,
    },
  },
}));

const StyledStatusIndicator = styled(FiberManualRecordIcon, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  color: active
    ? theme.palette.mode === "light"
      ? "#289E20"
      : "#067647"
    : theme.palette.mode === "light"
    ? "#FF4128"
    : "#912018",
}));

interface FILicenseListProps {
  data: LicensesDataType[];
  onSelect: (license: LicensesDataType) => void;
  itemId: string;
}

const FILicenseList: React.FC<FILicenseListProps> = ({
  data,
  onSelect,
  itemId,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const theme = useTheme();

  const getListItem = (item: LicensesDataType) => {
    return (
      <div>
        <StyledStatusBox display="flex" width="100%">
          <StyledStatusText display="flex" alignItems="center">
            <StyledStatusIndicator
              active={item.licenceStatus === "ACTIVE"}
              fontSize="inherit"
              style={{ marginRight: "4px" }}
            />
          </StyledStatusText>
          <Box fontSize={11}>
            {item.licenceStatus === "ACTIVE" ? t("active") : t("inactive")}
          </Box>
        </StyledStatusBox>
        <Tooltip title={item.licenseType?.name || ""}>
          <StyledLicenseName
            style={{
              color:
                Number(itemId) === item.id
                  ? "#FFFFFF"
                  : theme.palette.mode === "dark"
                  ? "#FFFFFF"
                  : "#2C3644",
            }}
          >
            {item.licenseType?.name}
          </StyledLicenseName>
        </Tooltip>
        <StyledLicenseNumber>
          <span
            style={{
              color:
                Number(itemId) === item.id
                  ? theme.palette.mode === "dark"
                    ? "#194185"
                    : "#E8EEFF"
                  : theme.palette.mode === "dark"
                  ? "#ABBACE"
                  : "#596D89",
            }}
          >
            {`LN: ${item.code} | ${getFormattedDateValue(
              item.creationDate,
              getDateFormat(true)
            )}`}
          </span>
        </StyledLicenseNumber>
      </div>
    );
  };

  return (
    <StyledRoot
      display="flex"
      flexDirection="column"
      data-testid={"fi-license-list"}
    >
      <Box flex={1}>
        <List component="nav" disablePadding>
          {data.map((item, i) => (
            <StyledListItem
              key={`reference-${i}`}
              autoFocus={Number(itemId) === item.id}
              dense
              value={`reference-${i}`}
              selected={Number(itemId) === item.id}
              onClick={() => onSelect(item)}
              data-testid={"item-" + i}
            >
              {getListItem(item)}
            </StyledListItem>
          ))}
        </List>
      </Box>
    </StyledRoot>
  );
};

export default FILicenseList;
