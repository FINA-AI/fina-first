import { ListItemText, MenuItem, MenuProps, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getLanguage } from "../../util/appUtil";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { styled, useTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import { LanguageType } from "../../types/common.type";

interface LanguageSelectProps {
  languages: Array<LanguageType>;
  onOpen: () => void;
  onClose: () => void;
  menuPosition: string;
}

const StyledSelect = styled(Select)(({ theme }) => ({
  height: "30px",
  width: "100%",
  border: 0,
  "& .MuiSelect-select": {
    paddingLeft: "10px",
    paddingTop: "0px",
    paddingBottom: "0px",
    [theme.breakpoints.between(900, 1300)]: {
      paddingLeft: "18px",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none !important",
  },
  "&.MuiListItem-root .MuiListItem-root": {
    paddingLeft: "4px",
    fontSize: "0.75rem",
  },
  "& svg": {
    fill: "#ffffff",
    width: 16,
    [theme.breakpoints.between(900, 1300)]: {
      width: 14,
    },
  },
}));

const StyledImg = styled("img")(({ theme }) => ({
  fill: "#ffffff",
  width: 16,
  [theme.breakpoints.between(900, 1300)]: {
    width: 14,
  },
}));

const StyledLabel = styled("span")(({ theme }) => ({
  [theme.breakpoints.between(900, 1300)]: {
    fontSize: "0.75rem",
  },
}));

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  languages,
  onOpen,
  onClose,
  menuPosition,
}) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<LanguageType>();

  useEffect(() => {
    const loc = getLanguage();
    setLocale(languages.find((d) => d.code === loc));
  }, [languages]);

  const getMenuProps = () => {
    const menuProps = {
      style: { zIndex: theme.zIndex.modal + 2 },
      anchorOrigin: {},
      transformOrigin: {},
    };

    if (menuPosition === "right") {
      menuProps.anchorOrigin = {
        vertical: "center",
        horizontal: "right",
      };
      menuProps.transformOrigin = {
        vertical: "top",
        horizontal: "left",
      };
    }

    return menuProps;
  };
  const handleLocaleChange = (event: any) => {
    const selectedLang = languages.find((l) => l.code === event.target.value);
    setLocale(selectedLang);
    i18n.changeLanguage(selectedLang?.code);
  };

  const getIcon = (code = "en_US") => {
    let flagSrc = code.split("_")[0].toUpperCase();
    if (!flagSrc) {
      flagSrc = "EN";
    }
    return (
      <StyledImg
        src={process.env.PUBLIC_URL + `/images/flags/${flagSrc}.png`}
        alt="fina-logo"
      />
    );
  };
  if (!locale) {
    return <></>;
  }

  return (
    locale && (
      <StyledSelect
        name={"language-select"}
        onOpen={onOpen}
        onClose={onClose}
        value={locale.code}
        onChange={handleLocaleChange}
        MenuProps={getMenuProps() as MenuProps}
        renderValue={() => {
          return (
            <Box
              sx={{
                display: "flex",
                gap: 5,
                color: "white",
                fontWeight: 400,
                fontSize: 12,
                alignContent: "center",
                [theme.breakpoints.between(900, 1300)]: {
                  gap: 3,
                },
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignContent: "center",
                  flexWrap: "wrap",
                  backgroundColor: "inherit",
                }}
              >
                {getIcon(locale.code)}
              </span>
              <StyledLabel>{locale.name}</StyledLabel>
            </Box>
          );
        }}
      >
        {languages.map((d, i) => (
          <MenuItem
            key={i}
            value={d.code}
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <ListItemIcon>{getIcon(d.code)}</ListItemIcon>
            <ListItemText primary={d.name} />
          </MenuItem>
        ))}
      </StyledSelect>
    )
  );
};
const languageReducer = "language";
const mapStateToProps = (state: any) => ({
  languages: state.getIn([languageReducer, "languages"]),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);
