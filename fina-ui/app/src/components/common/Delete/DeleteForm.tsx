import { useTranslation } from "react-i18next";
import GhostBtn from "../Button/GhostBtn";
import CheckboxBtn from "../Checkbox/CheckboxBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { ReactElement } from "react";
import { Dialog, Zoom, ZoomProps } from "@mui/material";
import PrimaryLoadingButton from "../Button/PrimaryLoadingButton";
import DeleteBtn from "../Button/DeleteBtn";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { DeleteRedIcon } from "../../../api/ui/icons/DeleteRedIcon";

interface DeleteFormProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: any;
  onDelete: () => void;
  headerText?: string;
  bodyText?: string;
  additionalBodyText?: string;
  deleteButtonTitle?: string;
  showConfirm?: boolean;
  confirmLabel?: string;
  confirmChecked?: boolean;
  setConfirmChecked?: (value: boolean) => void;
  disableBtn?: boolean;
  onCloseModal?: () => void;
  loading?: boolean;
  loadingBtn?: boolean;
}

interface TransitionComponentProps extends ZoomProps {
  children: ReactElement;
}

const StyledWrapperBox = styled(Box)(() => ({
  width: 420,
  overflow: "hidden",
  marginBottom: 14,
}));

const StyledDeleteRedIconBox = styled(Box)(() => ({
  "& .MuiSvgIcon-root": {
    minWidth: "334px",
    marginTop: "106px",
  },
}));

const StyledHeader = styled(Box)(() => ({
  marginTop: "80px",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: 600,
  fontFamily: "inter",
  marginBottom: "8px",
}));

const StyledBody = styled(Box)(() => ({
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 400,
  fontFamily: "inter",
  color: "#AEB8CB",
}));

const StyledAdditionalTextBox = styled(Box)(() => ({
  color: "#AEB8CB",
  textAlign: "center",
  fontWeight: 400,
  marginRight: "20px",
  marginLeft: "20px",
  fontSize: "16px",
}));

const StyledScrollBox = styled(Box)(() => ({
  overflowY: "auto",
  maxHeight: "78px",
}));

const StyledFooter = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "35px !important",
  margin: "auto",
  textAlign: "center",
  "& .MuiButtonBase-root": {
    marginRight: "16px",
    marginBottom: "4px",
  },
  "& .MuiSvgIcon-root": {
    marginTop: "inherit",
  },
}));

const StyledConfirmBox = styled(Box)(() => ({
  marginTop: "12px",
  textAlign: "center",
}));

const TransitionComponent = React.forwardRef<
  HTMLDivElement,
  TransitionComponentProps
>((props, ref) => {
  const { children, ...zoomProps } = props;
  return (
    <Zoom ref={ref} {...zoomProps}>
      {children}
    </Zoom>
  );
});

const DeleteForm: React.FC<DeleteFormProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  onDelete,
  headerText,
  bodyText,
  additionalBodyText,
  deleteButtonTitle,
  showConfirm = false,
  confirmLabel,
  confirmChecked,
  setConfirmChecked = () => {},
  disableBtn,
  onCloseModal,
  loading,
  loadingBtn = false,
}) => {
  const { t } = useTranslation();

  const onClose = () => {
    setIsDeleteModalOpen(false);
    setConfirmChecked(false);
    if (onCloseModal) {
      onCloseModal();
    }
  };

  return (
    <Dialog
      open={isDeleteModalOpen}
      TransitionComponent={TransitionComponent}
      PaperProps={{
        style: { borderRadius: "5px" },
      }}
    >
      <StyledWrapperBox data-testid={"delete-form-dialog"}>
        <StyledDeleteRedIconBox>
          <DeleteRedIcon />
        </StyledDeleteRedIconBox>
        <StyledHeader>{headerText}</StyledHeader>
        <StyledScrollBox>
          <StyledBody>{bodyText} </StyledBody>
          {additionalBodyText && (
            <StyledAdditionalTextBox>
              {additionalBodyText + " ?"}
            </StyledAdditionalTextBox>
          )}
        </StyledScrollBox>
        {showConfirm && (
          <StyledConfirmBox>
            <CheckboxBtn
              label={confirmLabel}
              onClick={(event) => setConfirmChecked(event.target.checked)}
              checked={confirmChecked}
              data-testid={"confirm-checkbox"}
            />
          </StyledConfirmBox>
        )}
        <StyledFooter>
          <GhostBtn
            width={104}
            onClick={onClose}
            defaultLineHeight={true}
            disabled={disableBtn}
            data-testid={"cancelBtn"}
          >
            {t("cancel")}
          </GhostBtn>
          {loadingBtn ? (
            <PrimaryLoadingButton
              data-testid={"saveBtn"}
              onClick={() => {
                onDelete();
              }}
              loading={loading}
              icon={<DeleteIcon />}
              sx={{
                maxWidth: "150px",
                backgroundColor: "#FF4128 !important",
                "&:hover": {
                  background:
                    "linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), rgb(255, 65, 40) !important",
                },
              }}
            >
              {t("delete")}
            </PrimaryLoadingButton>
          ) : (
            <DeleteBtn
              data-testid={"deleteBtn"}
              title={deleteButtonTitle}
              width={104}
              onClick={() => onDelete()}
              disabled={(showConfirm && !confirmChecked) || disableBtn}
            >
              {t("delete")}
            </DeleteBtn>
          )}
        </StyledFooter>
      </StyledWrapperBox>
    </Dialog>
  );
};

export default DeleteForm;
