import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import { SaveIcon } from "../../../api/ui/icons/SaveIcon";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import CEMSSanctionInnerPageHeader from "./CEMSSanctionInnerPageHeader";
import CEMSSanctionDetailsInfo from "./CEMSSanctionDetailsInfo";
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

const CEMSSanctionInnerPage = ({
  originalData,
  onSave,
  data,
  onChangeData,
  isEditMode,
  setIsEditMode,
  onDelete,
  fi,
}) => {
  const { t } = useTranslation();
  const { inspectionId, sanctionId } = useParams();
  const history = useHistory();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const saveRecommendationHandler = () => {
    onSave();
    setIsSaveModalOpen(false);
  };

  const cancelModalHandler = () => {
    setIsCancelModalOpen(false);

    data = { ...originalData };
    setIsEditMode(false);
    if (sanctionId == 0) {
      history.push(`/${CEMS_BASE_PATH}/inspection/${inspectionId}/sanction/`);
    }
  };

  return (
    <StyledRootBox>
      <CEMSSanctionInnerPageHeader
        data={data}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        setIsCancelModalOpen={setIsCancelModalOpen}
        setIsSaveModalOpen={setIsSaveModalOpen}
        onDelete={onDelete}
        fi={fi}
      />
      <StyledMainBox>
        <CEMSSanctionDetailsInfo
          data={data}
          originalData={originalData}
          isEditMode={isEditMode}
          emsRecommendationDetails={originalData}
          onChangeData={onChangeData}
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

CEMSSanctionInnerPage.propTypes = {
  isEditMode: PropTypes.bool,
  setData: PropTypes.func,
  setIsEditMode: PropTypes.func,
  data: PropTypes.object,
  onSave: PropTypes.func,
  originalData: PropTypes.object,
  onChangeData: PropTypes.func,
  onDelete: PropTypes.func,
  fi: PropTypes.object,
};

export default CEMSSanctionInnerPage;
