import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import CopyButton from "../../common/Button/CopyButton";
import React, { ReactElement, useState } from "react";
import { styled } from "@mui/material/styles";

interface MiniInfoItemProps {
  editMode: boolean;
  title: string;
  value?: string;
  icon: ReactElement;
  dataKey?: string;
}

const StyledLogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(52, 66, 88)" : "#F0F1F7",
  width: "40px",
  height: "40px",
  borderRadius: "6px",
  color: theme.palette.mode === "light" ? "#8695B1" : "#5D789A",
}));

const StyledText = styled(Typography)(({ theme }: any) => ({
  width: "90%",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  color: theme.palette.textColor,
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "19px",
  color: theme.palette.secondaryTextColor,
}));

const MiniInfoItem: React.FC<MiniInfoItemProps> = ({
  value,
  icon,
  title,
  dataKey,
}) => {
  const [showCopyButton, setShowCopyButton] = useState(false);

  return (
    <Box
      display={"flex"}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
      sx={{ cursor: "pointer" }}
    >
      <Box display={"flex"} flex={1} flexDirection={"row"} width={"100%"}>
        <Grid container direction={"row"}>
          <Grid item xs={1}>
            <StyledLogoContainer>{icon}</StyledLogoContainer>
          </Grid>
          <Grid item xs={10} style={{ paddingLeft: 15 }}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              width={"100%"}
              flex={1}
              ml={2}
              justifyContent={"space-between"}
            >
              <StyledTitle noWrap>{title}</StyledTitle>

              <StyledText noWrap data-testid={dataKey}>
                {value}
              </StyledText>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box
              display={"flex"}
              flex={0}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              {showCopyButton && <CopyButton text={value} />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MiniInfoItem;
