import { Box, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import ToolsList from "./ToolsList";
import PackageContainer from "../../containers/Tools/PackageContainer";
import MDTToXMLContainer from "../../containers/Tools/MDTToXMLContainer";
import ReleaseMdtContainer from "../../containers/Tools/ReleaseMDTContainer";
import ReturnToXMLContainer from "../../containers/Tools/ReturnToXML/ReturnToXMLContainer";
import FileDecryptionContainer from "../../containers/Tools/FileDecryption/FileDecryptionContainer";
import MailLogContainer from "../../containers/MailLog/MailLogContainer";
import AuditLogContainer from "../../containers/AuditLog/AuditLogContainer";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import React, { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FeedbackPage from "../Feedback/FeedbackPage";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";

interface MainProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const StyledMainLayout = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.mainLayout,
}));

const StyledContentContainer = styled(Grid)(({ theme }: { theme: any }) => ({
  ...theme.page,
}));

const StyledTitle = styled(Typography)(({ theme }: { theme: any }) => ({
  ...theme.pageTitle,
}));

const StyledContent = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.paperBackground,
}));

const StyledToolbar = styled(Box)<{ isMenuOpen: boolean }>(
  ({ theme, isMenuOpen }: { theme: any; isMenuOpen: boolean }) => ({
    ...(isMenuOpen
      ? {
          ...theme.pageToolbar,
          borderBottom: theme.palette.borderColor,
          justifyContent: "space-between",
          flexDirection: "row",
          backgroundColor: theme.palette.paperBackground,
        }
      : {
          padding: "8px",
        }),
  })
);

const StyledText = styled(Typography)({
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "150%",
  textTransform: "capitalize",
});

const StyledChild = styled(Grid)<{ hidden: boolean }>(
  ({ theme, hidden }: { theme: any; hidden: boolean }) => ({
    ...(!hidden
      ? {
          borderLeft: theme.palette.borderColor,
          flex: 10,
          visibility: "visible",
          minWidth: 0,
        }
      : {
          display: "none",
        }),
  })
);

const StyledIconButton = styled(IconButton)(({ theme }: { theme: any }) => ({
  color: theme.palette.primary.main,
  padding: "3px",
  "&:hover": {
    backgroundColor: theme.palette.buttons.secondary.hover,
  },
}));

const Main: React.FC<MainProps> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { t } = useTranslation();
  const isPageHidden = (pageName: string) => {
    return pageName !== activeTab;
  };
  const { hasPermission, config } = useConfig();

  return (
    <StyledMainLayout>
      <StyledContentContainer container spacing={0}>
        <Box>
          <StyledTitle>{t("tools")}</StyledTitle>
        </Box>
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          style={{ background: "#FFFFFF", borderRadius: "4px" }}
          flexDirection={"column"}
          minHeight={"0px"}
        >
          <StyledContent height={"100%"} width={"100%"} display={"flex"}>
            <Grid item xs={isMenuOpen ? 2 : 0} data-testid={"left-container"}>
              <StyledToolbar isMenuOpen={isMenuOpen} data-testid={"toolbar"}>
                {isMenuOpen && (
                  <StyledText height={"24px"}>{t(activeTab)}</StyledText>
                )}
                <StyledIconButton
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  data-testid={"menu-toggle-button"}
                >
                  {isMenuOpen ? (
                    <KeyboardArrowLeftIcon />
                  ) : (
                    <KeyboardArrowRightIcon />
                  )}
                </StyledIconButton>
              </StyledToolbar>
              <ToolsList
                isMenuOpen={isMenuOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Grid>

            {hasPermission(PERMISSIONS.RELEASE_MDT_REVIEW) && (
              <StyledChild
                hidden={isPageHidden("releaseMDT")}
                item
                data-testid={"release-mdt-container"}
              >
                <ReleaseMdtContainer />
              </StyledChild>
            )}

            {hasPermission(PERMISSIONS.MDT_TO_XML) && (
              <StyledChild
                item
                hidden={isPageHidden("mdtToXml")}
                data-testid={"mdt-to-xml-container"}
              >
                <MDTToXMLContainer />
              </StyledChild>
            )}

            {hasPermission(PERMISSIONS.RETURN_TO_XML) && (
              <StyledChild
                item
                hidden={isPageHidden("returnToXml")}
                data-testid={"return-to-xml-container"}
              >
                <ReturnToXMLContainer />
              </StyledChild>
            )}

            <StyledChild
              item
              hidden={isPageHidden("package")}
              data-testid={"package-container"}
            >
              <PackageContainer />
            </StyledChild>

            {hasPermission(PERMISSIONS.FINA_FILE_DECRYPTION) && (
              <StyledChild
                item
                hidden={isPageHidden("finaFileDecryption")}
                data-testid={"fina-file-decryption-container"}
              >
                <FileDecryptionContainer />
              </StyledChild>
            )}

            {hasPermission(PERMISSIONS.AUDIT_LOG_REVIEW) && (
              <StyledChild
                item
                overflow={"auto"}
                hidden={isPageHidden("auditLog")}
                data-testid={"audit-log-container"}
              >
                <AuditLogContainer config={config} />
              </StyledChild>
            )}

            {hasPermission(PERMISSIONS.MAIL_LOG_REVIEW) && (
              <StyledChild
                item
                hidden={isPageHidden("mailLog")}
                data-testid={"mail-log-container"}
              >
                <MailLogContainer />
              </StyledChild>
            )}

            {hasPermission(PERMISSIONS.FEEDBACK_REVIEW) && (
              <StyledChild
                item
                hidden={isPageHidden("feedback")}
                data-testid={"feedback-container"}
              >
                <FeedbackPage />
              </StyledChild>
            )}
          </StyledContent>
        </Box>
      </StyledContentContainer>
    </StyledMainLayout>
  );
};

export default Main;
