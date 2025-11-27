import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import PasswordDetails from "./PasswordDetails";
import SettingsTextField from "../SettingsTextField";
import Tooltip from "../../common/Tooltip/Tooltip";
import Select from "../../common/Field/Select";
import { UserAuthTypeEnum } from "../../../types/common.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { Property } from "../../../types/settings.type";

interface SecurityPageProps {
  data: Property[];
  onChangeSecurity?(key: string, value: string): void;
}

interface SecurityChip {
  [key: string]: boolean;
}

interface PasswordSetting {
  [key: string]: string | number | undefined;
}

const StyledContainer = styled(Box)({
  boxSizing: "border-box",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "12px",
  overflowY: "auto",
  overflowX: "hidden",
  width: "100%",
});

const StyledHeader = styled(Typography)(({ theme }: { theme: any }) => ({
  fontWeight: 600,
  fontSize: 14,
  color: theme.palette.textColor,
  lineHeight: "21px",
  marginBottom: 8,
  paddingLeft: 4,
}));

const StyledButtonText = styled(Typography)({
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

const StyledChipContainer = styled(Box)<{ active: boolean }>(
  ({ theme, active }) => ({
    boxSizing: "border-box",
    padding: "4px 12px",
    borderRadius: 13,
    cursor: "pointer",
    maxWidth: "100%",
    color: active
      ? theme.palette.mode === "dark"
        ? "#344258"
        : "#F9FAFB"
      : theme.palette.mode === "dark"
      ? "#ABBACE"
      : "#344054",
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.mode === "dark"
      ? "inherit"
      : "#F9FAFB",
    margin: "4px",
    "&:hover": {
      backgroundColor: active
        ? theme.palette.secondary.main
        : theme.palette.mode === "light"
        ? "#EAEBF0"
        : "#344258",
      border: active && `1px solid ${theme.palette.secondary.main}`,
    },
    border: active
      ? `1px solid ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.mode === "dark" ? "#344258" : " #D0D5DD"}`,
  })
);

const SecurityPage: React.FC<SecurityPageProps> = ({
  data,
  onChangeSecurity,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [securityChips, setSecurityChips] = useState<SecurityChip>({
    "fina2.security.passwordValidityPeriod": false,
    "fina2.security.allowedAccountInactivityPerioed": true,
    "fina2.security.passwordWithLetters": false,
    "fina2.security.passwordWithNums": true,
    "fina2.security.passwordWithLettersUpperCase": false,
    "fina2.security.passwordWithSpecialCharacters": false,
  });

  const [passwordSettings, SetPasswordSettings] = useState<PasswordSetting>();
  const [tooltip, setTooltip] = useState(false);

  const isReadOnly = !hasPermission(PERMISSIONS.FINA_SECURITY_AMEND);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let obj: { [key: string]: string | number | undefined } = {};
    Object.entries(securityChips).forEach((item) => {
      obj[item[0]] = data.find((d) => d.key === item[0])?.value;
    });

    Object.entries(obj).forEach((item) => {
      switch (item[1]) {
        case "0":
          securityChips[item[0]] = false;
          break;
        case "-1":
          securityChips[item[0]] =
            item[0] === "fina2.security.passwordValidityPeriod";
          break;
        default:
          securityChips[item[0]] =
            item[0] !== "fina2.security.passwordValidityPeriod";
      }
    });
    SetPasswordSettings(obj);
  };

  const passwordDetailsButton = (name: string, fieldName: string) => {
    let active = securityChips[fieldName];

    return (
      <StyledChipContainer
        active={active}
        onClick={() => {
          setSecurityChips({
            ...securityChips,
            [fieldName]: !securityChips[fieldName],
          });
          SetPasswordSettings(
            passwordSettings
              ? {
                  ...passwordSettings,
                  [fieldName]: passwordSettings[fieldName],
                }
              : passwordSettings
          );
          settingChipsOnChange(fieldName, !securityChips[fieldName]);
        }}
        style={{
          pointerEvents: !isReadOnly ? "auto" : "none",
          opacity: !isReadOnly ? 1 : 0.8,
        }}
        data-testid={name + "-chip"}
      >
        <Tooltip title={tooltip ? t(name) : ""} arrow>
          <StyledButtonText
            onMouseEnter={(event) => onMouseEnterFunction(event)}
          >
            {t(name)}
          </StyledButtonText>
        </Tooltip>
      </StyledChipContainer>
    );
  };

  const onMouseEnterFunction = (event: any) => {
    setTooltip(event.target.scrollWidth > event.target.clientWidth);
  };

  const getValueByKey = (key: string) => {
    return data.find((d) => d.key === key)?.value;
  };

  const settingChipsOnChange = (key: string, value: boolean) => {
    switch (key) {
      case "fina2.security.passwordValidityPeriod":
        onChangeSecurity?.(key, value ? "-1" : "90");
        break;
      case "fina2.security.allowedAccountInactivityPerioed":
        onChangeSecurity?.(key, !value ? "-1" : "60");
        break;
      case "fina2.security.passwordWithLetters":
      case "fina2.security.passwordWithNums":
      case "fina2.security.passwordWithLettersUpperCase":
      case "fina2.security.passwordWithSpecialCharacters":
        onChangeSecurity?.(key, value ? "1" : "0");
        break;
      default:
        break;
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>{t("ldapParameters")}</StyledHeader>
      <Box display={"flex"}>
        <Grid item container xs={12}>
          <SettingsTextField
            name={"ldapUrlIp"}
            value={getValueByKey("fina2.authentication.ldap.urlIp")}
            fieldKey={"fina2.authentication.ldap.urlIp"}
            onChangeSecurity={onChangeSecurity}
            readOnly={isReadOnly}
          />
          <SettingsTextField
            name={"port"}
            value={getValueByKey("fina2.authentication.ldap.urlPort")}
            fieldKey={"fina2.authentication.ldap.urlPort"}
            onChangeSecurity={onChangeSecurity}
            fieldType={"number"}
            readOnly={isReadOnly}
          />
          <SettingsTextField
            name={"organizationUnit"}
            value={getValueByKey(
              "fina2.authentication.ldap.organizationalUnit"
            )}
            fieldKey={"fina2.authentication.ldap.organizationalUnit"}
            onChangeSecurity={onChangeSecurity}
            readOnly={isReadOnly}
          />
          <SettingsTextField
            name={"domainComponent"}
            value={getValueByKey("fina2.authentication.ldap.domainComponent")}
            fieldKey={"fina2.authentication.ldap.domainComponent"}
            onChangeSecurity={onChangeSecurity}
            readOnly={isReadOnly}
          />
        </Grid>
      </Box>

      <StyledHeader mt={"22px"}>{t("property")}</StyledHeader>
      <Box display={"flex"}>
        <Grid item container xs={12}>
          <SettingsTextField
            name={"protectionPassword"}
            value={getValueByKey("fina2.sheet.protection.password")}
            fieldKey={"fina2.sheet.protection.password"}
            onChangeSecurity={onChangeSecurity}
            readOnly={isReadOnly}
          />
          <SettingsTextField
            name={"matrixPath"}
            value={getValueByKey("fina2.dcs.matrix.path")}
            fieldKey={"fina2.dcs.matrix.path"}
            onChangeSecurity={onChangeSecurity}
            readOnly={isReadOnly}
          />
        </Grid>
      </Box>

      <StyledHeader mt={"22px"}>{t("security")}</StyledHeader>
      <Box display={"flex"}>
        <Grid item container xs={12}>
          <SettingsTextField
            name={"allowedNumberOfFailedLoginAttempts"}
            value={getValueByKey("fina2.security.allowedNumberLoginAttempt")}
            onChangeSecurity={onChangeSecurity}
            fieldKey={"fina2.security.allowedNumberLoginAttempt"}
            fieldType={"number"}
            readOnly={isReadOnly}
          />
          <SettingsTextField
            name={"passwordValidityPeriodsInDays"}
            value={getValueByKey("fina2.security.passwordValidityPeriod")}
            onChangeSecurity={onChangeSecurity}
            fieldKey={"fina2.security.passwordValidityPeriod"}
            readOnly={securityChips["fina2.security.passwordValidityPeriod"]}
            fieldType={"number"}
          />
          <SettingsTextField
            name={"allowedAccountInactivityPeriodInDays"}
            value={getValueByKey(
              "fina2.security.allowedAccountInactivityPerioed"
            )}
            onChangeSecurity={onChangeSecurity}
            fieldKey={"fina2.security.allowedAccountInactivityPerioed"}
            readOnly={
              !securityChips["fina2.security.allowedAccountInactivityPerioed"]
            }
            fieldType={"number"}
          />
          <SettingsTextField
            name={"numberOfStoredOldPasswords"}
            value={getValueByKey("fina2.security.numberOfStoredOldPasswords")}
            onChangeSecurity={onChangeSecurity}
            fieldKey={"fina2.security.numberOfStoredOldPasswords"}
            fieldType={"number"}
            readOnly={isReadOnly}
          />
          <SettingsTextField
            name={"passwordMinimalLength"}
            value={getValueByKey("fina2.security.passwordMinimalLen")}
            onChangeSecurity={onChangeSecurity}
            fieldKey={"fina2.security.passwordMinimalLen"}
            readOnly={isReadOnly}
          />
          <Grid item xl={4} md={6} sm={6} xs={12}>
            <Box sx={{ padding: "4px 2px", marginTop: "4px" }}>
              <Select
                autoFocus={false}
                data={[
                  {
                    label: UserAuthTypeEnum.FINA,
                    value: UserAuthTypeEnum.FINA,
                  },
                  {
                    label: UserAuthTypeEnum.LDAP,
                    value: UserAuthTypeEnum.LDAP,
                  },
                  {
                    label: UserAuthTypeEnum.MIXED,
                    value: UserAuthTypeEnum.MIXED,
                  },
                ]}
                value={getValueByKey("fina2.current.authentication")}
                onChange={(val) => {
                  onChangeSecurity?.("fina2.current.authentication", val);
                }}
                label={t("authorizationType")}
                readOnly={isReadOnly}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <PasswordDetails passwordDetailsButton={passwordDetailsButton} />
    </StyledContainer>
  );
};

export default SecurityPage;
