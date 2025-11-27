import ClosableModal from "../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { GeneratedRDTable } from "../../types/returnDefinition.type";

interface Props {
  data: GeneratedRDTable;
  onClose: VoidFunction;
  open: boolean;
  onClick: VoidFunction;
}

const StyledRoot = styled(Box)({
  width: "100%",
  height: "390px",
  display: "flex",
  flexDirection: "column",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
  textTransform: "capitalize",
});

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalFooter,
  display: "flex",
  justifyContent: "end",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  textTransform: "capitalize",
  padding: "16px",
  paddingRight: "30px",
  "& .MuiSvgIcon-root": {
    paddingLeft: "10px",
  },
}));

const ReturnDefinitionsTableGenerateModal: React.FC<Props> = ({
  data,
  onClose,
  open,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <ClosableModal
      onClose={onClose}
      open={open}
      width={800}
      height={500}
      includeHeader={true}
      title={t("sourceView")}
      titleFontWeight={"600"}
    >
      <StyledRoot>
        <Box sx={{ overflowY: "auto", padding: "10px 20px 20px 20px" }}>
          {Object.keys(data.source).map((item, index) => {
            return (
              <Box key={index} pt={"10px"}>
                <Box>
                  <Typography fontSize={15} fontWeight={600}>
                    {item + ":"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: "40px",
                    paddingTop: "5px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Typography fontSize={14}>{data.source[item]}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </StyledRoot>
      <StyledFooter>
        <PrimaryBtn onClick={() => onClick()}>{t("okay")}</PrimaryBtn>
      </StyledFooter>
    </ClosableModal>
  );
};

export default ReturnDefinitionsTableGenerateModal;
