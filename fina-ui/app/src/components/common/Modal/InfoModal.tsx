import { Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import PrimaryBtn from "../Button/PrimaryBtn";
import { Paper } from "@mui/material";
import React, { ReactElement } from "react";
import { styled } from "@mui/material/styles";

interface InfoModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onOkButtonClick: () => void;
  icon: ReactElement;
  bodyText: string;
}

const StyledModal = styled(Modal)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledTextBox = styled(Box)(() => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: 18,
  lineHeight: "150%",
}));

const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  setIsOpen,
  onOkButtonClick,
  bodyText,
  icon,
}) => {
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <StyledModal
      open={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <Paper style={{ width: 320, height: 340, borderRadius: "8px" }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
          height={"100%"}
        >
          <Box display={"flex"} alignItems={"center"} flex={1}>
            {icon}
          </Box>
          <Box
            flex={1}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-evenly"}
          >
            <StyledTextBox>{bodyText}</StyledTextBox>
            <PrimaryBtn onClick={onOkButtonClick}>Ok</PrimaryBtn>
          </Box>
        </Box>
      </Paper>
    </StyledModal>
  );
};

export default InfoModal;
