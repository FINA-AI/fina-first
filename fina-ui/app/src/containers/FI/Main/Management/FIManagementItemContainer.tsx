import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  addFiManagement,
  getFiManagementById,
  getFiManagementHistory,
  loadFiManagement,
} from "../../../../api/services/fi/fiManagementService";
import FIManagementItemPage from "../../../../components/FI/Main/Detail/Management/Item/FIManagementItemPage";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { setFiManagementLoadingAction } from "../../../../redux/actions/fiPhysicalPersonActions";
import {
  changeFIManagementPagingLimitAction,
  changeFIManagementPagingPageAction,
  changeFIManagementTypeLoadAction,
} from "../../../../redux/actions/fiManagementActions";
import { loadManagementTypes } from "../../../../api/services/fi/fiManagementTypeService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { loadPaths } from "../../../../api/services/regionService";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";
import { SaveIcon } from "../../../../api/ui/icons/SaveIcon";
import { FORM_STATE } from "../../../../components/common/Detail/DetailForm";
import { ITEM_TYPE } from "../../../../components/common/Detail/DetailItem";
import {
  FiManagementType,
  ManagementDataType,
  RecommendationDataType,
} from "../../../../types/fi.type";
import { CountryDataTypes } from "../../../../types/common.type";
import { CancelIcon } from "../../../../api/ui/icons/CancelIcon";

interface FIManagementItemContainerProps {
  tabName: string;
  isFiManagementLoading: boolean;
  setFiManagementLoading: (loading: boolean) => void;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  fiManagementType: FiManagementType;
  setFIManagementType: (type: FiManagementType) => void;
}

interface RouteParams {
  id: string;
  managementTypeId: string;
  managementItemId: string;
}

export interface OriginalCommitteeDataType {
  name: string;
  position: string;
  electionDate: string;
  approvalDate: string;
  comment: string;
  errors: {
    name: boolean;
    position: boolean;
  };
}

const FIManagementItemContainer: React.FC<FIManagementItemContainerProps> = ({
  tabName,
  isFiManagementLoading,
  setFiManagementLoading,
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  fiManagementType,
  setFIManagementType,
}) => {
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  const { t } = useTranslation();
  let query = useQuery();
  const history = useHistory();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { id, managementTypeId, managementItemId } = useParams<RouteParams>();
  const [currentManagementGeneralInfo, setCurrentManagementGeneralInfo] =
    useState<ManagementDataType>({} as ManagementDataType);
  const [originalManagementGenInfo, setOriginalManagementGenInfo] =
    useState<ManagementDataType>();
  const [originalCommitteeList, setOriginalCommitteetList] = useState<
    OriginalCommitteeDataType[]
  >([]);
  const [management, setManagement] = useState<ManagementDataType[]>([]);
  const [managementLength, setManagementLength] = useState(0);
  const [managementType, setManagementType] =
    useState<FiManagementType>(fiManagementType);
  const [regions, setRegions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [activeEditBtn, setActiveEditBtn] = useState({
    mainInfoEditDisabled: query.get("addComitete") === "true",
    comiteteInfoEditDisabled: query.get("edit") === "true",
  });
  const [generalEditModeOpen, setGeneralEditModeOpen] = useState(
    query.get("edit") === "true"
  );
  const [comiteteFormState, setComiteteFormState] = useState<string>(
    query.get("addComitete") === "true" ? FORM_STATE.ADD : FORM_STATE.VIEW
  );
  const [
    isChangeManagementWarningModallOpen,
    setChangeManagementWarningModallOpen,
  ] = useState(false);
  const [personWarningModalOpen, setPersonWarningModalOpen] = useState(false);
  const [nextManagementItemId, setNextManagementItemId] = useState<
    number | string | null
  >(null);
  const [comiteteOpen, setComiteteOpen] = useState(false);
  const [historyPagingPage, setHistoryPagingPage] = useState(1);
  const [historyPagingLimit, setHistoryPagingLimit] = useState(25);
  const [historyLength, setHistoryLength] = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (pagingLimit > 0) {
      getFIManagement(null);
    }
  }, [pagingLimit, pagingPage]);

  useEffect(() => {
    if (managementType === null) {
      loadManagementTypes()
        .then((res) => {
          let data = res.data;
          if (res.data) {
            for (let o of data) {
              if (o.id == managementTypeId) {
                setManagementType(o);
                setFIManagementType(o);
                break;
              }
            }
          }
          fetchRegions();
        })
        .catch((error) => {
          enqueueSnackbar(error.message, { variant: "error" });
        });
    }
  }, []);

  const getHistoryData = async () => {
    getFiManagementHistory(
      id,
      managementItemId,
      historyPagingPage,
      historyPagingLimit
    )
      .then((res) => {
        let data = res.data;
        if (data) {
          setHistoryList(data.list);
          setHistoryLength(data.totalResults);
        }
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const onFilterClick = (searchValue: string) => {
    if (
      !searchValue ||
      (searchValue &&
        searchValue.trim().length > 2 &&
        searchValue !== filterValue)
    ) {
      setFilterValue(searchValue);
      if (pagingPage > 1) {
        setPagingPage(1);
      } else {
        getFIManagement(searchValue);
      }
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onHistoryPagingLimitChange = (limit: number) => {
    setHistoryPagingPage(1);
    setHistoryPagingLimit(limit);
  };

  const fetchRegions = async () => {
    let res = await loadPaths();
    setRegions(
      res.data.map((e: CountryDataTypes) => ({ label: e.name, value: e.id }))
    );
  };

  const onCancel = () => {
    if (query.get("addComitete") === "true") {
      let managementItem = management.find(
        (item) => item.id === Number(managementItemId)
      );
      if (managementItem)
        managementItem.committeeList = managementItem.committeeList.splice(1);
      history.push(
        `/fi/${currentManagementGeneralInfo.fiId}/${tabName}/${fiManagementType.id}/${managementItemId}`
      );
    }
  };

  const onSave = () => {
    if (query.get("addComitete") === "true") {
      history.push(
        `/fi/${currentManagementGeneralInfo.fiId}/${tabName}/${fiManagementType.id}/${managementItemId}`
      );
    }
  };

  const setCurrentManagementGeneralInfoFunction = (
    managementItem: ManagementDataType
  ) => {
    const addMode = query.get("addComitete") === "true";

    if (addMode) {
      managementItem.committeeList = [
        { name: "" },
        ...managementItem.committeeList,
      ];
    }
    setCurrentManagementGeneralInfo(managementItem);
    setOriginalManagementGenInfo(managementItem);
    const committeeList = JSON.parse(
      JSON.stringify(managementItem.committeeList)
    );
    setOriginalCommitteetList(addMode ? committeeList.slice(1) : committeeList);
  };

  const getFIManagement = (searchValue: string | null) => {
    setFiManagementLoading(true);
    loadFiManagement(
      pagingPage,
      pagingLimit,
      id,
      managementTypeId,
      searchValue ?? filterValue
    )
      .then((res) => {
        const data = res.data;
        if (data) {
          setManagementLength(data.totalResults);
          setManagement(data.list);
        }
        let managementItem = data.list.find(
          (item: ManagementDataType) => item.id == Number(managementItemId)
        );
        if (managementItem) {
          setCurrentManagementGeneralInfoFunction(managementItem);
        } else {
          setCurrentManagementGeneralInfo({} as ManagementDataType);
        }
        setFiManagementLoading(false);
      })
      .catch((error) => {
        setFiManagementLoading(false);
        enqueueSnackbar(error.message || error, { variant: "error" });
      });
  };

  const getFiManagement = async (id: number | string) => {
    let res = await getFiManagementById(id);
    setCurrentManagementGeneralInfo(res.data);
  };

  const saveInfo = async (data: ManagementDataType) => {
    const managementModelId = data?.managementModel?.id ?? managementTypeId;

    await addFiManagement(id, managementModelId, data)
      .then((res) => {
        setManagement(
          management.map((m) =>
            m.id === res.data.id
              ? { ...m, committeeList: res.data.committeeList }
              : m
          )
        );
        setCurrentManagementGeneralInfo(res.data);
        setComiteteFormState(FORM_STATE.VIEW);
        setActiveEditBtn({
          mainInfoEditDisabled: false,
          comiteteInfoEditDisabled: false,
        });
        setGeneralEditModeOpen(false);
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const generalSaveFunction = async (data?: ManagementDataType) => {
    let managementItem = data ? data : currentManagementGeneralInfo;
    let newCommitteList = [];
    for (let cimmitteItem of managementItem.committeeList) {
      if (cimmitteItem.name && cimmitteItem.position) {
        newCommitteList.push(cimmitteItem);
      }
    }
    managementItem.committeeList = newCommitteList;
    await saveInfo(managementItem);
  };

  const onConfirm = () => {
    generalSaveFunction();
    setConfirmOpen(false);
  };

  const changeManagementItemFunction = (manId?: number | string) => {
    let managementId = manId ?? nextManagementItemId;
    if (managementId === null) {
      return;
    }
    getFiManagement(managementId);
    setGeneralEditModeOpen(false);
    history.push(`/fi/${id}/management/${managementTypeId}/${managementId}`);
  };

  const changeManagementItem = (management: ManagementDataType) => {
    setNextManagementItemId(management.id);
    if (currentManagementGeneralInfo.id !== management.id) {
      if (
        activeEditBtn.mainInfoEditDisabled ||
        activeEditBtn.comiteteInfoEditDisabled
      ) {
        setChangeManagementWarningModallOpen(true);
      } else {
        changeManagementItemFunction(management.id);
      }
    }
  };

  const confirmNextPersonOpen = async () => {
    setActiveEditBtn({
      mainInfoEditDisabled: false,
      comiteteInfoEditDisabled: false,
    });
    await changeManagementItemFunction();
    setGeneralEditModeOpen(true);
    setComiteteFormState(FORM_STATE.VIEW);
    setGeneralEditModeOpen(false);
  };

  const openPhysicalPersonFunction = () => {
    const personId = currentManagementGeneralInfo.person?.id;
    if (personId) {
      history.push(`/configuration/physicalperson/${personId}`);
    }
  };

  const openPhysicalPerson = (row: ManagementDataType) => {
    if (row.fiPersonId && row.fiPersonId !== 0) {
      if (
        activeEditBtn.mainInfoEditDisabled ||
        activeEditBtn.comiteteInfoEditDisabled
      ) {
        setPersonWarningModalOpen(true);
      } else {
        openPhysicalPersonFunction();
      }
    }
  };

  const shareFormItems = [
    { name: t("company"), dataIndex: "company", type: ITEM_TYPE.STRING },
    {
      name: t("sharePercentage"),
      dataIndex: "sharePercentage",
      type: ITEM_TYPE.NUMBER,
    },
    { name: t("shareDate"), dataIndex: "shareDate", type: ITEM_TYPE.DATE },
    {
      name: t("country"),
      dataIndex: "country",
      type: ITEM_TYPE.COUNTRIES,
    },
  ];
  const recommendationFormItems = [
    {
      name: t("recommender"),
      dataIndex: "recommender",
      type: ITEM_TYPE.OBJECT,
      renderCell: (obj: RecommendationDataType) => {
        return obj.recommender.name;
      },
    },
    {
      name: t("identificationNumber"),
      dataIndex: "identificationNumber",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("passportNumber"),
      dataIndex: "passportNumber",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("recommendationDate"),
      dataIndex: "recommendationDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("recommenderWorkspace"),
      dataIndex: "recommenderWorkspace",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("cooperationPlace"),
      dataIndex: "cooperationPlace",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("phone"),
      dataIndex: "phone",
      type: ITEM_TYPE.STRING,
    },
  ];
  const educationFormItems = [
    {
      name: t("instituteName"),
      dataIndex: "instituteName",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("academicDegreeLevel"),
      dataIndex: "academicDegreeLevel",
      type: ITEM_TYPE.LIST,
      listData: [
        { label: t("BACHELOR"), value: "BACHELOR" },
        { label: t("MASTER"), value: "MASTER" },
        { label: t("SPECIALIST_DEGREE"), value: "SPECIALIST_DEGREE" },
        { label: t("PHD"), value: "PHD" },
      ],
    },
    {
      name: t("speciality"),
      dataIndex: "speciality",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("completeCourseName"),
      dataIndex: "completeCourseName",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("seminarOrganizer"),
      dataIndex: "seminarOrganizer",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("trainingPlace"),
      dataIndex: "trainingPlace",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("completionDate"),
      dataIndex: "completionDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("certificates"),
      dataIndex: "certificates",
      type: ITEM_TYPE.LIST,
      listData: [
        { label: t("yes"), value: true },
        { label: t("no"), value: false },
      ],
    },
    {
      name: t("supportDocuments"),
      dataIndex: "supportDocuments",
      type: ITEM_TYPE.STRING,
    },
  ];
  const criminalRecordFormItems = [
    {
      name: t("courtDecisionNumber"),
      dataIndex: "courtDecisionNumber",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("courtDecisionDate"),
      dataIndex: "courtDecisionDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("courtDecision"),
      dataIndex: "courtDecision",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("punishmentDate"),
      dataIndex: "punishmentDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("criminalType"),
      dataIndex: "type",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("fineAmount"),
      dataIndex: "fineAmount",
      type: ITEM_TYPE.NUMBER,
    },
    {
      name: t("punishmentStartDate"),
      dataIndex: "punishmentStartDate",
      type: ITEM_TYPE.DATE,
    },
  ];
  const positionsFormItems = [
    {
      name: t("companyName"),
      dataIndex: "companyName",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("position"),
      dataIndex: "position",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("electionDate"),
      dataIndex: "electionDate",
      type: ITEM_TYPE.DATE,
    },
  ];

  const comiteteFormItems = [
    {
      name: t("typeOfCommittee"),
      dataIndex: "name",
      type: ITEM_TYPE.STRING,
      required: true,
    },
    {
      name: t("position"),
      dataIndex: "position",
      type: ITEM_TYPE.STRING,
      required: true,
    },
    {
      name: t("dateOfElection"),
      dataIndex: "electionDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("managementFielddateOfApproval"),
      dataIndex: "approvalDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("comment"),
      dataIndex: "comment",
      type: ITEM_TYPE.STRING,
    },
  ];

  return (
    <>
      <FIManagementItemPage
        onFilter={onFilterClick}
        filterValue={filterValue}
        pagingPage={pagingPage}
        pagingLimit={pagingLimit}
        managementLength={managementLength}
        onPagingLimitChange={onPagingLimitChange}
        setPagingPage={setPagingPage}
        loading={isFiManagementLoading}
        management={management}
        tabName={tabName}
        changeManagementItem={changeManagementItem}
        openPhysicalPerson={openPhysicalPerson}
        fiManagementType={managementType}
        regions={regions}
        setCurrentManagementGeneralInfo={setCurrentManagementGeneralInfo}
        currentManagementGeneralInfo={currentManagementGeneralInfo}
        setConfirmOpen={setConfirmOpen}
        activeEditBtn={activeEditBtn}
        setActiveEditBtn={setActiveEditBtn}
        generalEditModeOpen={generalEditModeOpen}
        setGeneralEditModeOpen={setGeneralEditModeOpen}
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
        generalSaveFunction={generalSaveFunction}
        setCancelOpen={setCancelOpen}
        onCancel={onCancel}
        onSave={onSave}
        originalCommitteeList={originalCommitteeList}
        setOriginalCommitteetList={setOriginalCommitteetList}
        historyPagingPage={historyPagingPage}
        setHistoryPagingPage={setHistoryPagingPage}
        historyPagingLimit={historyPagingLimit}
        onHistoryPagingLimitChange={onHistoryPagingLimitChange}
        getHistoryData={getHistoryData}
        historyList={historyList}
        historyLength={historyLength}
        originalManagementGenInfo={originalManagementGenInfo}
      />
      <ConfirmModal
        isOpen={isCancelOpen}
        setIsOpen={setCancelOpen}
        onConfirm={() => {
          setGeneralEditModeOpen(false);
          setActiveEditBtn({
            mainInfoEditDisabled: false,
            comiteteInfoEditDisabled: false,
          });
          setComiteteFormState(FORM_STATE.VIEW);
          setCancelOpen(false);
        }}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancelHeaderText")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        onConfirm={onConfirm}
        confirmBtnTitle={t("save")}
        headerText={t("saveHeaderText")}
        bodyText={t("saveBodyText")}
        additionalBodyText={t("changes")}
        icon={<SaveIcon />}
      />
      <ConfirmModal
        isOpen={isChangeManagementWarningModallOpen}
        setIsOpen={setChangeManagementWarningModallOpen}
        onConfirm={() => {
          confirmNextPersonOpen();
          setChangeManagementWarningModallOpen(false);
        }}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
      <ConfirmModal
        isOpen={personWarningModalOpen}
        setIsOpen={setPersonWarningModalOpen}
        onConfirm={() => {
          openPhysicalPersonFunction();
          setPersonWarningModalOpen(false);
        }}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  isFiManagementLoading: state.getIn([
    "fiPhysicalPerson",
    "isFiManagementLoading",
  ]),
  pagingPage: state.get("fiManagement").pagingPage,
  pagingLimit: state.get("fiManagement").pagingLimit,
  fiManagementType: state.get("fiManagement").fiManagementType,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFiManagementLoading: bindActionCreators(
    setFiManagementLoadingAction,
    dispatch
  ),
  setPagingPage: bindActionCreators(
    changeFIManagementPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changeFIManagementPagingLimitAction,
    dispatch
  ),
  setFIManagementType: bindActionCreators(
    changeFIManagementTypeLoadAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FIManagementItemContainer);
