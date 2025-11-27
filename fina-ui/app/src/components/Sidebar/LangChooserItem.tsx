import { ListItem } from "@mui/material";
import LanguageSelect from "../common/LanguageSelect";
import React, { memo } from "react";
import { styled } from "@mui/material/styles";

interface LangChooserItemProps {
  setHovered: (hovered: boolean) => void;
}

const StyledLanguageChooser = styled(ListItem)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
  [theme.breakpoints.between(900, 1300)]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  "& .MuiInputBase-root": {
    background: "unset",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#344258" : "rgba(255,255,255,0.51)",
  },
}));

const LangChooserItem: React.FC<LangChooserItemProps> = ({ setHovered }) => {
  return (
    <StyledLanguageChooser>
      <LanguageSelect
        onOpen={() => setHovered(true)}
        onClose={() => setHovered(false)}
        menuPosition={"right"}
      />
    </StyledLanguageChooser>
  );
};

export default memo(LangChooserItem);
