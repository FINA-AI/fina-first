import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import ToolbarListSearch from "../../../../../Catalog/MiniCatalog/ListSearch";
import MiniPaging from "../../../../../common/Paging/MiniPaging";
import { useParams } from "react-router-dom";
import FIManagementItemCustomList from "./FIManagementItemCustomList";
import FIManagementItemPageHeader from "./FIManagementItemPageHeader";
import FiManagementListSkeleton from "../../../../Skeleton/FiManagement/FiManagementListSkeleton";
import FIManagementItemPageGeneralInfo from "./FIManagementItemPageGeneralInfo";
import FIManagementItemSkeleton from "../../../../Skeleton/FiManagement/FiManagmentItemSkeleton";
import React, { useState } from "react";
import FiHistoryBar from "../../License/History/FiHistoryBar";
import { styled } from "@mui/material/styles";
import {
  BranchStepType,
  FiManagementType,
  ManagementDataType,
  RecommendationDataType,
} from "../../../../../../types/fi.type";
import { OriginalCommitteeDataType } from "../../../../../../containers/FI/Main/Management/FIManagementItemContainer";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  borderRadius: "8px",
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledContentContainer = styled(Grid)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
}));

const StyledLeftContainer = styled(Grid)(({ theme }: any) => ({
  height: "100%",
  borderRight: theme.palette.borderColor,
}));

const StyledDrawerContainer = styled(Box)({
  height: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
});

const StyledPagesBox = styled(Box)(({ theme }: any) => ({
  bottom: "0",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  borderBottomLeftRadius: "8px",
  ...theme.pagingPage,
}));

const StyledHistoryContainer = styled(Box)({
  width: 350,
  height: "100%",
  position: "absolute",
  top: 0,
  right: 0,
  transitionDuration: "0.5s",
  zIndex: 99999,
  transition: "linear 1s",
});

const StyledRightGrid = styled(Grid)({
  height: "100%",
  position: "relative",
});

export interface FormItemsType {
  name: string;
  dataIndex: string;
  type: string;
  listData?: {
    label: string;
    value: string | boolean;
  }[];
  renderCell?: (obj: RecommendationDataType) => string;
  required?: boolean;
  steps?: BranchStepType[];
}

interface FIManagementItemPageProps {
  onFilter: (searchValue: string) => void;
  filterValue: string;
  pagingPage: number;
  pagingLimit: number;
  managementLength: number;
  onPagingLimitChange?: (limit: number) => void;
  setPagingPage: (page: number) => void;
  tabName: string;
  management: ManagementDataType[];
  loading?: boolean;
  changeManagementItem: (item: ManagementDataType) => void;
  openPhysicalPerson: (row: ManagementDataType) => void;
  fiManagementType: FiManagementType;
  regions: {
    label: string;
    value: number;
  }[];
  currentManagementGeneralInfo: ManagementDataType;
  setCurrentManagementGeneralInfo: (data: ManagementDataType) => void;
  setConfirmOpen: (value: boolean) => void;
  activeEditBtn: {
    mainInfoEditDisabled: boolean;
    comiteteInfoEditDisabled: boolean;
  };
  setActiveEditBtn: React.Dispatch<
    React.SetStateAction<{
      mainInfoEditDisabled: boolean;
      comiteteInfoEditDisabled: boolean;
    }>
  >;
  generalEditModeOpen: boolean;
  setGeneralEditModeOpen: (value: boolean) => void;
  comiteteFormState: string;
  setComiteteFormState: React.Dispatch<React.SetStateAction<string>>;
  comiteteOpen: boolean;
  setComiteteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shareFormItems: FormItemsType[];
  recommendationFormItems: FormItemsType[];
  educationFormItems: FormItemsType[];
  criminalRecordFormItems: FormItemsType[];
  positionsFormItems: FormItemsType[];
  comiteteFormItems: FormItemsType[];
  generalSaveFunction: (data?: ManagementDataType) => void;
  setCancelOpen: (value: boolean) => void;
  onCancel: () => void;
  onSave: () => void;
  originalCommitteeList: OriginalCommitteeDataType[];
  setOriginalCommitteetList: React.Dispatch<
    React.SetStateAction<OriginalCommitteeDataType[]>
  >;
  historyPagingPage: number;
  setHistoryPagingPage: (value: number) => void;
  historyPagingLimit: number;
  onHistoryPagingLimitChange?: (limit: number) => void;
  getHistoryData: () => void;
  historyList: any[];
  historyLength: number;
  originalManagementGenInfo?: ManagementDataType;
}

const FIManagementItemPage: React.FC<FIManagementItemPageProps> = ({
  onFilter,
  filterValue,
  pagingPage,
  pagingLimit,
  managementLength,
  setPagingPage,
  tabName,
  management,
  loading,
  changeManagementItem,
  openPhysicalPerson,
  fiManagementType,
  regions,
  currentManagementGeneralInfo,
  setCurrentManagementGeneralInfo,
  setConfirmOpen,
  activeEditBtn,
  setActiveEditBtn,
  generalEditModeOpen,
  setGeneralEditModeOpen,
  comiteteFormState,
  setComiteteFormState,
  comiteteOpen,
  setComiteteOpen,
  shareFormItems,
  recommendationFormItems,
  educationFormItems,
  criminalRecordFormItems,
  positionsFormItems,
  comiteteFormItems,
  generalSaveFunction,
  setCancelOpen,
  onCancel,
  onSave,
  originalCommitteeList,
  setOriginalCommitteetList,
  historyPagingPage,
  setHistoryPagingPage,
  historyPagingLimit,
  onHistoryPagingLimitChange,
  getHistoryData,
  historyList,
  historyLength,
  originalManagementGenInfo,
}) => {
  const { id, managementItemId } = useParams<{
    id: string;
    managementItemId: string;
  }>();
  const [newManagementGeneralInfo, setNewManagementGeneralInfo] = useState(
    currentManagementGeneralInfo
  );
  const [hasStatus, setHasStatus] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);
  const [isHistoryBarOpen, setHistoryBarOpen] = useState(false);

  const historyModeHandler = (item: any) => {
    item && setHistoryMode(true);
  };

  const ItemLeftSide = () => {
    return (
      <StyledDrawerContainer>
        <div>
          <ToolbarListSearch
            onFilter={onFilter}
            filterValue={filterValue}
            to={`/fi/${id}/${tabName}`}
            height={55}
          />
        </div>
        <div style={{ height: "100%", overflow: "auto" }}>
          {loading ? (
            <FiManagementListSkeleton listItemCount={8} />
          ) : (
            <FIManagementItemCustomList
              onSelect={(item) => changeManagementItem(item)}
              data={management}
              itemId={managementItemId}
            />
          )}
        </div>
        <StyledPagesBox>
          <MiniPaging
            totalNumOfRows={managementLength}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPagesBox>
      </StyledDrawerContainer>
    );
  };

  return (
    <StyledRoot>
      <StyledContentContainer container>
        <StyledLeftContainer item xs={2}>
          {ItemLeftSide()}
        </StyledLeftContainer>
        <StyledRightGrid
          item
          xs={10}
          paddingBottom={loading ? "350px" : "80px"}
        >
          {loading ? (
            <FIManagementItemSkeleton />
          ) : (
            <>
              <StyledHistoryContainer
                style={{
                  transform: isHistoryBarOpen
                    ? "translate(0)"
                    : "translate(350px)",
                }}
              >
                <FiHistoryBar
                  setHistoryBarOpen={setHistoryBarOpen}
                  historyPagingPage={historyPagingPage}
                  setHistoryPagingPage={setHistoryPagingPage}
                  historyPagingLimit={historyPagingLimit}
                  onHistoryPagingLimitChange={onHistoryPagingLimitChange}
                  historyModeHandler={historyModeHandler}
                  historyList={historyList}
                  historyLength={historyLength}
                  setHistoryData={setCurrentManagementGeneralInfo}
                />
              </StyledHistoryContainer>
              <FIManagementItemPageHeader
                openPhysicalPerson={openPhysicalPerson}
                activeEditBtn={activeEditBtn}
                setActiveEditBtn={setActiveEditBtn}
                currentManagementGeneralInfo={currentManagementGeneralInfo}
                setCurrentManagementGeneralInfo={
                  setCurrentManagementGeneralInfo
                }
                newManagementGeneralInfo={newManagementGeneralInfo}
                setConfirmOpen={setConfirmOpen}
                generalEditModeOpen={generalEditModeOpen}
                setGeneralEditModeOpen={setGeneralEditModeOpen}
                setNewManagementGeneralInfo={setNewManagementGeneralInfo}
                hasStatus={hasStatus}
                setCancelOpen={setCancelOpen}
                historyMode={historyMode}
                setHistoryMode={setHistoryMode}
                setHistoryBarOpen={setHistoryBarOpen}
                getHistoryData={getHistoryData}
                originalManagementGenInfo={originalManagementGenInfo}
              />
              <Box sx={{ height: "100%", borderRadius: "8px" }}>
                <FIManagementItemPageGeneralInfo
                  fiManagementType={fiManagementType}
                  editMode={generalEditModeOpen}
                  managementItem={currentManagementGeneralInfo}
                  setNewManagementGeneralInfo={setNewManagementGeneralInfo}
                  activeEditBtn={activeEditBtn}
                  setActiveEditBtn={setActiveEditBtn}
                  regions={regions}
                  comiteteFormState={comiteteFormState}
                  setComiteteFormState={setComiteteFormState}
                  comiteteOpen={comiteteOpen}
                  setComiteteOpen={setComiteteOpen}
                  shareFormItems={shareFormItems}
                  recommendationFormItems={recommendationFormItems}
                  educationFormItems={educationFormItems}
                  criminalRecordFormItems={criminalRecordFormItems}
                  positionsFormItems={positionsFormItems}
                  comiteteFormItems={comiteteFormItems}
                  setHasStatus={setHasStatus}
                  newManagementGeneralInfo={newManagementGeneralInfo}
                  generalSaveFunction={generalSaveFunction}
                  onCancel={onCancel}
                  onSave={onSave}
                  originalCommitteeList={originalCommitteeList}
                  setOriginalCommitteetList={setOriginalCommitteetList}
                />
              </Box>
            </>
          )}
        </StyledRightGrid>
      </StyledContentContainer>
    </StyledRoot>
  );
};

export default FIManagementItemPage;
