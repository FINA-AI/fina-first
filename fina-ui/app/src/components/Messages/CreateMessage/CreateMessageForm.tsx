import { Box, Chip, Typography } from "@mui/material";
import CloseBtn from "../../common/Button/CloseBtn";
import Wizard from "../../Wizard/Wizard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SendIcon from "@mui/icons-material/Send";
import MessageModalEditor from "./MessageModalEditor";
import { useDropzone } from "react-dropzone";
import FileAttachmentBox from "../Chat/FileAttachmentBox";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import GhostBtn from "../../common/Button/GhostBtn";
import SubmitBtn from "../../common/Button/SubmitBtn";
import UserAndGroupVirtualized from "../../UserManagement/UserAndGroupVirtualized";
import TextField from "../../common/Field/TextField";
import { MessageStatus } from "../messageStatus";
import { NotificationStatus } from "../../Notifications/notificationStatus";
import { loadMessageAttachments } from "../../../api/services/messagesService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { loadNotificationAttachments } from "../../../api/services/notificationService";
import { BASE_REST_URL, MAX_ALLOWED_FILE_SIZE } from "../../../util/appUtil";
import { PERMISSIONS } from "../../../api/permissions";
import useConfig from "../../../hoc/config/useConfig";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import htmlToDraft from "html-to-draftjs";
import SimpleLoadMask from "../../common/SimpleLoadMask";
import {
  CommAttachmentType,
  CommRootCreateModalData,
  CommSelectedRoot,
} from "../../../types/communicator.common.type";
import { UserAndGroup, UserType } from "../../../types/user.type";

interface CreateMessageFormProps {
  onSend: (formData: FormData) => void;
  close: () => void;
  selectedItem: CommSelectedRoot;
  isNotification: boolean;
  recipients: number[];
  loading: boolean;
}

const commonStyles = (theme: any) => ({
  color: theme.palette.textColor,
  cursor: "pointer",
  fontSize: 12,
});

const StyledBookMarkIcon = styled(BookmarkBorderIcon)(({ theme }) => ({
  ...commonStyles(theme),
}));

const StyledBookMarkText = styled(Typography)(({ theme }) => ({
  ...commonStyles(theme),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  padding: "8px 0px",
  fontSize: "12px",
  fontWeight: "500",
  lineHeight: "16px",
  "&.active": {
    color: theme.palette.mode === "dark" ? "#344258" : "#F9FAFB",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
  },
}));

const StyledRoot = styled(Box)(({ theme }) => ({
  width: 700,
  borderRadius: 8,
  [theme.breakpoints.down("lg")]: {
    paddingBottom: 0,
  },
}));

const StyledMessageWrapper = styled("fieldset")(({ theme }) => ({
  border: (theme as any).palette.borderColor,
  padding: "8px 16px",
  display: "flex",
  flexDirection: "column",
  borderRadius: 4,
  margin: "0px",
  height: "194px",
}));

const StyledWizardContent = styled(Box)(({ theme }) => ({
  minHeight: "260px",
  maxHeight: 530,
  overflowY: "auto",
  ...(theme as any).ModalBody,
  padding: "6px 16px 8px 16px !important",
}));

const StyledWizardWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  "& .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.mode === "dark" ? "#495F80" : "rgb(154, 167, 190)",
  },
}));

const StyledUploadContainer = styled(Box)(({ theme }) => ({
  height: "108px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  padding: 10,
  background: theme.palette.mode === "light" ? "rgba(240, 244, 255, 0.5)" : "",
  border: `1px dashed ${theme.palette.secondary.main}`,
}));

const StyledInfoWizardContent = styled(Box)({
  minHeight: "260px",
  maxHeight: 530,
  overflowY: "auto",
  padding: 0,
});

const StyledUploadBox = styled(Box)({
  padding: "8px 0px",
  marginTop: "16px",
  paddingTop: 0,
});

const StyledWizardCloseBtnBox = styled(Box)({
  position: "absolute",
  zIndex: 2,
  top: 15,
  right: 15,
  padding: "8px",
});

const StyledUploadText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#5D789A" : "",
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "16px",
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  padding: 6,
}));

const StyledBrowseButtonBox = styled(Typography)({
  display: "flex",
  justifyContent: "center",
  width: 156,
  margin: 4,
});

const StyledFooter = styled(Box)(({ theme }) => ({
  float: "right",
  padding: "8px 12px",
  borderTop: (theme as any).palette.borderColor,
  zIndex: 1,
  boxShadow: "0px -2px 12px rgba(53, 47, 47, 0.08)",
}));

const StyledSelected = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: 13,
}));

const StyledMessageTitle = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === "dark"
      ? "#ABBACE"
      : (theme as any).palette.textColor,
  fontWeight: 500,
  fontSize: "12px",
}));

const StyledBackBtnBox = styled(Typography)({
  marginRight: "10px",
  "& .MuiButton-root": {
    height: "32px",
    paddingTop: "8px",
    paddingBottom: "8px",
  },
});

const CreateMessageForm: React.FC<CreateMessageFormProps> = ({
  close,
  onSend,
  selectedItem,
  isNotification,
  recipients = [],
  loading,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = useConfig();

  const [selectedPermittedUsers, setSelectedPermittedUsers] = useState<
    UserType[]
  >([]);
  const [files, setFiles] = useState<CommAttachmentType[]>([]);
  const [signDocument, setSignDocument] = useState(false);

  const [data, setData] = useState<CommRootCreateModalData>(
    {} as CommRootCreateModalData
  );

  const isDisabled = () => {
    return (
      selectedItem?.status.includes("OUTBOX") ||
      selectedItem?.status.includes("INBOX")
    );
  };
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: isDisabled(),
    noKeyboard: true,
    accept: [
      ".pdf",
      ".zip",
      ".xls",
      ".xlsx",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".txt",
      ".xlsm",
    ],
  });

  useEffect(() => {
    if (recipients.length > 0) {
      setSelectedPermittedUsers(
        recipients.map((userId) => ({ id: userId } as UserType))
      );
    } else {
      setSelectedPermittedUsers([]);
    }
  }, [recipients]);

  useEffect(() => {
    if (selectedItem) {
      const html = selectedItem.content || "";
      const contentBlock = htmlToDraft(html);

      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap
        );
        setData({
          ...selectedItem,
          content: EditorState.createWithContent(contentState),
        });
      }

      setFiles(selectedItem.attachments ? [...selectedItem.attachments] : []);
      getAttachments();
    }
  }, [selectedItem]);

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      let res = [];
      if (files) {
        res = [...files, ...acceptedFiles];
      } else {
        res = [...acceptedFiles];
      }
      const ids = res.map((o) => o.name);
      const filtered = res.filter(
        ({ name }, index) => !ids.includes(name, index + 1)
      );
      setFiles(filtered);
    }
  }, [acceptedFiles]);

  const getAttachments = () => {
    if (!isNotification && selectedItem) {
      loadMessageAttachments(selectedItem.id)
        .then((res) => {
          setFiles([...res.data]);
        })
        .catch((err) => openErrorWindow(err, t("error"), true));
    } else if (selectedItem) {
      loadNotificationAttachments(selectedItem.id)
        .then((res) => {
          setFiles([...res.data]);
        })
        .catch((err) => openErrorWindow(err, t("error"), true));
    }
  };

  const removeAttachment = (index: number) => {
    setFiles([...files.filter((f, i: number) => i !== index)]);
  };

  const getMessageData = (status: string | null) => {
    const hasValidTitle = data?.title?.length;
    const hasValidContent =
      data?.content &&
      convertToRaw(data.content.getCurrentContent()).blocks.some(
        (el: any) => el.text.trim() !== ""
      );

    if (!hasValidTitle || !hasValidContent) {
      enqueueSnackbar(t("titleandcontentrequired"), {
        variant: "warning",
      });
      return;
    }

    let blocks = convertToRaw(data.content.getCurrentContent()).blocks.filter(
      (el: any) => el.text.trim() !== ""
    );
    let result = {
      blocks: blocks,
      entityMap: convertToRaw(data.content.getCurrentContent()).entityMap,
    };

    let requestObject = {
      id: data?.id,
      sign: signDocument,
      content: draftToHtml(result),
      title: data.title,
      userIds:
        selectedPermittedUsers.length === 0
          ? null
          : selectedPermittedUsers.map((user) => {
              return user.id;
            }),
      status: status,
      attachments: files
        .filter((file) => file && file?.id && file?.id > 0)
        .filter((f) => !(f.size > MAX_ALLOWED_FILE_SIZE)),
    };

    let formData = new FormData();
    formData.append(
      "message",
      new Blob([JSON.stringify(requestObject)], {
        type: "application/json",
      })
    );
    if (files) {
      const newFiles = files
        .filter((file) => file && !file.id)
        .filter((f) => !(f.size > MAX_ALLOWED_FILE_SIZE));

      for (let i = 0; i < newFiles.length; i++) {
        formData.append(`attachment_${i}`, newFiles[i], newFiles[i].name);
        formData.append(`fileName_${i}`, newFiles[i].name);
      }
    }
    return formData;
  };

  const onSendFunction = () => {
    const status = isNotification
      ? NotificationStatus.PUBLISHED
      : MessageStatus.OUTBOX;
    let data = getMessageData(status);
    data && onSend(data);
  };

  const onSaveFunction = () => {
    let status = null;
    if (selectedItem && selectedItem?.id > 0) {
      status = selectedItem.status;
    }

    let data = getMessageData(status);
    data && onSend(data);
  };

  const checkAcceptPermission = () => {
    if (isNotification) {
      return hasPermission(PERMISSIONS.FINA_NOTIFICATIONS_ACCEPT);
    } else {
      return hasPermission(PERMISSIONS.COMMUNICATOR_MESSAGES_ACCEPT);
    }
  };
  const getSubmissionFooter = (handleBack: VoidFunction) => {
    return (
      <StyledFooter display={"flex"} justifyContent={"space-between"}>
        {getSteps().length > 1 ? (
          <Box display={"flex"}>
            {checkAcceptPermission() && (
              <PrimaryBtn
                onClick={onSaveFunction}
                backgroundColor={"#FFFFFF"}
                border={"1px solid #EAEBF0"}
                endIcon={<StyledBookMarkIcon />}
              >
                <StyledBookMarkText>{t("save")}</StyledBookMarkText>
              </PrimaryBtn>
            )}
            &#160;&#160;
            <StyledSelected>
              {`${selectedPermittedUsers.length} ${t("selected")}`}
            </StyledSelected>
          </Box>
        ) : (
          <div />
        )}
        <Box display={"flex"}>
          {getSteps().length > 1 && (
            <StyledBackBtnBox>
              <GhostBtn onClick={handleBack}>{t("back")}</GhostBtn>
            </StyledBackBtnBox>
          )}

          {getSteps().length > 1 && checkAcceptPermission() ? (
            <SubmitBtn
              onClick={onSendFunction}
              style={{ marginLeft: "0px" }}
              endIcon={
                <SendIcon
                  sx={{ color: "#FFFFFF", cursor: "pointer", fontSize: 12 }}
                />
              }
            >
              {t("send")}
            </SubmitBtn>
          ) : (
            <PrimaryBtn
              onClick={onSaveFunction}
              backgroundColor={"#FFFFFF"}
              border={"1px solid #EAEBF0"}
              endIcon={<StyledBookMarkIcon />}
            >
              <StyledBookMarkText>{t("save")}</StyledBookMarkText>
            </PrimaryBtn>
          )}
        </Box>
      </StyledFooter>
    );
  };

  const getSteps = () => {
    if (
      selectedItem?.id &&
      selectedItem.status !== MessageStatus.CREATED &&
      selectedItem.status !== MessageStatus.REJECTED &&
      selectedItem.status !== MessageStatus.PENDING
    ) {
      return [t("generalInfo")];
    }
    return [t("generalInfo"), t("headerRow")];
  };

  const onAttachmentDownload = (fileId: number) => {
    window.open(
      BASE_REST_URL + `/communicator/messages/conversation/download/${fileId}`,
      "_blank"
    );
  };

  return (
    <StyledRoot display={"flex"} flexDirection={"column"}>
      {loading && <SimpleLoadMask loading={true} color={"primary"} />}
      <StyledWizardWrapper>
        <StyledWizardCloseBtnBox>
          <CloseBtn onClick={close} size={"default"} />
        </StyledWizardCloseBtnBox>
        <Wizard
          steps={getSteps()}
          onSubmit={onSend}
          hideHeader={true}
          onCancel={close}
          submissionFooter={getSubmissionFooter}
          cancelBtn={true}
        >
          <StyledWizardContent key={0}>
            <Box sx={{ padding: "8px 0px" }}>
              <TextField
                label={t("title")}
                value={data?.title}
                onChange={(val: string) => {
                  data.title = val;
                }}
              />
            </Box>

            <StyledMessageWrapper>
              <legend>
                <StyledMessageTitle>{t("message")}</StyledMessageTitle>
              </legend>

              <MessageModalEditor data={data} />
            </StyledMessageWrapper>
            <StyledUploadBox>
              <StyledUploadContainer
                {...getRootProps()}
                height={files && `${files.length === 0 ? 128 : 56}px`}
              >
                <input {...getInputProps()} />
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  width={"fit-content"}
                  flexDirection={"column"}
                >
                  <Box display={"flex"} justifyContent={"center"}>
                    <StyledUploadText>
                      {`${t("dropToUpload")} ${t("or")}`}
                      {files && files.length !== 0 && t("or")}
                    </StyledUploadText>
                  </Box>
                  <Box display={"flex"} justifyContent={"center"}>
                    <StyledBrowseButtonBox>
                      <PrimaryBtn
                        onClick={open}
                        disabled={isDisabled()}
                        startIcon={<AddIcon />}
                        children={t("browseFiles")}
                      />
                    </StyledBrowseButtonBox>
                  </Box>
                </Box>
              </StyledUploadContainer>
            </StyledUploadBox>
            {files && files.length > 0 && (
              <Box overflow={"auto"} paddingTop={"2px"}>
                <FileAttachmentBox
                  hideCloseIcon={isDisabled()}
                  files={files}
                  open={true}
                  remove={removeAttachment}
                  onFileDownload={(id) => onAttachmentDownload(id)}
                />
              </Box>
            )}
            {hasPermission(PERMISSIONS.FINA_COMMUNICATOR_FILE_SIGN) && (
              <StyledChip
                className={signDocument ? "active" : ""}
                label={t("signDocument")}
                variant="outlined"
                onClick={() => {
                  setSignDocument(!signDocument);
                }}
              />
            )}
          </StyledWizardContent>
          <StyledInfoWizardContent
            key={1}
            paddingTop={"0px"}
            display={"flex"}
            alignItems={"center"}
          >
            <UserAndGroupVirtualized
              setSelectedUsers={setSelectedPermittedUsers}
              selectedUsers={selectedPermittedUsers as UserAndGroup[]}
              size={"small"}
              onlyExternals={true}
              height={286}
            />
          </StyledInfoWizardContent>
        </Wizard>
      </StyledWizardWrapper>
    </StyledRoot>
  );
};

export default CreateMessageForm;
