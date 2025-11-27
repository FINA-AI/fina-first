import React, { useEffect, useState } from "react";
import { Box, TextField, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import TextButton from "../../../../../common/Button/TextButton";
import DatePicker from "../../../../../common/Field/DatePicker";
import ConfirmModal from "../../../../../common/Modal/ConfirmModal";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import useConfig from "../../../../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../../../../util/appUtil";
import { SaveIcon } from "../../../../../../api/ui/icons/SaveIcon";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { CommentType } from "../../../../../../types/fi.type";
import { CancelIcon } from "../../../../../../api/ui/icons/CancelIcon";

interface FILicenseCommentFieldProps {
  commentItem: CommentType;
  onCommentSaveFunction: (
    comment: CommentType,
    id: number
  ) => Promise<CommentType | null>;
  onDeleteComment: (comment: CommentType) => void;
  onCancel: (comment: CommentType) => void;
  disableAddOrEdit?: boolean;
  setDisableAddOrEdit?: (val: boolean) => void;
  firstChild?: boolean;
  hideActionButtons?: boolean;
  setGeneralEditMode?: (val: boolean) => void;
  generalEditMode?: boolean;
  index: number;
}

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "firstChild",
})<{ firstChild: boolean }>(({ theme, firstChild }) => ({
  padding: "8px 0px 8px 0px",
  borderTop: firstChild ? "none" : `1px solid ${theme.palette.divider}`,
}));

const StyledEditableItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  border: `1px solid ${theme.palette.mode === "dark" ? "#7D819D" : "#DFDFDF"}`,
  padding: "8px 12px",
  margin: "10px 0px",
}));

const StyledEditableActionBtnBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

const StyledEditableRightSide = styled(Box)({
  width: "150px !important",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const StyledCommentItemText = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#4F5863" : "#FFFFFF",
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: "20px",
  lineBreak: "anywhere",
  maxHeight: "140px",
  overflow: "auto",
  paddingRight: "8px",
}));

const StyledCommentItemDate = styled(Box)({
  color: "#C2CAD8",
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
  marginTop: "8px",
  display: "flex",
  justifyContent: "flex-end",
});

const StyledTextArea = styled(TextField)({
  border: "0px !important",
  "& .MuiOutlinedInput-root": {
    padding: "0px !important",
    background: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none !important",
  },
});

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#AEB8CB" : "#5D789A",
  cursor: "pointer",
  width: "14px",
  height: "14px",
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#AEB8CB" : "#5D789A",
  cursor: "pointer",
  width: "14px",
  height: "14px",
}));

const FILicenseCommentField: React.FC<FILicenseCommentFieldProps> = ({
  commentItem,
  onCommentSaveFunction,
  onDeleteComment,
  onCancel,
  disableAddOrEdit = false,
  setDisableAddOrEdit,
  firstChild = false,
  hideActionButtons = false,
  setGeneralEditMode,
  generalEditMode = false,
  index,
}) => {
  const { getDateFormat, hasPermission } = useConfig();
  const theme = useTheme();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [editMode, setEditMode] = useState(false);
  const [item, setItem] = useState<CommentType>(commentItem);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [disableConfirmModal, setDisableConfirmModal] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (commentItem && commentItem.id < 0) {
      setEditMode(true);
    }
    setItem({ ...commentItem });
  }, [commentItem]);

  useEffect(() => {
    setDisableAddOrEdit?.(editMode);
  }, [editMode]);

  useEffect(() => {
    if (!generalEditMode) {
      setEditMode(false);
    }
  }, [generalEditMode]);

  const onDateChange = (value: Date) => {
    let date = new Date(value).getTime().toString();
    setItem({ ...item, modifiedAt: date });
  };

  const onCommentChange = (value: string) => {
    item.comment = value;
    if (item.comment.length > 250) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const onCancelEdit = () => {
    if (item.id < 0) {
      onCancel(commentItem);
    } else {
      setItem({ ...commentItem });
    }
    setIsCancelModalOpen(false);
    setEditMode(false);
    setGeneralEditMode?.(false);
  };

  const onSaveFunction = async () => {
    if (!item.comment) {
      enqueueSnackbar(t("canNotBeEmpty"), { variant: "warning" });
    } else {
      setDisableConfirmModal(true);
      let comment = await onCommentSaveFunction(item, commentItem.id);
      if (comment) {
        setEditMode(false);
        setItem({ ...comment });
        setGeneralEditMode?.(false);
      }
      setDisableConfirmModal(false);
    }
    setConfirmModal(false);
  };

  return (
    item && (
      <StyledRoot
        firstChild={firstChild}
        alignItems={"center"}
        data-testid={"item-" + index}
      >
        <Box display={"flex"} alignItems={"center"} width={"100%"}>
          {editMode && (
            <StyledEditableItem>
              <Box display={"flex"} paddingRight={"20px"}>
                <StyledTextArea
                  error={!isValid}
                  helperText={!isValid ? t("longtext") : ""}
                  id="outlined-multiline-flexible"
                  placeholder={t("typeAnything")}
                  multiline
                  defaultValue={item.comment}
                  maxRows={7}
                  onChange={(e) => onCommentChange(e.target.value)}
                  fullWidth
                  inputProps={{
                    style: {
                      fontSize: "13px",
                      fontWeight: 500,
                      lineHeight: "20px",
                      paddingRight: "8px",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "13px",
                      fontWeight: 500,
                      lineHeight: "20px",
                    },
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: !isValid ? "#f44336" : undefined,
                    },
                  }}
                />
              </Box>
              <StyledEditableRightSide>
                <StyledEditableActionBtnBox>
                  <TextButton
                    color={"secondary"}
                    onClick={() => setIsCancelModalOpen(true)}
                  >
                    {t("cancel")}
                  </TextButton>
                  <span style={{ borderLeft: "1px solid #687A9E", height: 14 }}>
                    &nbsp;
                  </span>
                  <TextButton
                    style={{
                      color: isValid ? theme.palette.primary.main : "#687A9E",
                      minWidth: "fit-content",
                    }}
                    onClick={() => setConfirmModal(true)}
                    disabled={!isValid}
                    endIcon={
                      <CheckIcon sx={{ width: "12px", height: "12px" }} />
                    }
                  >
                    {t("save")}
                  </TextButton>
                </StyledEditableActionBtnBox>
                <Box sx={{ display: "flex", marginTop: "20px" }}>
                  <DatePicker
                    size={"small"}
                    value={item.modifiedAt}
                    onChange={(value: Date) => onDateChange(value)}
                  />
                </Box>
              </StyledEditableRightSide>
            </StyledEditableItem>
          )}
          {!editMode && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <StyledCommentItemText>{item.comment}</StyledCommentItemText>
                <StyledCommentItemDate>
                  {getFormattedDateValue(item.modifiedAt, getDateFormat(true))}
                </StyledCommentItemDate>
              </Box>
              <Box
                sx={{
                  width: "83px !important",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px !important",
                }}
              >
                {!disableAddOrEdit && !hideActionButtons && (
                  <>
                    {hasPermission(PERMISSIONS.FI_AMEND) && (
                      <StyledEditIcon
                        onClick={() => {
                          setEditMode(true);
                          setGeneralEditMode?.(true);
                        }}
                      />
                    )}
                    {hasPermission(PERMISSIONS.FI_DELETE) && (
                      <StyledDeleteIcon
                        onClick={() => {
                          setIsDeleteConfirmOpen(true);
                        }}
                      />
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}
        </Box>
        {isCancelModalOpen && (
          <ConfirmModal
            isOpen={isCancelModalOpen}
            setIsOpen={setIsCancelModalOpen}
            onConfirm={onCancelEdit}
            confirmBtnTitle={t("confirm")}
            headerText={t("cancel")}
            additionalBodyText={t("changes")}
            bodyText={t("cancelBodyText")}
            icon={<CancelIcon />}
          />
        )}
        {confirmModal && (
          <ConfirmModal
            isOpen={confirmModal}
            setIsOpen={setConfirmModal}
            onConfirm={onSaveFunction}
            confirmBtnTitle={t("save")}
            headerText={t("saveHeaderText")}
            additionalBodyText={t("changes")}
            bodyText={t("saveBodyText")}
            icon={<SaveIcon />}
            loading={disableConfirmModal}
          />
        )}
        {isDeleteConfirmOpen && (
          <DeleteForm
            headerText={t("delete")}
            bodyText={t("deleteWarning")}
            additionalBodyText={t("license")}
            isDeleteModalOpen={isDeleteConfirmOpen}
            setIsDeleteModalOpen={setIsDeleteConfirmOpen}
            onDelete={() => {
              onDeleteComment(commentItem);
              setIsDeleteConfirmOpen(false);
            }}
            showConfirm={false}
          />
        )}
      </StyledRoot>
    )
  );
};

export default FILicenseCommentField;
