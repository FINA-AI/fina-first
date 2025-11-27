import { Box, Grid } from "@mui/material";
import { connect } from "react-redux";
import { setFI, setFiLoading } from "../../../../../redux/actions/fiActions";
import FiGeneralInfo from "./FiGeneralInfo";
import { bindActionCreators, Dispatch } from "redux";
import { useLocation } from "react-router-dom";
import React, { memo } from "react";
import { styled } from "@mui/material/styles";
import { FiDataType } from "../../../../../types/fi.type";

const StyledBody = styled(Grid)(({ theme }: { theme: any }) => ({
  height: "100%",
  background: theme.palette.paperBackground,
  borderRadius: "4px",
  overflow: "auto",
}));

interface FIGeneralPageProps {
  fi: FiDataType;
  setFi: (fi: FiDataType) => void;
  loading: boolean;
  setFiLoading: (value: boolean) => void;
}

const FIGeneralPage: React.FC<FIGeneralPageProps> = ({
  fi,
  setFi,
  loading,
  setFiLoading,
}) => {
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  return (
    <Box height={"100%"}>
      <Grid container height={"100%"}>
        <StyledBody xs={12} item>
          <FiGeneralInfo
            fi={fi}
            setFi={setFi}
            loading={loading}
            setLoading={setFiLoading}
            defaultEditMode={query.get("edit") === "true"}
          />
        </StyledBody>
      </Grid>
    </Box>
  );
};

const reducer = "fi";

const mapStateToProps = (state: any) => ({
  fi: state.getIn([reducer, "fi"]) as FiDataType,
  loading: state.getIn([reducer, "isFiInfoLoading"]) as boolean,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFi: bindActionCreators(setFI, dispatch),
  setFiLoading: bindActionCreators(setFiLoading, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(FIGeneralPage));
