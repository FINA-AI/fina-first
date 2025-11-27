import React from "react";
import Radio from "@mui/material/Radio";
import Tooltip from "@mui/material/Tooltip";
import { connect } from "react-redux";
import themePalette from "../../api/palette/themePalette";
import { styled } from "@mui/system";

interface ThemeThumbProps {
  theme: any;
  value: string;
  selectedValue: string;
  name: string;
  handleChange: (event: any) => void;
}

const StyledRoot = styled("div")<{ _isSelected: boolean }>(
  ({ theme, _isSelected }) => ({
    boxShadow: _isSelected
      ? `0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12), 0 0 0px 2px ${theme.palette.primary.main}`
      : "",
    margin: `${theme.spacing(1)} ${theme.spacing(0.5)}`,
    width: "100%",
    position: "relative",
    borderRadius: (theme as any).rounded.mediumRadius,
    "& > span": {
      visibility: "hidden",
      position: "absolute",
    },
  })
);

const StyledDiv = styled("div")(({ theme }) => ({
  padding: 5,
  position: "relative",
  display: "block",
  textAlign: "center",
  "&:hover": {
    opacity: 0.7,
  },
  "& img": {
    filter: theme.palette.mode === "dark" && "invert(1)",
  },
}));

const StyledDecoratedDiv = styled("div")(({ theme }) => ({
  width: "100%",
  borderRadius: theme.rounded.mediumRadius,
  height: 80,
}));

const ThemeThumb: React.FC<ThemeThumbProps> = ({
  theme,
  value,
  selectedValue,
  handleChange,
  name,
}) => {
  const color = themePalette[value as keyof typeof themePalette].mainColor;
  return (
    <StyledRoot _isSelected={theme === value}>
      <Radio
        checked={selectedValue === value}
        value={value}
        onChange={handleChange}
      />
      <Tooltip title={name} placement="top">
        <StyledDiv>
          <StyledDecoratedDiv
            style={{
              backgroundImage: `linear-gradient(-45deg, ${color} 0%, ${color} 33%, ${color} 100%)`,
            }}
          />
        </StyledDiv>
      </Tooltip>
    </StyledRoot>
  );
};

// Redux
const reducer = "ui";
const mapStateToProps = (state: any) => ({
  theme: state.getIn([reducer, "theme"]),
});

const ThumbsMapped = connect(mapStateToProps)(ThemeThumb);

export default ThumbsMapped;
