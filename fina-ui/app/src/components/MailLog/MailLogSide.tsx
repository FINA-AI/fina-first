import { Box } from "@mui/system";
import { IconButton, Slide, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  attachmentType,
  MailDataType,
  MailLogDataType,
} from "../../types/mailLog.type";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const StyledRoot = styled(Paper)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  opacity: 1,
  borderTop: theme.palette.borderColor,
  height: "100%",
  width: "700px",
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: theme.zIndex.modal,
  borderLeft: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  borderRadius: 0,
}));

export const StyledContent = styled(Box)(({ theme }: any) => ({
  width: "100%",
  height: "100%",
  borderBottom: theme.palette.borderColor,
  display: "flex",
  flexDirection: "column",
  marginTop: "12px",
}));

export const StyledCloseIcon = styled(DoubleArrowIcon)(() => ({
  color: "#C2CAD8",
  fontSize: 16,
}));

export const StyledTextContainer = styled(Typography)(() => ({
  padding: "0px 12px 8px 12px",
}));

export const StyledMainText = styled("span")(() => ({
  color: "#98A7BC",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

export const StyledSecondaryText = styled("span")(({ theme }: any) => ({
  color: theme.palette.mode === "dark" ? "#e5e7e8" : "#4F5863",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

export const StyledContentText = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "20px",
  marginBottom: "8px",
}));

export const StyledAttachedFiles = styled(Typography)(() => ({
  color: "#98A7BC",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
}));

export const StyledAttachmentBox = styled(Box)(({ theme }: any) => ({
  background: "#FFFFFF",
  color: "#2962FF",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  display: "flex",
  alignItems: "center",
  padding: "8px",
  borderRadius: "2px",
  marginBottom: "4px",
  "& .MuiSvgIcon-root": {
    marginRight: "8px",
    color: "#2962FF",
    ...theme.smallIcon,
  },
}));

export const StyledAttachmentName = styled("span")(() => ({
  textDecoration: "underline",
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  cursor: "pointer",
}));

export const StyledContentBox = styled(Box)(({ theme }: any) => ({
  padding: "12px",
  background: theme.palette.mode === "dark" ? "#26313f" : "#F0F4FF",
  overflow: "auto",
}));

interface MailLogSideProps {
  getReply: (
    messageId: number,
    isRobotMail: boolean
  ) => Promise<{ data: MailLogDataType | {}; attachments: attachmentType[] }>;
  downloadFile: (fileId: number) => void;
  sideMenu: { open: boolean; row: MailLogDataType | null };
  setSideMenu: (val: { open: boolean; row: MailLogDataType | null }) => void;
}
const MailLogSide: React.FC<MailLogSideProps> = ({
  sideMenu,
  setSideMenu,
  downloadFile,
  getReply,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<MailDataType>();
  const [attachments, setAttachments] = useState<attachmentType[]>([]);

  const getData = async () => {
    if (sideMenu.row) {
      let obj = await getReply(
        sideMenu.row.id,
        sideMenu.row.mailType === "MAIL_ROBOT"
      );
      setData(obj.data as MailDataType);
      setAttachments(obj.attachments);
    }
  };

  useEffect(() => {
    if (sideMenu.open) {
      getData();
    }
  }, [sideMenu]);

  return (
    <Slide direction="left" in={sideMenu.open} timeout={600}>
      <StyledRoot elevation={1} data-testid={"mail-log-side-menu"}>
        {sideMenu.open && data && (
          <StyledContent>
            <StyledTextContainer
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Box>
                <StyledMainText>{t("from")}: </StyledMainText>
                <StyledSecondaryText data-testid={"from"}>
                  {data.from}
                </StyledSecondaryText>
              </Box>
              <IconButton
                onClick={() => setSideMenu({ open: false, row: null })}
                style={{ padding: "0px" }}
                data-testid={"close-button"}
              >
                <StyledCloseIcon />
              </IconButton>
            </StyledTextContainer>
            <StyledTextContainer>
              <StyledMainText>{t("sender")}: </StyledMainText>
              <StyledSecondaryText data-testid={"sender"}>
                {data.sender}
              </StyledSecondaryText>
            </StyledTextContainer>
            <StyledTextContainer>
              <StyledMainText>{t("to")}: </StyledMainText>
              <StyledSecondaryText data-testid={"to"}>
                {data.to}
              </StyledSecondaryText>
            </StyledTextContainer>
            <StyledTextContainer>
              <StyledMainText>{t("cc")}: </StyledMainText>
              <StyledSecondaryText data-testid={"cc"}>
                {data.cc}
              </StyledSecondaryText>
            </StyledTextContainer>
            <StyledTextContainer>
              <StyledMainText>{t("bcc")}: </StyledMainText>
              <StyledSecondaryText data-testid={"bcc"}>
                {data.bcc}
              </StyledSecondaryText>
            </StyledTextContainer>
            <StyledTextContainer>
              <StyledMainText>{t("subject")}: </StyledMainText>
              <StyledSecondaryText data-testid={"subject"}>
                {data.subject}
              </StyledSecondaryText>
            </StyledTextContainer>
            <StyledContentBox>
              <StyledContentText
                data-testid={"content"}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
              {attachments.length !== 0 && (
                <Box
                  padding={"8px 0px"}
                  borderTop={"1px solid #EAEBF0"}
                  data-testid={"attachments-container"}
                >
                  <StyledAttachedFiles>
                    {t("attachedFiles")}
                  </StyledAttachedFiles>
                  {attachments.map((attachment, index) => {
                    return (
                      <StyledAttachmentBox
                        key={index}
                        data-testid={"item-" + index}
                      >
                        <InsertDriveFileIcon />
                        <StyledAttachmentName
                          onClick={() => downloadFile(attachment.id)}
                          data-testid={"name"}
                        >
                          {attachment.fileName}
                        </StyledAttachmentName>
                      </StyledAttachmentBox>
                    );
                  })}
                </Box>
              )}
            </StyledContentBox>
          </StyledContent>
        )}
      </StyledRoot>
    </Slide>
  );
};

export default MailLogSide;
