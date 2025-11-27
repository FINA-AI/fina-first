import * as React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Backdrop, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ProgressProps {
  importProgress: number;
  loading: boolean;
}

const StyledBackdrop = styled(Backdrop)({
  zIndex: "999999999999 !important",
  opacity: 1,
  color: "#fff",
  backgroundColor: "rgba(0, 0, 0, 0)",
  position: "absolute",
  "&.MuiBackdrop-root": {
    backgroundColor: "rgb(128,128,128,0.3)",
  },
  border: "1px solid red",
});

const StyledPercentage = styled(Box)({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 400,
  fontSize: "18px",
  marginTop: "10px",
  paddingLeft: 15,
  color: theme.palette.primary.main,
  verticalAlign: "top",
  textTransform: "capitalize",
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  opacity: 2,
  borderRadius: "8px",
  width: "325px",
  height: "350px",
  padding: "10px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    theme.palette.mode === "light" ? "rgb(240, 240, 245,.9)" : "#3C4D68",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",
}));

const FiImportProgress: React.FC<ProgressProps> = ({
  importProgress,
  loading,
}) => {
  function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number }
  ) {
    return (
      <StyledContainer>
        <Box textAlign={"center"}>
          <StyledText>FI import in progress, please wait...</StyledText>
          <Divider />
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          flex={1}
        >
          {importProgress >= 0 ? (
            <>
              <CircularProgress size={125} variant="determinate" {...props} />
              <StyledPercentage>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  fontSize={"18px"}
                >{`${props.value}%`}</Typography>
              </StyledPercentage>
            </>
          ) : (
            <CircularProgress size={125} />
          )}
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledBackdrop open={loading}>
      <CircularProgressWithLabel value={importProgress} />
    </StyledBackdrop>
  );
};

export default FiImportProgress;
