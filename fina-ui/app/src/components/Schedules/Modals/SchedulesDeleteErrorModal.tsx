import { ScheduleDeleteError } from "../../../api/ui/icons/ScheduleDeleteError";
import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { FC } from "react";
import { styled } from "@mui/material/styles";

const StyledIcon = styled("div")({
  display: "flex",
  justifyContent: "center",
  height: "160px",
  alignItems: "center",
  paddingTop: "30px",
  "& svg": {
    width: "200px",
    height: "200px",
  },
});

const StyledHeader = styled("div")({
  marginTop: "30px",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: 600,
  fontFamily: "inter",
});

const StyledBody = styled("div")({
  marginTop: "12px",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 400,
  fontFamily: "inter",
  color: "#AEB8CB",
});

const StyledFooter = styled("div")({
  marginTop: "35px",
  margin: "auto",
  textAlign: "center",
  "& .MuiButtonBase-root": {
    marginRight: "16px",
  },
  "& .MuiSvgIcon-root": {
    marginTop: "inherit",
    marginLeft: "5px",
  },
  "& .MuiButton-root": {
    width: "200px",
    height: "32px",
  },
});

interface SchedulesDeleteErrorModalProps {
  onClose: () => void;
  onOpen: boolean;
  headerText: string;
  bodyText: string;
}

const SchedulesDeleteErrorModal: FC<SchedulesDeleteErrorModalProps> = ({
  onClose,
  onOpen,
  headerText,
  bodyText,
}) => {
  const { t } = useTranslation();
  return (
    <ClosableModal
      onClose={onClose}
      open={onOpen}
      width={420}
      height={400}
      includeHeader={false}
      padding={20}
    >
      <div>
        <StyledIcon>
          <ScheduleDeleteError />
        </StyledIcon>

        <StyledHeader>{headerText}</StyledHeader>
        <StyledBody>{bodyText}</StyledBody>
        <StyledFooter>
          <PrimaryBtn onClick={onClose}> {t("okay")}</PrimaryBtn>
        </StyledFooter>
      </div>
    </ClosableModal>
  );
};

export default SchedulesDeleteErrorModal;
