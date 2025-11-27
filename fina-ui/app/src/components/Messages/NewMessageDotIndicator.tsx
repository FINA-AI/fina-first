import { keyframes, styled } from "@mui/material/styles";

const radioactive = keyframes({
  "0%": {
    transform: "scale(1)",
    borderColor: "#d4dce1",
  },
  "50%": {
    transform: "scale(1.2)",
    borderColor: "#c5b9b8",
  },
  "100%": {
    transform: "scale(1)",
    borderColor: "#c5b9b8",
    display: "none",
  },
});

const StyledDot = styled("div")({
  width: "5px",
  height: "5px",
  borderRadius: "50%",
  backgroundColor: "#3498db",
  border: "5px solid #ffffff00",
  animation: `'${radioactive}' 1.5s linear forwards`,
  animationIterationCount: 3,
});

const NewMessageDotIndicator = () => {
  return <StyledDot></StyledDot>;
};

export default NewMessageDotIndicator;
