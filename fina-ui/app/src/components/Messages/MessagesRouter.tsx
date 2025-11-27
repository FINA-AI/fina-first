import { Box } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import MessagesContainer from "../../containers/Messages/MessagesContainer";
import { styled } from "@mui/material/styles";

const StyledMainLayout = styled(Box)(({ theme }) => ({
  ...(theme as any).mainLayout,
}));
const MessagesRouter = () => {
  return (
    <StyledMainLayout display={"flex"} flexDirection={"column"} height={"100%"}>
      <Switch>
        <Route exact>
          <MessagesContainer />
        </Route>
      </Switch>
    </StyledMainLayout>
  );
};

export default MessagesRouter;
