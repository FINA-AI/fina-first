import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {
  changefiLegalPersonPagingLimitAction,
  changefiLegalPersonPagingPageAction,
} from "../../../../redux/actions/fiLegalPersonActions";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import FILegalPersonMainPage from "../../../../components/FI/Main/Detail/LegalPerson/Main/FILegalPersonMainPage";
import ActiveCell from "../../../../components/common/ActiveCell";
import {
  deleteFiMultiLegalPersons,
  loadLegalPersons,
} from "../../../../api/services/fi/fiLegalPersonService";
import { useHistory } from "react-router-dom";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import StyledChip from "../../../../components/common/Chip/StyledChip";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import { GridColumnType } from "../../../../types/common.type";

interface PropsFromState {
  state: any;
  pagingPage: number;
  pagingLimit: number;
}

interface PropsFromDispatch {
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
}

interface ComponentProps {
  tabName: string;
  setOriginalSelectedPerson: (person: LegalPersonDataType | undefined) => void;
  setIsEdit: (isEdit: boolean) => void;
  fiId: number;
}

type FILegalPersonContainerProps = PropsFromState &
  PropsFromDispatch &
  ComponentProps;

const FILegalPersonContainer: React.FC<FILegalPersonContainerProps> = ({
  state,
  setPagingLimit,
  setPagingPage,
  pagingLimit,
  pagingPage,
  tabName,
  setOriginalSelectedPerson,
  setIsEdit,
  fiId,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [legalPersons, setLegalPersons] = useState<LegalPersonDataType[]>([]);
  const [legalPersonsLength, setLegalPersonsLength] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<LegalPersonDataType[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const columnHeader = [
    {
      field: "name",
      headerName: t("legalPersonName"),
      fixed: true,
    },
    {
      field: "identificationNumber",
      headerName: t("legalPersonId"),
      fixed: false,
    },

    {
      field: "country",
      headerName: t("legalPersonCountry"),
      fixed: false,
      renderCell: (value: LegalPersonDataType) => {
        return value?.name;
      },
    },
    {
      field: "legalAddress",
      headerName: t("legalPersonAddress"),
      fixed: false,
      renderCell: (value: any, row: LegalPersonDataType) => {
        return row?.contactInfo?.address;
      },
    },
    {
      field: "director",
      headerName: t("legalPersonDirector"),
      fixed: false,
      renderCell: (value: any, row: LegalPersonDataType) => {
        return row?.managers[0]?.person?.name;
      },
    },
    {
      field: "telephone",
      headerName: t("legalPersonTelephone"),
      fixed: false,
      renderCell: (value: any, row: LegalPersonDataType) => {
        return row?.contactInfo?.phone;
      },
    },
    {
      field: "connectionTypes",
      headerName: t("connection"),
      width: 170,
      renderCell: (value: any) => {
        value = value ? value : [];

        const text = `${value.length} ${t("connections")}`;

        return <StyledChip label={text} tooltipTextArray={value} />;
      },
      hideCopy: true,
    },
    {
      field: "status",
      headerName: t("legalPersonStatus"),
      fixed: false,

      hideBackground: true,
      renderCell: (value: string) => {
        return (
          <ActiveCell
            active={Boolean(value)}
            style={{
              width: 80,
            }}
          >
            {value ? t(value) : t("INACTIVE")}
          </ActiveCell>
        );
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

  useEffect(() => {
    setColumns(columnHeader);
  }, [t]);

  const getFILegalPersons = () => {
    setTableLoading(true);

    loadLegalPersons(pagingPage, pagingLimit, fiId)
      .then((res) => {
        const data = res.data;
        if (data) {
          setLegalPersonsLength(data.totalResults);
          setLegalPersons(data.list);
        }
        setTableLoading(false);
      })
      .catch((error) => {
        setTableLoading(false);
        openErrorWindow(error, t("error"), true);
      });
  };

  useEffect(() => {
    if (pagingLimit > 0) {
      getFILegalPersons();
    }
  }, [pagingLimit, pagingPage]);

  useEffect(() => {
    if (state?.columns) {
      const stateCols = state.columns.map((s: GridColumnType) => s.field);
      const headerCols = columnHeader.map((s) => s.field);

      if (
        state.columns.length !== 0 &&
        stateCols.every((field: string) => headerCols.includes(field))
      ) {
        const newCols = state.columns.map((item: GridColumnType) => {
          const headerCell = columns.find((el) => item.field === el.field);
          if (headerCell) {
            return {
              ...headerCell,
              hidden: item.hidden,
              fixed: item.fixed,
            };
          }
          return item;
        });
        setColumns(newCols as GridColumnType[]);
      } else {
        setColumns(columnHeader);
      }
    }
  }, [state]);

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const rowEdit = (row: LegalPersonDataType) => {
    history.push(`/fi/${fiId}/${tabName}/${row.id}`);
    setIsEdit(true);
  };

  const deleteMultiLegalPerson = async (data: LegalPersonDataType[]) => {
    let arrayId = data.map(
      (legalPersonItem) => legalPersonItem.fiLegalPersonId
    );
    await deleteFiMultiLegalPersons(fiId, arrayId)
      .then(() => {
        enqueueSnackbar(t("deleted"), { variant: "success" });
        getFILegalPersons();
        setSelectedRows([]);
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  return (
    <FILegalPersonMainPage
      columns={columns}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      legalPersonsLength={legalPersonsLength}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      legalPersons={legalPersons}
      tabName={tabName}
      tableLoading={tableLoading}
      rowEdit={rowEdit}
      setLegalPersons={setLegalPersons}
      setOriginalSelectedPerson={setOriginalSelectedPerson}
      deleteMultiLegalPerson={deleteMultiLegalPerson}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      setColumns={setColumns}
      fiId={fiId}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "fiLegalPersonTableCustomization"]),
  pagingPage: state.get("fiLegalPerson").pagingPage,
  pagingLimit: state.get("fiLegalPerson").pagingLimit,
});

const dispatchToProps = (dispatch: Dispatch) => ({
  setPagingPage: bindActionCreators(
    changefiLegalPersonPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changefiLegalPersonPagingLimitAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(FILegalPersonContainer);
