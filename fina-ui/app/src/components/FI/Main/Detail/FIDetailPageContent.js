import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { loadFi } from "../../../../api/services/fi/fiService";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { setFI, setFiLoading } from "../../../../redux/actions/fiActions";
import TabNavigation from "../../../common/Navigation/TabNavigation";
import FiMainInfoMini from "./GeneralInfo/FiMainInfoMini";
import FiBreadcrumb from "../../Common/FiBreadcrumb";
import { bindActionCreators } from "redux";
import { FITabs } from "../../fiTabs";
import { styled } from "@mui/material/styles";

const StyledHeader = styled(Grid)({
  borderRadius: "8px",
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const FIDetailPageContent = ({
  fiId = 3086,
  tabArray,
  tabName,
  children,
  fiSeeMore,
  setFISeeMore,
  fi,
  setFi,
  setFiLoading,
  onBreadCrubmNavigationClick,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const onTabClickFunction = (obj) => {
    history.push(`/fi/${fiId}/${obj}`);
  };

  useEffect(() => {
    setFiLoading(true);
    loadFi(fiId)
      .then((resp) => {
        setFi(resp.data);
        setFiLoading(false);
      })
      .catch(() => {
        setFiLoading(false);
        enqueueSnackbar("Error Loading FI");
      });
  }, [fiId]);
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      sx={{
        overflow: "hidden",
        height: "100%",
      }}
      data-testid={tabName + "-page"}
    >
      <FiBreadcrumb
        name={fi?.name}
        tabName={tabName}
        mainPageName={"fi"}
        onBreadCrubmNavigationClick={onBreadCrubmNavigationClick}
      />
      <Box>
        <Grid container>
          {tabName !== "general" && (
            <StyledHeader xs={12} item>
              <FiMainInfoMini
                fi={fi}
                fiSeeMore={fiSeeMore}
                setFISeeMore={setFISeeMore}
              />
            </StyledHeader>
          )}
          <Grid
            xs={12}
            item
            sx={{
              height: "24px",
              margin: "16px 0px 0px 0px",
            }}
          >
            <TabNavigation
              tabs={tabArray}
              activeTabName={tabName ? tabName : FITabs.GENERAL}
              onTabClickFunction={onTabClickFunction}
              scrollButtonsShow={true}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          marginTop: "26px",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Grid container height={"100%"}>
          <Grid
            xs={12}
            item
            sx={{
              height: "100%",
              borderRadius: "8px",
              overflow: "hidden",
            }}
            data-testid={"main-grid"}
          >
            {children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

FIDetailPageContent.propTypes = {
  tabArray: PropTypes.array.isRequired,
  tabName: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  fiSeeMore: PropTypes.bool,
  setFISeeMore: PropTypes.func,
  fi: PropTypes.object,
  setFi: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setFiLoading: PropTypes.func,
  fiId: PropTypes.number,
  onBreadCrubmNavigationClick: PropTypes.func,
};

const reducer = "fi";

const mapStateToProps = (state) => ({
  fi: state.getIn([reducer, "fi"]),
});
const mapDispatchToProps = (dispatch) => {
  return {
    setFi: bindActionCreators(setFI, dispatch),
    setFiLoading: bindActionCreators(setFiLoading, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FIDetailPageContent);
