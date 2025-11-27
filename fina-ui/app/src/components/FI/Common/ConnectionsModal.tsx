import { useTranslation } from "react-i18next";
import { UnableToDelete } from "../../../api/ui/icons/UnableToDelete";
import { Box, Dialog, Typography, Zoom } from "@mui/material";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import React from "react";
import { styled } from "@mui/material/styles";

const TransitionComponent = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} />;
});

const StyledHeader = styled(Box)(({ theme }: any) => ({
  marginTop: "30px",
  textAlign: "center",
  fontSize: "20px",
  fontWeight: 600,
  fontFamily: "inter",
  color: theme.palette.textColor,
}));

const StyledButtonBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#FFFFFF",
  borderRadius: 4,
  padding: "8px 11px",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  width: 50,
}));

const StyledConnections = styled(Box)({
  marginTop: "12px",
  textAlign: "center",
  maxHeight: "100px",
  minHeight: "50px",
  overflow: "auto",
});

const StyledFooter = styled(Box)({
  marginTop: "35px !important",
  margin: "auto",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  marginBottom: 14,
});

const StyledIconBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: 14,
  "& .MuiSvgIcon-root": {
    minWidth: "300px",
    marginTop: "106px",
  },
});

const StyledName = styled(Typography)({
  color: "#8695B1",
  fontWeight: 400,
  fontSize: "14px",
  marginRight: "20px",
});

const StyledCode = styled(Typography)({
  color: "#AEB8CB",
  fontWeight: 400,
  fontSize: "13px",
  marginTop: "3px",
});

const StyledBallIcon = styled(Brightness1Icon)({
  color: "#8695B1",
  width: 5,
  height: 5,
  marginRight: "10px",
  marginTop: "5px",
});

interface ConnectionItem {
  name: string;
  code?: string;
  identificationNumber?: string;
}

interface ConnectionsModalProps {
  isConnectionsModalOpen: boolean;
  setIsConnectionsModalOpen: (open: boolean) => void;
  connections?: ConnectionItem[];
}

const ConnectionsModal: React.FC<ConnectionsModalProps> = ({
  isConnectionsModalOpen,
  setIsConnectionsModalOpen,
  connections,
}) => {
  const { t } = useTranslation();

  const onClose = () => {
    setIsConnectionsModalOpen(false);
  };

  return (
    <Dialog
      open={isConnectionsModalOpen}
      TransitionComponent={TransitionComponent}
    >
      <div style={{ width: 420 }}>
        <StyledIconBox>
          <UnableToDelete />
        </StyledIconBox>

        <StyledHeader>{t("unableToDelete")}</StyledHeader>
        <div
          style={{
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          {t("hasConnectionsIn")}
        </div>
        <StyledConnections>
          {connections?.map((item, index) => (
            <Box
              key={index}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <StyledBallIcon />
              <StyledName>{item.name}</StyledName>
              <StyledCode>
                {item.code ? item.code : item.identificationNumber}
              </StyledCode>
            </Box>
          ))}
        </StyledConnections>

        <StyledFooter>
          <StyledButtonBox onClick={onClose}>
            <Typography> {t("okay")} </Typography>
          </StyledButtonBox>
        </StyledFooter>
      </div>
    </Dialog>
  );
};

export default ConnectionsModal;
