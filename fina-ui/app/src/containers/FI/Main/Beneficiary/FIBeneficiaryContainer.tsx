import {
  deleteBeneficiary,
  loadBeneficiaries,
  loadBeneficiaryTypes,
} from "../../../../api/services/fi/fiBeneficiaryService";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  changeFIBeneficiaryPagingLimitAction,
  changeFIBeneficiaryPagingPageAction,
  changeFIBeneficiaryTypeLoadAction,
} from "../../../../redux/actions/fiBeneficiaryActions";
import { bindActionCreators, Dispatch } from "redux";
import FIBeneficiary from "../../../../components/FI/Main/Detail/Beneficiary/Main/FIBeneficiary";
import { getFormattedDateValue } from "../../../../util/appUtil";
import useConfig from "../../../../hoc/config/useConfig";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import StyledChip from "../../../../components/common/Chip/StyledChip";
import { useTheme } from "@mui/material/styles";
import ActiveCell from "../../../../components/common/ActiveCell";
import {
  BeneficiariesDataType,
  BeneficiaryType,
} from "../../../../types/fi.type";
import { GridColumnType } from "../../../../types/common.type";
import { LegalIcon } from "../../../../api/ui/icons/LegalIcon";
import { PersonIcon } from "../../../../api/ui/icons/PersonIcon";

interface FIBeneficiaryContainerProps {
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  fiBeneficiaryType: BeneficiaryType;
  setFIBeneficiaryType: (type: BeneficiaryType) => void;
  state?: any;
  tabName: string;
  fiId: number;
}

const FIBeneficiaryContainer: React.FC<FIBeneficiaryContainerProps> = ({
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  fiBeneficiaryType,
  setFIBeneficiaryType,
  state,
  tabName,
  fiId,
}) => {
  const [beneficiaryTypes, setBeneficiaryTypes] = useState<BeneficiaryType[]>(
    []
  );
  const [totalNumOfRows, setTotalNumOfRows] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiariesDataType[]>(
    []
  );
  const [selectedRows, setSelectedRows] = useState<BeneficiariesDataType[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const history = useHistory();
  const theme = useTheme();

  const initFIBeneficiaryTypes = () => {
    loadBeneficiaryTypes(fiId)
      .then((res) => {
        if (res.data) {
          let tmp = [];
          for (const [key, value] of Object.entries(res.data)) {
            tmp.push({
              name: t(`BeneficiariesFilter${key}`),
              additional: `(${value})`,
              key: key,
            });
          }
          tmp.sort((a, b) => a.key.localeCompare(b.key));

          setBeneficiaryTypes(tmp);
          setFIBeneficiaryType(tmp[0]);
        }
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const loadFIBeneficiaries = () => {
    loadBeneficiaries(fiId, pagingPage, pagingLimit, fiBeneficiaryType.key)
      .then((res) => {
        if (res.data) {
          setBeneficiaries(res.data.list);
          setTotalNumOfRows(res.data.totalResults);
        }
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (pagingLimit > 0 && fiBeneficiaryType && beneficiaryTypes.length > 0) {
      loadFIBeneficiaries();
    }
  }, [pagingLimit, pagingPage, fiBeneficiaryType]);

  useEffect(() => {
    initFIBeneficiaryTypes();
  }, [t, fiId]);

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  // const deleteBranchFunction = async (row) => {
  const deleteBeneficiaryRecord = async (row: BeneficiariesDataType) => {
    await deleteBeneficiary(fiId, row.id)
      .then(() => {
        setBeneficiaries(beneficiaries.filter((v) => v.id !== row.id));
        setTotalNumOfRows(totalNumOfRows - 1);
        enqueueSnackbar(t("deleted"), { variant: "success" });
        initFIBeneficiaryTypes();
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  const editBeneficiary = (row: BeneficiariesDataType) => {
    history.push(`/fi/${fiId}/${tabName}/${row.id}?edit=true`);
  };

  const columnHeader = () => {
    return [
      {
        field: "name",
        headerName: t("fiBeneficiaryName"),
        flex: 2.5,
        copyFunction: (row: BeneficiariesDataType) => {
          const value = row.legalPerson?.name ?? row.physicalPerson?.name ?? "";
          return value;
        },
        renderCell: (value: string, row: BeneficiariesDataType) => {
          let base = row.physicalPerson ? row.physicalPerson : row.legalPerson;
          if (base) {
            return (
              <div
                style={{
                  width: 200,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {!row.physicalPerson ? <LegalIcon /> : <PersonIcon />}
                &nbsp;&nbsp;
                {base.name}
              </div>
            );
          }
          return "";
        },
      },
      {
        field: "identificationNumber",
        headerName: t("fiBeneficiaryId"),
        flex: 1.5,
        copyFunction: (row: BeneficiariesDataType) => {
          const value =
            row.legalPerson?.identificationNumber ??
            row.physicalPerson?.identificationNumber ??
            "";
          return value;
        },
        renderCell: (value: string, row: BeneficiariesDataType) => {
          let base = row.physicalPerson ? row.physicalPerson : row.legalPerson;
          if (base) {
            return base.identificationNumber;
          }
          return "";
        },
      },
      {
        field: "residentStatus",
        hideCopy: true,
        headerName: t("fiBeneficiaryResidentStatus"),
        flex: 2,
        renderCell: (value: string, row: BeneficiariesDataType) => {
          let base = row.physicalPerson ? row.physicalPerson : row.legalPerson;
          if (base) {
            return (
              <div
                style={{
                  width: 200,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {t(base.residentStatus || "")}
              </div>
            );
          }
          return "";
        },
      },
      {
        field: "share",
        headerName: t("fiBeneficiaryShares"),
        flex: 1.5,
        hideCopy: true,
        renderCell: (value: number) => {
          if (value >= 10) {
            return (
              <div
                style={{
                  backgroundColor:
                    theme.palette.mode === "light" ? "inherit" : "#344258",
                  borderRadius: 36,
                  border: `1px solid ${theme.palette.primary.main}`,
                  width: 52,
                  height: 28,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {value + "%"}
              </div>
            );
          }

          return (
            <div
              style={{
                width: 52,
                height: 28,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {value + "%"}
            </div>
          );
        },
      },
      {
        field: "nominal",
        headerName: t("fiBeneficiaryNominal"),
        flex: 1.5,
        hideCopy: true,
      },
      {
        field: "currency",
        headerName: t("fiBeneficiaryCurrency"),
        flex: 1.5,
        hideCopy: true,
      },
      {
        field: "creationDate",
        headerName: t("fiBeneficiaryDate"),
        flex: 1.5,
        renderCell: (value: string) => {
          return getFormattedDateValue(value, getDateFormat(true));
        },
        hideCopy: true,
      },
      {
        field: "finalBeneficiaries",
        headerName: t("fiBeneficiaryFinalBeneficiaries"),
        flex: 1.7,
        renderCell: (value: any[]) => {
          value = value ? value : [];

          const text = `${value.length} ${t("fiBeneficiaryFinalBeneficiary")}`;

          const tooltipText = value.map((v) => v?.person?.name);
          return <StyledChip label={text} tooltipTextArray={tooltipText} />;
        },
        hideCopy: true,
      },
      {
        field: "active",
        headerName: t("fiBeneficiaryStatus"),
        hideBackground: true,
        flex: 1.5,
        renderCell: (value: boolean) => {
          return (
            <ActiveCell active={value}>
              {t(value ? "active" : "inactive")}
            </ActiveCell>
          );
        },
        hideCopy: true,
      },
    ];
  };

  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader());

  useEffect(() => {
    if (state && state.columns) {
      let stateCols = state.columns.map((s: GridColumnType) => {
        return s.field;
      });
      let headerCols = columns.map((s) => {
        return s.field;
      });
      if (
        state !== undefined &&
        state.columns.length !== 0 &&
        stateCols.every((element: string) => {
          return headerCols.includes(element);
        })
      ) {
        let newCols = [];
        for (let item of state.columns) {
          let headerCell = columns.find((el) => item.field === el.field);
          if (headerCell) {
            headerCell.hidden = item.hidden;
            headerCell.fixed = item.fixed;
            newCols.push(headerCell);
          }
        }
        setColumns(newCols);
      }
    } else {
      setColumns(columnHeader());
    }
  }, [t, state]);

  const addNewItem = () => {
    history.push(`/fi/${fiId}/${tabName}/0?addNew=true`);
  };

  const rowOnClick = (row: BeneficiariesDataType) => {
    history.push(`/fi/${fiId}/${tabName}/${row.id}`);
  };

  return (
    <FIBeneficiary
      columns={columns}
      data={beneficiaries}
      setData={setBeneficiaries}
      deletebeneficiaryFunction={deleteBeneficiaryRecord}
      setSelectedRows={setSelectedRows}
      selectedRows={selectedRows}
      loading={loading}
      setActivePage={setPagingPage}
      totalSize={totalNumOfRows}
      pagingPage={pagingPage}
      initialRowsPerPage={pagingLimit}
      setRowPerPage={onPagingLimitChange}
      beneficiaryTypes={beneficiaryTypes}
      setSelectedType={setFIBeneficiaryType}
      selectedType={fiBeneficiaryType}
      rowEdit={editBeneficiary}
      addNewItem={addNewItem}
      rowOnClick={rowOnClick}
      setColumns={setColumns}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("fiBeneficiary").pagingPage,
  pagingLimit: state.get("fiBeneficiary").pagingLimit,
  fiBeneficiaryType: state.get("fiBeneficiary").fiBeneficiaryType,
  state: state.getIn(["state", "fiBeneficiaryTableCustomization"]),
});

const dispatchToProps = (dispatch: Dispatch) => ({
  setPagingPage: bindActionCreators(
    changeFIBeneficiaryPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changeFIBeneficiaryPagingLimitAction,
    dispatch
  ),
  setFIBeneficiaryType: bindActionCreators(
    changeFIBeneficiaryTypeLoadAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(FIBeneficiaryContainer);
