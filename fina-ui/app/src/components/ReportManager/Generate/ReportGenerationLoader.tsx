import withLoading from "../../../hoc/withLoading";
import { Box } from "@mui/material";

const ReportGenerationLoader = () => {
  return <Box width={"100%"} height={"100%"} />;
};

export default withLoading(ReportGenerationLoader);
