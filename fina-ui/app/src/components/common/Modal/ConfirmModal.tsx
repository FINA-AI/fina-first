import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useTranslation } from "react-i18next";
import GhostBtn from "../Button/GhostBtn";
import { Box } from "@mui/system";
import PrimaryLoadingButton from "../Button/PrimaryLoadingButton";
import { Dialog, Zoom, ZoomProps } from "@mui/material";
import React, { ReactElement } from "react";
import { styled } from "@mui/material/styles";

interface TransitionComponentProps extends ZoomProps {
  children: ReactElement;
}

interface ConfirmModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onConfirm: () => void;
  headerText?: string;
  bodyText: string;
  icon: ReactElement;
  confirmBtnTitle: string;
  loading?: boolean;
  additionalBodyText?: string;
  cancelBtnTitle?: string;
}

const TransitionComponent = React.forwardRef<
  HTMLDivElement,
  TransitionComponentProps
>(function Transition(props, ref) {
  const { children, ...zoomProps } = props;
  return (
    <Zoom ref={ref} {...zoomProps}>
      {children}
    </Zoom>
  );
});

const StyledHeader = styled(Box)(() => ({
  marginTop: "48px",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: 600,
  fontFamily: "inter",
}));

const StyledBody = styled(Box)(({ theme }: any) => ({
  marginTop: "12px",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 400,
  fontFamily: "inter",
  padding: "0px 10px 0px 10px",
  color: theme.palette.mode === "light" ? "#AEB8CB" : "",
}));

const StyledFooter = styled(Box)(() => ({
  marginTop: "30px !important",
  marginBottom: "20px !important",
  margin: "auto",
  textAlign: "center",
  "& .MuiButtonBase-root": {
    marginRight: "16px",
  },
  "& .MuiSvgIcon-root": {
    marginTop: "inherit",
    marginLeft: "5px",
  },
}));

const StyledIconBox = styled(Box)(() => ({
  "& .MuiSvgIcon-root": {
    minWidth: "300px",
    marginTop: "106px",
  },
}));

const StyledAdditionalTextBox = styled(Box)(({ theme }: any) => ({
  textAlign: "center",
  fontWeight: 400,
  fontSize: "16px",
  color: theme.palette.mode === "light" ? "#AEB8CB" : "",
  padding: "0px 10px 0px 10px",
}));

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
  headerText,
  bodyText,
  confirmBtnTitle,
  icon,
  loading = false,
  additionalBodyText,
  cancelBtnTitle = "cancel",
}) => {
  const { t } = useTranslation();

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} TransitionComponent={TransitionComponent}>
      <Box width={350} height={"auto"}>
        <StyledIconBox mt={4} display={"flex"} justifyContent={"center"}>
          {icon}
        </StyledIconBox>

        <StyledHeader>{headerText}</StyledHeader>
        <StyledBody>{bodyText}</StyledBody>
        {additionalBodyText && (
          <StyledAdditionalTextBox>
            {additionalBodyText}
          </StyledAdditionalTextBox>
        )}
        <StyledFooter>
          <GhostBtn
            width={104}
            onClick={onClose}
            disabled={loading}
            data-testid={"cancelBtn"}
          >
            {t(cancelBtnTitle)}
          </GhostBtn>
          <PrimaryLoadingButton
            text={confirmBtnTitle}
            onClick={() => onConfirm()}
            loading={loading}
            icon={<CheckRoundedIcon />}
            style={{ maxWidth: "150px" }}
          />
        </StyledFooter>
      </Box>
    </Dialog>
  );
};

export default ConfirmModal;
