import FIBeneficiaryItem from "../../../../components/FI/Main/Detail/Beneficiary/Item/FIBeneficiaryItem";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import {
  changeFIBeneficiaryPagingLimitAction,
  changeFIBeneficiaryPagingPageAction,
} from "../../../../redux/actions/fiBeneficiaryActions";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  getBeneficiaryById,
  loadBeneficiaries,
  saveBeneficiary,
  updateBeneficiary,
} from "../../../../api/services/fi/fiBeneficiaryService";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getAllLegalPersonSimple } from "../../../../api/services/fi/fiLegalPersonService";
import { loadAllPersons } from "../../../../api/services/fi/fiPersonService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import InfoModal from "../../../../components/common/Modal/InfoModal";
import { CheckListIcon } from "../../../../api/ui/icons/CheckListIcon";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";
import menuLink from "../../../../api/ui/menuLink";
import { FITabs } from "../../../../components/FI/fiTabs";
import { BeneficiariesDataType } from "../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import { CancelIcon } from "../../../../api/ui/icons/CancelIcon";

interface FIBeneficiaryItemContainerProps {
  tabName: string;
  pagingPage: number;
  pagingLimit: number;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
}

interface RouteParams {
  id: string;
  beneficiaryItemId: string;
}

const FIBeneficiaryItemContainer: React.FC<FIBeneficiaryItemContainerProps> = ({
  tabName,
  pagingPage,
  pagingLimit,
  setPagingPage,
  setPagingLimit,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  let { id, beneficiaryItemId } = useParams<RouteParams>();
  const history = useHistory();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [beneficiaries, setBeneficiaries] = useState<BeneficiariesDataType[]>(
    []
  );
  const [beneficiariesLength, setBeneficiariesLength] = useState<number>(0);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<
    BeneficiariesDataType | undefined
  >();
  const [originalSelectedBeneficiary, setOriginalSelectedBeneficiary] =
    useState<BeneficiariesDataType | undefined>();
  const [listLoading, setListLoading] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [isPercentageInfoModalOpen, setPercentageInfoModalOpen] =
    useState(false);
  const [physicalPersons, setPhysicalPersons] = useState<
    PhysicalPersonDataType[]
  >([]);
  const [legalPersons, setLegalPersons] = useState<LegalPersonDataType[]>([]);
  const [isCancelForBeneficiaryChangeOpen, setCancelForBeneficiaryChangeOpen] =
    useState(false);
  const [clickedRow, setClickedRow] = useState<
    BeneficiariesDataType | undefined
  >();
  const [filterValue, setFilterValue] = useState<string>();
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  const [generalInfoEditMode, setGeneralInfoEditMode] = useState<boolean>(
    Boolean(eval(query.get("addNew") || "false")) ||
      Boolean(eval(query.get("edit") || "false"))
  );

  useEffect(() => {
    getAllLegalPersonsData();
    getAllPhysicalPersonsData();
  }, []);

  useEffect(() => {
    if (selectedBeneficiary?.id)
      getBeneficiaryByIdFunction(selectedBeneficiary);
  }, [selectedBeneficiary?.id]);

  useEffect(() => {
    if (pagingLimit > 0) {
      loadFIBeneficiaries(undefined, filterValue);
    }
  }, [pagingLimit, pagingPage]);

  const loadFIBeneficiaries = (
    selectedItemData?: BeneficiariesDataType,
    filterValue?: string
  ) => {
    setListLoading(true);
    loadBeneficiaries(id, pagingPage, pagingLimit, "ALL", filterValue)
      .then((res) => {
        if (res.data) {
          let updatedList = res.data.list.map(
            (item: BeneficiariesDataType) => ({
              ...item,
              finalBeneficiaries: item.finalBeneficiaries.map(
                (beneficiary) => ({
                  ...beneficiary,
                  physicalPerson: beneficiary.person,
                })
              ),
            })
          );
          if (selectedItemData) {
            let tmp = {
              ...selectedItemData,
              physicalPerson: selectedItemData.person,
            };
            setSelectedBeneficiary(tmp);
            setOriginalSelectedBeneficiary(tmp);
          }
          let currentSelected =
            originalSelectedBeneficiary ??
            updatedList.find(
              (item: BeneficiariesDataType) =>
                item.id === Number(beneficiaryItemId)
            );

          if (currentSelected) {
            currentSelected = {
              ...currentSelected,
              physicalPerson: currentSelected?.physicalPerson,
            };
            setSelectedBeneficiary(currentSelected);
            setOriginalSelectedBeneficiary(currentSelected);
          }

          if (updatedList.length === 0 && currentSelected) {
            updatedList = [currentSelected];
          }

          if (
            currentSelected &&
            !updatedList.some(
              (item: BeneficiariesDataType) => item.id === currentSelected.id
            )
          ) {
            updatedList = [currentSelected, ...updatedList];
          }

          setBeneficiaries(updatedList);
          setBeneficiariesLength(updatedList.length);
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      })
      .finally(() => setListLoading(false));
  };

  const onFilter = (searchValue: string) => {
    if (!searchValue || (searchValue && searchValue.trim().length > 2)) {
      setFilterValue(searchValue);

      if (pagingPage > 1) {
        setPagingPage(1);
      } else {
        loadFIBeneficiaries(undefined, searchValue);
      }
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const getAllFILegalPersons = () => {
    setLoading(true);
    getAllLegalPersonSimple()
      .then((res) => {
        const data = res.data;
        if (data) {
          setLegalPersons(data);
        }
        setLoading(false);
        return data;
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const getAllLegalPersonsData = () => {
    if (legalPersons.length === 0) {
      getAllFILegalPersons();
    }
  };

  const getAllFIPhysicalPersons = () => {
    loadAllPersons(-1, -1, true)
      .then((res) => {
        const data = res.data;
        if (data) {
          setPhysicalPersons(data.list);
        }
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const getAllPhysicalPersonsData = () => {
    if (physicalPersons.length === 0) {
      getAllFIPhysicalPersons();
    }
  };

  const onSaveFunction = async (data: BeneficiariesDataType) => {
    setLoading(true);
    try {
      let res;
      if (data.id > 0) {
        res = await updateBeneficiary(id, data);
        if (res.data) {
          if (res.data.share === null) {
            setGeneralInfoEditMode(true);
          }

          let tmp = {
            ...res.data,
            finalBeneficiaries:
              res.data?.finalBeneficiaries.length > 0 ||
              (data.finalBeneficiaries?.length === 0 &&
                res.data?.finalBeneficiaries.length === 0)
                ? res.data?.finalBeneficiaries.map(
                    (item: BeneficiariesDataType) => {
                      return { ...item, physicalPerson: item.person };
                    }
                  )
                : selectedBeneficiary?.finalBeneficiaries,
            legalPerson: selectedBeneficiary?.legalPerson,
            physicalPerson: selectedBeneficiary?.physicalPerson,
          };

          setSelectedBeneficiary(tmp);
          setOriginalSelectedBeneficiary(tmp);
          enqueueSnackbar(t("beneficiaryEditSuccess"), { variant: "success" });
        }
      } else {
        res = await saveBeneficiary(id, data);
        if (res.data) {
          loadFIBeneficiaries(res.data);
          setSelectedBeneficiary(res.data);
          history.push(`/fi/${id}/${tabName}/${res.data.id}`);
          enqueueSnackbar(t("beneficiaryCreateSuccess"), {
            variant: "success",
          });
        }
      }
      return true;
    } catch (error: any) {
      const errorResp = error?.response?.data;
      if (errorResp?.code === "INVALID_VALUE") {
        setPercentageInfoModalOpen(true);
      } else {
        openErrorWindow(error, t("error"), true);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBeneficiaryByIdFunction = async (row: BeneficiariesDataType) => {
    if (row && row.id === Number(beneficiaryItemId)) {
      try {
        const beneficiary = await getBeneficiaryById(row.id);
        let tmp: any = {
          ...beneficiary.data,
          finalBeneficiaries: beneficiary.data.finalBeneficiaries.map(
            (item: any) => ({
              ...item,
              physicalPerson: item.person,
            })
          ),
        };
        setSelectedBeneficiary(tmp);
        setOriginalSelectedBeneficiary(tmp);
      } catch (err) {
        openErrorWindow(err, t("error"), true);
      }
    }
  };

  const onChangeClick = (row: BeneficiariesDataType) => {
    if (row.id !== selectedBeneficiary?.id && generalInfoEditMode) {
      setCancelForBeneficiaryChangeOpen(true);
      setClickedRow(row);
    } else changeBeneficiary(row);
  };

  const changeBeneficiary = (row: BeneficiariesDataType) => {
    if (row.id !== selectedBeneficiary?.id) {
      history.push(`/fi/${id}/${tabName}/${row?.id}`);
      setSelectedBeneficiary(row);
      setOriginalSelectedBeneficiary(row);
    }
  };

  const redirectMainPage = () => {
    history.push(`/fi/${id}/${tabName}`);
  };

  const openLegalPersonItemPage = (rowId: number) => {
    history.push(`${menuLink.configuration}/${FITabs.LEGALPERSON}/${rowId}`);
  };

  const openPhysicalPersonItemPage = (rowId: number) => {
    history.push(`${menuLink.configuration}/${FITabs.PHYSYCALPERSON}/${rowId}`);
  };

  return (
    <>
      <FIBeneficiaryItem
        tabName={tabName}
        pagingPage={pagingPage}
        pagingLimit={pagingLimit}
        beneficiariesLength={beneficiariesLength}
        onPagingLimitChange={onPagingLimitChange}
        setPagingPage={setPagingPage}
        beneficiaries={beneficiaries}
        listLoading={listLoading}
        selectedBeneficiary={selectedBeneficiary}
        fiId={id}
        beneficiaryItemId={beneficiaryItemId}
        onSaveFunction={onSaveFunction}
        changeSelectedRow={onChangeClick}
        legalPersons={legalPersons}
        physicalPersons={physicalPersons}
        redirectMainPage={redirectMainPage}
        openLegalPersonItemPage={openLegalPersonItemPage}
        openPhysicalPersonItemPage={openPhysicalPersonItemPage}
        generalInfoEditMode={generalInfoEditMode}
        setGeneralInfoEditMode={setGeneralInfoEditMode}
        setPhysicalPersons={setPhysicalPersons}
        setLegalPersons={setLegalPersons}
        loading={loading}
        setSelectedBeneficiary={setSelectedBeneficiary}
        setOriginalSelectedBeneficiary={setOriginalSelectedBeneficiary}
        originalSelectedBeneficiary={originalSelectedBeneficiary}
        onFilter={onFilter}
        filterValue={filterValue}
      />
      <ConfirmModal
        isOpen={isCancelForBeneficiaryChangeOpen}
        setIsOpen={setCancelForBeneficiaryChangeOpen}
        onConfirm={() => {
          setCancelForBeneficiaryChangeOpen(false);
          setGeneralInfoEditMode(false);
          changeBeneficiary(clickedRow!);
        }}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        additionalBodyText={t("changes")}
        bodyText={t("cancelBodyText")}
        icon={<CancelIcon />}
      />
      {isPercentageInfoModalOpen && (
        <InfoModal
          bodyText={t("shareSumErrorMessage")}
          icon={<CheckListIcon />}
          onOkButtonClick={() => {
            setPercentageInfoModalOpen(false);
          }}
          isOpen={isPercentageInfoModalOpen}
          setIsOpen={setPercentageInfoModalOpen}
        />
      )}
    </>
  );
};

const reducer = "fiBeneficiary";

const mapStateToProps = (state: any) => ({
  pagingPage: state.get(reducer).pagingPage,
  pagingLimit: state.get(reducer).pagingLimit,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPagingPage: bindActionCreators(
    changeFIBeneficiaryPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changeFIBeneficiaryPagingLimitAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FIBeneficiaryItemContainer);
