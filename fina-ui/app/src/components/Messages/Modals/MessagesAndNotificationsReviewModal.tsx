import ClosableModal from "../../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import React, { FC } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import FileAttachmentBox from "../Chat/FileAttachmentBox";
import { BASE_REST_URL } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";
import { CommReviewModalType } from "../../../types/communicator.common.type";

const StyledMessageContent = styled(Typography)(({ theme }: any) => ({
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "20px",
  maxHeight: "28px",
  color: theme.palette.textColor,
  "& a": {
    ...theme.links,
  },
}));

const StyledContentWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
  height: "100%",
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  display: "flex",
  justifyContent: "flex-end",
}));

interface MessagesAndNotificationsReviewModalProps {
  setReviewModal: React.Dispatch<React.SetStateAction<CommReviewModalType>>;
  reviewModal: CommReviewModalType;
}

const MessagesAndNotificationsReviewModal: FC<
  MessagesAndNotificationsReviewModalProps
> = ({ setReviewModal, reviewModal }) => {
  const { t } = useTranslation();

  const onAttachmentDownload = (fileId?: number) => {
    window.open(
      BASE_REST_URL + `/communicator/messages/conversation/download/${fileId}`,
      "_blank"
    );
  };

  return (
    <ClosableModal
      onClose={() => {
        setReviewModal({ open: false, message: null });
      }}
      open={reviewModal.open}
      width={"50%"}
      height={"80%"}
      title={t("review")}
      draggable={true}
      resizable={true}
    >
      <StyledContentWrapper>
        <Box p={"16px"} overflow={"auto"} height={"100%"}>
          {reviewModal?.message && (
            <StyledMessageContent
              dangerouslySetInnerHTML={{ __html: reviewModal?.message.content }}
            />
          )}
        </Box>
        {reviewModal.files && (
          <FileAttachmentBox
            hideCloseIcon={true}
            files={reviewModal.files}
            open={true}
            remove={() => {}}
            onFileDownload={(id?: number) => onAttachmentDownload(id)}
          />
        )}
        <StyledFooter p={"16px"}>
          <PrimaryBtn
            onClick={() => {
              setReviewModal({ open: false, message: null });
            }}
          >
            {t("done")}
          </PrimaryBtn>
        </StyledFooter>
      </StyledContentWrapper>
    </ClosableModal>
  );
};

export default MessagesAndNotificationsReviewModal;
