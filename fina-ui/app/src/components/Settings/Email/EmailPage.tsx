import { Box } from "@mui/system";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "../../../components/common/Field/TextField";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { SelectionType } from "../../common/Field/Select";
import Tooltip from "../../common/Tooltip/Tooltip";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { Property } from "../../../types/settings.type";

interface EmailPageProps {
  onChange: (key: string, value?: any) => void;
  data: Property[];
}

interface MailConnectionProtocol {
  label: string;
  value: string;
}
const StyledRoot = styled(Box)({
  overflow: "auto",
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

const StyledItem = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledHeader = styled(Box)({
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "21px",
  marginTop: "8px",
  marginInline: "16px",
  paddingBottom: "8px",
});

const StyledMainBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  padding: "14px",
});

const StyledChipButtonBox = styled(Box)<{ active: boolean }>(
  ({ theme, active }) => ({
    boxSizing: "border-box",
    padding: "4px 12px",
    borderRadius: 20,
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

const StyledButtonText = styled(Typography)({
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

const EmailPage: React.FC<EmailPageProps> = ({ onChange, data }) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const mailConnectionProtocols: MailConnectionProtocol[] = [
    {
      label: "POP3/SMTP",
      value: "1",
    },
    {
      label: "IMAP/SMTP",
      value: "2",
    },
    {
      label: "OWA",
      value: "3",
    },
    {
      label: "EWS",
      value: "4",
    },
    {
      label: "Microsoft Graph",
      value: "5",
    },
  ];

  const [emailChips, SetEmailChips] = useState<{ [key: string]: boolean }>({
    "mail.imap.starttls.enable": false,
    "mail.imap.ssl.enable": false,
    "mail.pop3.ssl.enable": false,
    "mail.smtp.starttls.enable": false,
    "mail.smtp.ssl.enable": false,
    "fina2.mail.sendResponceEnable": true,
    "fina2.mail.responceUnknownUser": false,
  });
  const [tooltip, setTooltip] = useState(false);

  const onMouseEnterFunction = (event: any) => {
    setTooltip(event.target.scrollWidth > event.target.clientWidth);
  };

  const isReadOnly = !hasPermission(PERMISSIONS.FINA_SECURITY_AMEND);

  useEffect(() => {
    let obj: any = {};
    Object.entries(emailChips).forEach((item) => {
      obj[item[0]] = data.find((d) => d.key === item[0])?.value === "true";
    });
    SetEmailChips(obj);
  }, []);

  const getValueByKey = (key: string) => {
    return data.find((d) => d.key === key)?.value;
  };

  const getSelectedProtocol: () => MailConnectionProtocol = () => {
    const key = "fina2.mail.connectionType";
    const v = data.find((d) => d.key === key)?.value;
    if (v) {
      const item = mailConnectionProtocols.find((p) => p.value == v);
      return item ? item : mailConnectionProtocols[0];
    }
    return mailConnectionProtocols[0];
  };

  const [selectedProtocol, setSelectedProtocol] =
    useState<MailConnectionProtocol>(getSelectedProtocol());

  const chipButton = (name: string, fieldName: string) => {
    let active = emailChips[fieldName];
    return (
      <StyledChipButtonBox
        active={active}
        onClick={() => {
          SetEmailChips({
            ...emailChips,
            [fieldName]: !emailChips[fieldName],
          });
          onChange(fieldName, !emailChips[fieldName]);
        }}
        style={{
          pointerEvents: !isReadOnly ? "auto" : "none",
          opacity: !isReadOnly ? 1 : 0.8,
        }}
      >
        <Tooltip title={tooltip ? t(name) : ""} arrow>
          <StyledButtonText
            onMouseEnter={(event) => onMouseEnterFunction(event)}
          >
            {t(name)}
          </StyledButtonText>
        </Tooltip>
      </StyledChipButtonBox>
    );
  };

  const mailProtocolSelectionHandler = (selectedItem: SelectionType) => {
    onChange("fina2.mail.connectionType", selectedItem.value);
    const item = mailConnectionProtocols.find(
      (p) => (p.value = selectedItem.value as string)
    );
    if (item) {
      setSelectedProtocol(item);
    }
  };

  const isMicrosoftGraphProtocolSelected = () => {
    return selectedProtocol.value == "5";
  };

  const getMailUserTextFieldLabel = () => {
    return isMicrosoftGraphProtocolSelected() ? "Client Id" : t("email");
  };

  return (
    <StyledRoot>
      <StyledItem>
        <StyledHeader>{t("email")}</StyledHeader>

        <StyledMainBox>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 2 }}>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) => onChange("mail.user", val)}
                label={getMailUserTextFieldLabel()}
                value={getValueByKey("mail.user")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) => onChange("mail.password", val)}
                label={t("password")}
                type={"password"}
                value={getValueByKey("mail.password")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) => onChange("mail.address", val)}
                label={t("mailAddress")}
                value={getValueByKey("mail.address")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) =>
                  onChange("fina2.dcs.mail.check.interval", val)
                }
                label={t("checkInterval")}
                value={getValueByKey("fina2.dcs.mail.check.interval")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) =>
                  onChange("fina2.mail.blockCycledMail.size", val)
                }
                label={t("cycledMail")}
                value={getValueByKey("fina2.mail.blockCycledMail.size")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) =>
                  onChange("fina2.mail.last.read.date", val)
                }
                label={t("lastReadDate")}
                value={getValueByKey("fina2.mail.last.read.date")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) =>
                  onChange("fina2.mail.responceMailsCC", val)
                }
                label={t("mailResponse")}
                value={getValueByKey("fina2.mail.responceMailsCC")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size={"default"}
                onChange={(val: string) =>
                  onChange("fina2.mail.notReadMails", val)
                }
                label={t("rejectedMail")}
                value={getValueByKey("fina2.mail.notReadMails")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                size={"default"}
                label={t("mailConnectionType")}
                data={mailConnectionProtocols}
                onChange={(_val, item) => {
                  mailProtocolSelectionHandler(item);
                }}
                value={getValueByKey("fina2.mail.connectionType")}
                readOnly={isReadOnly}
              />
            </Grid>
            <Grid item xs={6} hidden={!isMicrosoftGraphProtocolSelected()}>
              <TextField
                size={"default"}
                onChange={(val: string) => onChange("fina2.mail.tenantId", val)}
                label={"Tenant Id"}
                value={getValueByKey("fina2.mail.tenantId")}
                readOnly={isReadOnly}
              />
            </Grid>

            <Divider />

            <Grid item xs={12}>
              <Box display={"flex"} flexWrap={"wrap"} gap={1}>
                {chipButton(
                  "sendResponseEnable",
                  "fina2.mail.sendResponceEnable"
                )}
                {chipButton(
                  "readUnknownEmails",
                  "fina2.mail.responceUnknownUser"
                )}
              </Box>
            </Grid>
          </Grid>
        </StyledMainBox>
      </StyledItem>
      <Box
        flexDirection={"column"}
        display={isMicrosoftGraphProtocolSelected() ? "none" : "flex"}
      >
        <StyledItem>
          <StyledHeader>{t("imap")}</StyledHeader>

          <Box margin={"12px"}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 3 }}>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) => onChange("mail.imap.host", val)}
                  label={t("imapHost")}
                  value={getValueByKey("mail.imap.host")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) => onChange("mail.imap.port", val)}
                  label={t("IMAP Port")}
                  value={getValueByKey("mail.imap.port")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) => onChange("mail.address", val)}
                  label={t("mailAddress")}
                  value={getValueByKey("mail.address")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) =>
                    onChange("fina2.dcs.mail.check.interval", val)
                  }
                  label={t("checkInterval")}
                  value={getValueByKey("fina2.dcs.mail.check.interval")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) =>
                    onChange("mail.smtp.connectiontimeout", val)
                  }
                  label={t("timeout")}
                  value={getValueByKey("mail.smtp.connectiontimeout")}
                  readOnly={isReadOnly}
                />
              </Grid>

              <Divider />

              <Grid item xs={12}>
                <Box display={"flex"} flexWrap={"wrap"} gap={1}>
                  {chipButton("tsl", "mail.imap.starttls.enable")}
                  {chipButton("ssl", "mail.imap.ssl.enable")}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledItem>
        <StyledItem>
          <StyledHeader>{t("pop3")}</StyledHeader>

          <Box margin={"12px"}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 3 }}>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) => onChange("mail.pop3.host", val)}
                  label={t("pop3Host")}
                  value={getValueByKey("mail.pop3.host")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) => onChange("mail.pop3.port", val)}
                  label={t("pop3Port")}
                  value={getValueByKey("mail.pop3.port")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) =>
                    onChange("mail.pop3.connectiontimeout", val)
                  }
                  label={t("timeout")}
                  value={getValueByKey("mail.pop3.connectiontimeout")}
                  readOnly={isReadOnly}
                />
              </Grid>

              <Divider />

              <Grid item xs={12}>
                <Box display={"flex"} flexWrap={"wrap"} gap={1}>
                  {chipButton("ssl", "mail.pop3.ssl.enable")}{" "}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledItem>
        <StyledItem>
          <StyledHeader>{t("smtp")}</StyledHeader>

          <Box margin={"12px"}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 3 }}>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) => onChange("mail.smtp.host", val)}
                  label={t("smtpHost")}
                  value={getValueByKey("mail.smtp.host")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) => onChange("mail.smtp.port", val)}
                  label={t("smtpPort")}
                  value={getValueByKey("mail.smtp.port")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) =>
                    onChange("mail.smtp.connectiontimeout", val)
                  }
                  label={t("timeout")}
                  value={getValueByKey("mail.smtp.connectiontimeout")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) =>
                    onChange("fina2.dcs.mail.check.interval", val)
                  }
                  label={t("checkInterval")}
                  value={getValueByKey("fina2.dcs.mail.check.interval")}
                  readOnly={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size={"default"}
                  onChange={(val: string) =>
                    onChange("mail.smtp.connectiontimeout", val)
                  }
                  label={t("timeout")}
                  value={getValueByKey("mail.smtp.connectiontimeout")}
                  readOnly={isReadOnly}
                />
              </Grid>

              <Divider />

              <Grid item xs={12}>
                <Box display={"flex"} flexWrap={"wrap"} gap={1}>
                  {chipButton("tsl", "mail.smtp.starttls.enable")}
                  {chipButton("ssl", "mail.smtp.ssl.enable")}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledItem>
      </Box>
    </StyledRoot>
  );
};

export default EmailPage;
