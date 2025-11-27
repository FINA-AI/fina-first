import PropTypes from "prop-types";
import FIDetailPageContent from "./FIDetailPageContent";
import { FITabs } from "../../fiTabs";
import { memo, useMemo } from "react";

const FIDetailPage = ({
  fiId,
  tabName,
  children,
  fiSeeMore,
  setFISeeMore,
  onBreadCrubmNavigationClick,
}) => {
  const tabs = useMemo(() => {
    return Object.values(FITabs);
  });
  return (
    <FIDetailPageContent
      fiId={fiId}
      tabArray={tabs}
      tabName={tabName}
      fiSeeMore={fiSeeMore}
      setFISeeMore={setFISeeMore}
      onBreadCrubmNavigationClick={onBreadCrubmNavigationClick}
    >
      {children}
    </FIDetailPageContent>
  );
};

FIDetailPage.propTypes = {
  children: PropTypes.any.isRequired,
  fiSeeMore: PropTypes.bool,
  setFISeeMore: PropTypes.func,
  fiId: PropTypes.number,
  tabName: PropTypes.string,
  onBreadCrubmNavigationClick: PropTypes.func,
};

export default memo(FIDetailPage);
