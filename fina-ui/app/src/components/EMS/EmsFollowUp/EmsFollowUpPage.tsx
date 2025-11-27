import React, { useCallback, useEffect, useRef, useState } from "react";
import { loadFollowUp } from "../../../api/services/ems/emsFollowUpService";
import { FollowUpFilterType, FollowUpType } from "../../../types/followUp.type";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { resizerMovement } from "../../../util/appUtil";
import EmsFollowupContainer from "../../../containers/Ems/EmsFollowupContainer";
import EMSMainLayoutResizer from "../EmsLayout/EMSMainLayoutResizer";
import EmsFollowUpRecommendationsContainer from "../../../containers/Ems/EmsFollowUpRecommendationsContainer";
import EmsFollowupToolbar from "./EmsFollowupToolbar";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

interface EmsFollowUpPageProps {}

const StyledDetailWrapper = styled(Box)({
  height: "100%",
  display: "flex",
  boxSizing: "border-box",
  minWidth: "0px",
  flexDirection: "column",
});

const StyledMainGrid = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  minWidth: "0px",
});

const StyledContent = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  minWidth: "0px",
});

const StyledRoot = styled(Box)({
  width: "250px",
  minWidth: "250px",
  height: "100%",
  transition: "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
});

const StyledWrapper = styled(Box)({
  height: "100%",
  display: "flex",
  boxSizing: "border-box",
  minWidth: "0px",
  overflow: "hidden",
});

const EmsFollowUpPage: React.FC<EmsFollowUpPageProps> = ({}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [isRecommendationOpen, setIsRecommendationOpen] =
    useState<boolean>(true);
  const [selectedFollowUpRow, setSelectedFollowUpRow] =
    useState<FollowUpType | null>(null);
  const [filters, setFilters] = useState<FollowUpFilterType>({});

  //FollowUp states
  const [followUpData, setFollowUpData] = useState<FollowUpType[]>([]);
  const [followUpLoading, setFollowUpLoading] = useState<boolean>(true);
  const [followUpPagingPage, setFollowUpPagingPage] = useState(1);
  const [followUpPagingLimit, setFollowUpPagingLimit] = useState(25);
  const [followUpDataLength, setFollowUpDataLength] = useState(0);

  useEffect(() => {
    initFollowUpData(filters);
  }, []);

  const initFollowUpData = (filters: FollowUpFilterType): void => {
    setFollowUpLoading(true);
    loadFollowUp(
      {
        ...filters,
        searchIn: filters.searchIn ?? "FOLLOWUP",
      },
      followUpPagingPage,
      followUpPagingLimit
    )
      .then((res) => {
        const resData = res.data;
        setFollowUpDataLength(resData.totalResults);
        const data: FollowUpType[] = resData.list.map((item) => ({
          ...item,
        }));
        setFollowUpData(data);
        setFollowUpLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setFollowUpLoading(false);
      });
  };

  //resizer logic
  const isMouseDownRef = useRef(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    resizerMovement(isMouseDownRef.current, event.clientX, resizerRef);
  };

  const onFilterClick = (filters: FollowUpFilterType) => {
    initFollowUpData(filters);
    setFilters(filters);
  };

  const onFilterCallback = useCallback(onFilterClick, [filters]);

  return (
    <StyledDetailWrapper
      onMouseMove={handleMouseMove}
      ref={mainContainerRef}
      data-testid={"follow-up-page"}
    >
      <EmsFollowupToolbar
        filters={filters}
        onFilterClick={onFilterCallback}
        setSelectedFollowUpRow={setSelectedFollowUpRow}
      />
      <StyledWrapper>
        <StyledMainGrid>
          <StyledContent>
            <EmsFollowupContainer
              selectedFollowUpRow={selectedFollowUpRow}
              setSelectedFollowUpRow={setSelectedFollowUpRow}
              followUpData={followUpData}
              setData={setFollowUpData}
              loading={followUpLoading}
              followUpDataLength={followUpDataLength}
              setFollowUpPagingPage={setFollowUpPagingPage}
              followUpPagingPage={followUpPagingPage}
              setFollowUpPagingLimit={setFollowUpPagingLimit}
              followUpPagingLimit={followUpPagingLimit}
              setLoading={setFollowUpLoading}
              onRefreshClick={initFollowUpData}
            />
          </StyledContent>
        </StyledMainGrid>
        {isRecommendationOpen && (
          <EMSMainLayoutResizer
            isMouseDownRef={isMouseDownRef}
            resizerRef={resizerRef}
            menuRef={menuRef}
            mainContainerRef={mainContainerRef}
            minWidth={150}
            position={"right"}
            setIsMenuOpen={setIsRecommendationOpen}
          />
        )}
        <StyledRoot
          ref={menuRef}
          style={{
            width: isRecommendationOpen ? "800px" : "30px",
            backgroundColor: isRecommendationOpen ? "inherit" : "#157fcc",
          }}
        >
          <EmsFollowUpRecommendationsContainer
            selectedRowId={selectedFollowUpRow ? selectedFollowUpRow.id : null}
            filters={filters}
            isRecommendationOpen={isRecommendationOpen}
            setIsRecommendationOpen={setIsRecommendationOpen}
          />
        </StyledRoot>
      </StyledWrapper>
    </StyledDetailWrapper>
  );
};

export default EmsFollowUpPage;
