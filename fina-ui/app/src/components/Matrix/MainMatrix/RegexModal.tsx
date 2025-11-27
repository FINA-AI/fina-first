import ClosableModal from "../../common/Modal/ClosableModal";
import React, { useState } from "react";
import TextField from "../../common/Field/TextField";
import { Box, Grid, Typography } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { styled } from "@mui/material/styles";

export const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalFooter,
  display: "flex",
  padding: "8px 16px",
  justifyContent: "flex-end",
}));

export const StyledTextField = styled(Grid)({
  padding: "16px",
});

export const StyledHelperText = styled(Grid)({
  padding: "0px 16px",
  height: "10px",
});

export const StyledCheckIcon = styled(CheckRoundedIcon)({
  color: "green",
  paddingRight: "8px",
  width: "16px",
  height: "16px",
});

export const StyledWarningIcon = styled(WarningRoundedIcon)({
  color: "red",
  paddingRight: "8px",
  width: "16px",
  height: "16px",
});

interface RegexModalProps {
  open: boolean;
  onClose: () => void;
  pattern: string;
}
const RegexModal: React.FC<RegexModalProps> = ({ open, onClose, pattern }) => {
  const { t } = useTranslation();
  const [testString, setTestString] = useState<string>("");

  const [testResult, setTestResult] = useState<string | null>(null);

  const testRegexPattern = () => {
    let newPattern = `^${pattern}$`;
    const regex = new RegExp(newPattern);

    setTestResult(regex.test(testString) ? "valid" : "invalid");
  };

  return (
    <ClosableModal
      onClose={onClose}
      open={open}
      width={500}
      height={300}
      includeHeader={true}
      title={t("testpattern")}
    >
      <StyledRoot>
        <Grid container height={"100%"}>
          <StyledTextField item xs={12}>
            <TextField
              size={"default"}
              label={t("regularexpression")}
              value={pattern}
              border={4}
              readOnly={true}
              multiline={true}
            />
          </StyledTextField>
          <StyledTextField item xs={12}>
            <TextField
              label={t("teststring")}
              value={testString}
              onChange={(value: string) => {
                setTestString(value);
              }}
            />
          </StyledTextField>
          <StyledHelperText item xs={12}>
            <Typography>
              {testResult !== null && (
                <>
                  {testResult === "valid" ? (
                    <Box display={"flex"} flexDirection={"row"}>
                      <StyledCheckIcon />
                      <Typography color={"green"} fontSize={"11px"}>
                        {t("match")}
                      </Typography>
                    </Box>
                  ) : (
                    <Box display={"flex"} flexDirection={"row"}>
                      <StyledWarningIcon />
                      <Typography color={"red"} fontSize={"11px"}>
                        {t("nomatch")}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Typography>
          </StyledHelperText>
        </Grid>

        <StyledFooter>
          <PrimaryBtn
            onClick={() => testRegexPattern()}
            style={{ background: "#289E20", height: "32px" }}
          >
            {t("test")}
          </PrimaryBtn>
        </StyledFooter>
      </StyledRoot>
    </ClosableModal>
  );
};

export default RegexModal;
