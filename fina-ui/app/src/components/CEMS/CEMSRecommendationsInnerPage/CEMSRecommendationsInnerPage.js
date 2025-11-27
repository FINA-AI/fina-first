import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import { SaveIcon } from "../../../api/ui/icons/SaveIcon";
import React, { useState } from "react";
import CEMSRecommendationsInnerPageHeader from "./CEMSRecommendationsInnerPageHeader";
import CEMSRecommendationDetailsPageInfo from "./CEMSRecommendationDetailsPageInfo";
import { useHistory, useParams } from "react-router-dom";
import { CEMS_BASE_PATH } from "../CEMSRouter";
import { styled } from "@mui/material/styles";
import { CancelIcon } from "../../../api/ui/icons/CancelIcon";

const StyledRootBox = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: theme.palette.paperBackground,
  borderRadius: 8,
  boxSizing: "border-box",
  paddingBottom: 20,
  minHeight: 1,
}));

const StyledMainBox = styled(Box)({
  overflowY: "auto",
  overflowX: "hidden",
  padding: "10px 16px 10px  16px",
});

const CEMSRecommendationsInnerPage = ({
  data,
  setData,
  onRecommendationSave,
  emsRecommendationDetails,
  updateChild,
  onChangeEmsRecommendationDetails,
  originalData,
  isEditMode,
  setIsEditMode,
  deleteRecommendation,
  getRecommendationHistory,
  recommendationHistory,
  fi,
}) => {
  const { t } = useTranslation();
  let { recommendationId } = useParams();
  const { inspectionId } = useParams();
  const history = useHistory();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const saveRecommendationHandler = () => {
    onRecommendationSave();
    setIsSaveModalOpen(false);
  };

  const cancelModalHandler = () => {
    setIsCancelModalOpen(false);
    setIsEditMode(false);
    setData({ ...originalData });
    emsRecommendationDetails.current = { ...originalData };
    if (recommendationId == 0) {
      history.push(
        `/${CEMS_BASE_PATH}/inspection/${inspectionId}/recommendation/`
      );
    }
  };

  return (
    <StyledRootBox>
      <CEMSRecommendationsInnerPageHeader
        data={data}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        setIsCancelModalOpen={setIsCancelModalOpen}
        setIsSaveModalOpen={setIsSaveModalOpen}
        onRecommendationSave={onRecommendationSave}
        deleteRecommendation={deleteRecommendation}
        fi={fi}
      />
      <StyledMainBox>
        <CEMSRecommendationDetailsPageInfo
          data={data}
          setData={setData}
          isEditMode={isEditMode}
          emsRecommendationDetails={emsRecommendationDetails}
          updateChild={updateChild}
          onChangeEmsRecommendationDetails={onChangeEmsRecommendationDetails}
          getRecommendationHistory={getRecommendationHistory}
          recommendationHistory={recommendationHistory}
        />
      </StyledMainBox>
      {isCancelModalOpen && (
        <ConfirmModal
          isOpen={isCancelModalOpen}
          setIsOpen={setIsCancelModalOpen}
          onConfirm={cancelModalHandler}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />
      )}
      {isSaveModalOpen && (
        <ConfirmModal
          isOpen={isSaveModalOpen}
          setIsOpen={setIsSaveModalOpen}
          onConfirm={saveRecommendationHandler}
          confirmBtnTitle={t("save")}
          headerText={t("saveHeaderText")}
          bodyText={t("saveBodyText")}
          icon={<SaveIcon />}
          saveButtonColor={"#289E20"}
        />
      )}
    </StyledRootBox>
  );
};

CEMSRecommendationsInnerPage.propTypes = {
  isEditMode: PropTypes.bool,
  setData: PropTypes.func,
  setIsEditMode: PropTypes.func,
  data: PropTypes.object,
  onRecommendationSave: PropTypes.func,
  emsRecommendationDetails: PropTypes.object,
  updateChild: PropTypes.func,
  onChangeEmsRecommendationDetails: PropTypes.func,
  originalData: PropTypes.object,
  deleteRecommendation: PropTypes.func,
  getRecommendationHistory: PropTypes.func,
  recommendationHistory: PropTypes.array,
  fi: PropTypes.object,
};

export default CEMSRecommendationsInnerPage;
