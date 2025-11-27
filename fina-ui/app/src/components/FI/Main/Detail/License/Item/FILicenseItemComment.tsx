import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import FILicenseCommentField from "./FILicenseCommentField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextButton from "../../../../../common/Button/TextButton";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { CommentType } from "../../../../../../types/fi.type";
import { LicenseData } from "./FILicenseItemDetailsPage";

const StyledRoot = styled(Box)(({ theme }) => ({
  margin: "0px 16px",
  borderBottom: `1px dashed ${
    theme.palette.mode === "light" ? "#EAEBF0" : "#3C4D68"
  } `,
}));

const StyledCommentIconContainer = styled(Box)(({ theme }) => ({
  width: "24px",
  height: "24px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "47px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiSvgIcon-root": {
    color: "#FFFFFF",
    width: "16px",
    height: "16px",
  },
}));

const StyledCommentContainer = styled(Box)(({ theme }: any) => ({
  marginTop: "12px",
  padding: "12px 20px",
  border: theme.palette.borderColor,
  backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#344258",
  borderRadius: "4px",
}));

const StyledAccordionBox = styled(Box)({
  "& .MuiBox-root": {
    width: "100%",
  },
  "& .MuiPaper-root": {
    background: "inherit !important",
    boxShadow: "none !important",
  },
  "& .MuiAccordionSummary-root": {
    padding: "0px",
    background: "inherit !important",
    boxShadow: "none !important",
    minHeight: "inherit !important",
  },
  "& .MuiAccordionDetails-root": {
    padding: "0px",
  },
  "& .MuiAccordionSummary-content": {
    margin: "0px",
  },
});

const StyledCommentText = styled("span")(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "21px",
  paddingLeft: 8,
}));

const StyledHeaderAddIcon = styled(AddIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: "pointer",
  fontSize: 20,
}));

interface FILicenseItemCommentProps {
  licenseData: LicenseData;
  saveLicenseCommentFunction: (
    comment: CommentType
  ) => Promise<CommentType | null>;
  deleteLicenseCommentFunction: (comment: CommentType) => void;
  generalEditMode: boolean;
  setGeneralEditMode: (val: boolean) => void;
}

const FILicenseItemComment: React.FC<FILicenseItemCommentProps> = ({
  saveLicenseCommentFunction,
  deleteLicenseCommentFunction,
  licenseData,
  generalEditMode,
  setGeneralEditMode,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [disableAddOrEdit, setDisableAddOrEdit] = useState(false);

  useEffect(() => {
    setComments(
      licenseData.comments.sort((a: CommentType, b: CommentType) => b.id - a.id)
    );
  }, [licenseData.comments]);

  const onDeleteComment = async (item: CommentType) => {
    if (item.id > 0) {
      await deleteLicenseCommentFunction(item);
    }
    let comArray = comments.filter((c) => c.id !== item.id);
    setComments([...comArray]);
    licenseData.comments = [...comArray];
  };

  const addNewComment = () => {
    const comment: CommentType = {
      id: comments.length > 0 ? (comments.length + 1) * -1 : -1,
      modifiedAt: null,
      comment: "",
    };
    setComments([comment, ...comments]);
    licenseData.comments.unshift(comment);
  };

  const onCancel = (comment: CommentType) => {
    if (comment.id < 1) {
      licenseData.comments = licenseData.comments.filter(
        (c: CommentType) => c.id !== comment.id
      );
      let comArray = comments.filter((c) => c.id !== comment.id);
      setComments([...comArray]);
      licenseData.comments = [...comArray];
    }
    setDisableAddOrEdit(false);
    setGeneralEditMode(false);
  };

  const commentSave = async (
    commentItem: CommentType
  ): Promise<CommentType | null> => {
    const oldId = commentItem.id;
    let response: CommentType | null = null;

    const comment = await saveLicenseCommentFunction(commentItem);
    if (comment) {
      const comArray = comments.map((c) => (c.id === oldId ? comment : c));
      licenseData.comments = [...comArray];
      setComments([...comArray]);
      response = comment;
    }

    return response;
  };

  return (
    <StyledRoot
      padding={"12px 0px 16px 0px"}
      data-testid={"fi-license-item-comment"}
    >
      <Box display={"flex"}>
        <Box display={"flex"} width={"100%"}>
          <StyledCommentIconContainer display={"flex"}>
            <ModeCommentIcon />
          </StyledCommentIconContainer>
          <StyledCommentText>{t("comment")}</StyledCommentText>
        </Box>
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <Box>
            <StyledHeaderAddIcon
              sx={{
                ...((disableAddOrEdit || generalEditMode) && {
                  cursor: "default",
                  color: "rgb(194, 202, 216)",
                }),
              }}
              onClick={() => {
                if (!disableAddOrEdit && !generalEditMode) {
                  setGeneralEditMode(true);
                  addNewComment();
                }
              }}
            />
          </Box>
        )}
      </Box>
      <div>
        {comments.length > 0 && (
          <StyledCommentContainer>
            <StyledAccordionBox>
              <Accordion expanded={expanded}>
                <AccordionSummary>
                  <FILicenseCommentField
                    commentItem={comments[0]}
                    key={0}
                    onCommentSaveFunction={commentSave}
                    onDeleteComment={onDeleteComment}
                    onCancel={onCancel}
                    disableAddOrEdit={disableAddOrEdit}
                    setDisableAddOrEdit={setDisableAddOrEdit}
                    firstChild={true}
                    hideActionButtons={generalEditMode}
                    setGeneralEditMode={setGeneralEditMode}
                    generalEditMode={generalEditMode}
                    index={0}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  {comments.map((commentItem, index) => {
                    return (
                      index > 0 && (
                        <FILicenseCommentField
                          commentItem={commentItem}
                          key={index + 1}
                          index={index}
                          onCommentSaveFunction={commentSave}
                          onDeleteComment={onDeleteComment}
                          onCancel={(comment) => onCancel(comment)}
                          disableAddOrEdit={disableAddOrEdit}
                          setDisableAddOrEdit={setDisableAddOrEdit}
                          hideActionButtons={generalEditMode}
                          setGeneralEditMode={setGeneralEditMode}
                          generalEditMode={generalEditMode}
                        />
                      )
                    );
                  })}
                </AccordionDetails>
              </Accordion>
              {comments.length > 1 && (
                <div>
                  <TextButton
                    onClick={() => setExpanded(!expanded)}
                    endIcon={
                      expanded ? (
                        <KeyboardArrowUpRounded />
                      ) : (
                        <KeyboardArrowDownRounded />
                      )
                    }
                    data-testid={`${expanded ? "seeLess" : "seeMore"}-button`}
                  >
                    {expanded ? t("seeLess") : t("seeMore")}
                  </TextButton>
                </div>
              )}
            </StyledAccordionBox>
          </StyledCommentContainer>
        )}
      </div>
    </StyledRoot>
  );
};

export default FILicenseItemComment;
