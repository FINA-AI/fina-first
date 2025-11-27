import FILicenseItemPage from "../../../../components/FI/Main/Detail/License/Item/FILicenseItemPage";
import { changeFILicensePagingPageAction } from "../../../../redux/actions/fiLicenseActions";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  deleteBankingOperationComment,
  deleteLicenseComment,
  getLicenseById,
  loadLicenses,
  saveBankingOperationComment,
  saveLicense,
  saveLicenseComment,
} from "../../../../api/services/licenseService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";
import { loadLicenseHistory } from "../../../../api/services/fi/FiHistoryService";
import {
  CommentType,
  LicenseHistoryDataType,
  LicensesDataType,
} from "../../../../types/fi.type";
import { CancelIcon } from "../../../../api/ui/icons/CancelIcon";

interface FILicenseItemContainerProps {
  tabName: string;
  setPagingPage: (page: number) => void;
  pagingPage: number;
  pagingLimit: number;
}

const FILicenseItemContainer: React.FC<FILicenseItemContainerProps> = ({
  tabName,
  setPagingPage,
  pagingPage,
  pagingLimit,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  let { id, licenseItemId } = useParams<{
    id: string;
    licenseItemId: string;
  }>();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const [licenses, setLicenses] = useState<LicensesDataType[]>([]);
  const [licenseLength, setLicenseLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] =
    useState<LicensesDataType | null>(null);
  const [originalSelectedLicense, setOriginalSelectedLicense] =
    useState<LicensesDataType | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isLicenseChangeModal, setIsLicenseChangeModal] = useState(false);
  const [nextLicense, setNextLicense] = useState<LicensesDataType | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [historyPagingPage, setHistoryPagingPage] = useState(1);
  const [historyPagingLimit, setHistoryPagingLimit] = useState(25);
  const [historyList, setHistoryList] = useState<LicenseHistoryDataType[]>([]);
  const [historyListLength, setHistoryListLength] = useState<number>(0);
  const [generalEditMode, setGeneralEditMode] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    initLicenses(null);
    getLicenseItemById(Number(licenseItemId));
  }, [pagingPage]);

  const onHistoryPagingLimitChange = (limit: number) => {
    setHistoryPagingPage(1);
    setHistoryPagingLimit(limit);
  };

  const getLicenseItemById = async (licenseId: number) => {
    await getLicenseById(id, licenseId)
      .then((resp) => {
        setSelectedLicense(resp.data);
        setOriginalSelectedLicense(resp.data);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {});
  };

  const getLicenseHistory = () => {
    loadLicenseHistory(licenseItemId, historyPagingPage, historyPagingLimit)
      .then((res) => {
        let data = res.data;
        if (data) {
          setHistoryList(data.list);
          setHistoryListLength(data.totalResults);
        }
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const initLicenses = async (searchValue: string | null) => {
    setLoading(true);
    await loadLicenses(pagingPage, pagingLimit, searchValue ?? filterValue, id)
      .then((resp) => {
        let data = resp.data;
        if (data) {
          setLicenses(data.list);
          setLicenseLength(data.totalResults ? data.totalResults : 0);
        }
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
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
        initLicenses(searchValue);
      }
    }
  };

  const onLicenseItemClick = (licenseItem: LicensesDataType) => {
    if (licenseItem.id !== Number(licenseItemId)) {
      history.push(`/fi/${id}/${tabName}/${licenseItem.id}`);
      getLicenseItemById(licenseItem.id);
    }
  };

  const saveLicenseCommentFunction = async (licenseComment: any) => {
    licenseComment.id = licenseComment.id < 0 ? 0 : licenseComment.id;
    let comment = "";
    await saveLicenseComment(licenseItemId, licenseComment)
      .then((res) => {
        enqueueSnackbar(t("saved"), { variant: "success" });
        comment = res.data;
        if (selectedLicense) {
          let arr = [...selectedLicense.comments.filter((com) => com.id > 0)];
          if (licenseComment.id > 0) {
            arr = arr.map((c) => {
              return c.id === licenseComment.id ? licenseComment : c;
            });
          } else {
            arr.unshift(comment);
          }
          selectedLicense.comments = [...arr];
          if (originalSelectedLicense)
            originalSelectedLicense.comments = [...arr];
        }
      })
      .catch((err) => openErrorWindow(err, true));

    return comment;
  };

  const deleteLicenseCommentFunction = (licenseComment: CommentType) => {
    deleteLicenseComment(licenseComment.id)
      .then(() => {
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const onSaveFunction = (data: LicensesDataType) => {
    saveLicense(data)
      .then((resp) => {
        let allBankingOperations = data.allBankingOperations;
        setSelectedLicense({
          ...resp.data,
          allBankingOperations: allBankingOperations,
        });
        setLicenses(
          licenses.map((licenseItem) => {
            return data.id === licenseItem.id ? resp.data : licenseItem;
          })
        );
        enqueueSnackbar(t("save"), { variant: "success" });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const saveBankingOperationCommentFunc = async (
    bankingOperation: any,
    operationId: number
  ) => {
    bankingOperation.id = bankingOperation.id < 0 ? 0 : bankingOperation.id;
    let comment: any = "";
    try {
      await saveBankingOperationComment(operationId, bankingOperation).then(
        (res) => {
          if (selectedLicense) {
            let operations = [
              ...selectedLicense.operations.filter((op) => op.id > 0),
            ];

            let selectedOperation = operations.find(
              (op) => op.id === operationId
            );

            if (selectedOperation) {
              if (bankingOperation.id > 0) {
                selectedOperation.comments = selectedOperation.comments.map(
                  (op: any) => {
                    return op.id === bankingOperation.id
                      ? bankingOperation
                      : op;
                  }
                );
              } else {
                selectedOperation.comments.unshift(bankingOperation);
              }
              selectedLicense.operations = [...operations];
              originalSelectedLicense!.operations = [...operations];

              enqueueSnackbar(t("saved"), { variant: "success" });
              comment = res;
            }
          }
        }
      );
    } catch (e) {
      openErrorWindow(e, true);
    }

    return comment;
  };

  const deleteBankingOperationCommentFunc = async (
    bankingOperationId: number
  ) => {
    try {
      await deleteBankingOperationComment(bankingOperationId).then(() => {
        enqueueSnackbar(t("deleted"), { variant: "success" });
      });
    } catch (e) {
      openErrorWindow(e, true);
    }
  };

  const onLicenseSelect = (licenseItem: LicensesDataType) => {
    setNextLicense(licenseItem);
    if (isEdit || generalEditMode) {
      setIsLicenseChangeModal(true);
      return;
    }
    setIsEdit(false);
    onLicenseItemClick(licenseItem);
  };

  const licenseChangeHandler = () => {
    setIsEdit(false);
    onLicenseItemClick(nextLicense!);
    setIsLicenseChangeModal(false);
    setGeneralEditMode(false);
  };

  return selectedLicense ? (
    <>
      <FILicenseItemPage
        licenseLength={licenseLength}
        pagingPage={pagingPage}
        pagingLimit={pagingLimit}
        setPagingPage={setPagingPage}
        licenses={licenses}
        loading={loading}
        onFilterClick={onFilterClick}
        onLicenseItemClick={onLicenseSelect}
        selectedLicense={selectedLicense}
        onSaveFunction={onSaveFunction}
        saveLicenseCommentFunction={saveLicenseCommentFunction}
        deleteLicenseCommentFunction={deleteLicenseCommentFunction}
        saveBankingOperationCommentFunc={saveBankingOperationCommentFunc}
        deleteBankingOperationCommentFunc={deleteBankingOperationCommentFunc}
        setSelectedLicense={setSelectedLicense}
        isLicenseModalOpen={isLicenseModalOpen}
        setIsLicenseModalOpen={setIsLicenseModalOpen}
        setIsEdit={setIsEdit}
        isEdit={isEdit}
        historyPagingPage={historyPagingPage}
        setHistoryPagingPage={setHistoryPagingPage}
        historyPagingLimit={historyPagingLimit}
        onHistoryPagingLimitChange={onHistoryPagingLimitChange}
        originalSelectedLicense={originalSelectedLicense}
        getLicenseHistory={getLicenseHistory}
        historyList={historyList}
        historyListLength={historyListLength}
        generalEditMode={generalEditMode}
        setGeneralEditMode={setGeneralEditMode}
        filterValue={filterValue}
      />
      <ConfirmModal
        isOpen={isLicenseChangeModal}
        setIsOpen={setIsLicenseChangeModal}
        onConfirm={licenseChangeHandler}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancel")}
        additionalBodyText={t("changes")}
        bodyText={t("cancelBodyText")}
        icon={<CancelIcon />}
      />
    </>
  ) : null;
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("fiLicense").pagingPage,
  pagingLimit: state.get("fiLicense").pagingLimit,
});

const dispatchToProps = (dispatch: Dispatch) => ({
  setPagingPage: bindActionCreators(changeFILicensePagingPageAction, dispatch),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(FILicenseItemContainer);
