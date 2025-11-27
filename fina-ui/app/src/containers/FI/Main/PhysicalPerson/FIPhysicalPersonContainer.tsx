import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { useHistory } from "react-router-dom";
import {
  deleteFiMultiPerson,
  deleteFiPerson,
  loadFiPhysicalPersons,
} from "../../../../api/services/fi/fiPersonService";
import {
  changefiPhysicalPersonPagingLimitAction,
  changefiPhysicalPersonPagingPageAction,
} from "../../../../redux/actions/fiPhysicalPersonActions";
import FIPhysicalPersonPageMain from "../../../../components/FI/Main/Detail/Person/Main/FIPhysicalPersonPageMain";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import StyledChip from "../../../../components/common/Chip/StyledChip";
import ActiveCell from "../../../../components/common/ActiveCell";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import {
  CountryDataTypes,
  GridColumnType,
} from "../../../../types/common.type";

interface FIPhysicalPersonContainerProps {
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  tabName: string;
  state: any;
  fiId: number;
}

const FIPhysicalPersonContainer: React.FC<FIPhysicalPersonContainerProps> = ({
  state,
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  tabName,
  fiId,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { openErrorWindow } = useErrorWindow();

  const [persons, setPersons] = useState<PhysicalPersonDataType[]>([]);
  const [personsLength, setPersonsLength] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<PhysicalPersonDataType[]>(
    []
  );

  const columnHeader = [
    {
      field: "name",
      headerName: t("name"),
      fixed: true,
      width: 200,
    },
    {
      field: "identificationNumber",
      headerName: t("fiIdNumber"),
      fixed: false,
    },
    {
      field: "passportNumber",
      headerName: t("fiPassportNumber"),
      fixed: false,
      width: 193,
    },
    {
      field: "residentStatus",
      headerName: t("fiLegalStatus"),
      fixed: false,

      renderCell: (value: string) => {
        return <span>{t(value)}</span>;
      },
    },
    {
      field: "citizenship",
      headerName: t("fiCitizenShip"),
      fixed: false,

      renderCell: (value: CountryDataTypes) => {
        return <span>{t(value?.name)}</span>;
      },
    },
    {
      field: "connectionTypes",
      headerName: t("connection"),
      width: 170,
      renderCell: (value: any) => {
        value = value ? value : [];

        const text = `${value.length} ${t("connection")}`;

        return <StyledChip label={text} tooltipTextArray={value} />;
      },
      hideCopy: true,
    },
    {
      field: "status",
      headerName: t("status"),
      fixed: false,

      hideBackground: true,
      renderCell: (value: string) => {
        return (
          <ActiveCell
            active={String(value).toLowerCase() === "active"}
            style={{
              width: 80,
            }}
          >
            {t(value.toLowerCase())}
          </ActiveCell>
        );
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

  useEffect(() => {
    setColumns(columnHeader);
  }, [t]);

  useEffect(() => {
    if (pagingLimit > 0) {
      getFIPhysicalPersons();
    }
  }, [pagingLimit, pagingPage, fiId]);

  useEffect(() => {
    if (state && state.columns) {
      let stateCols = state.columns.map((s: any) => {
        return s.field;
      });
      let headerCols = columnHeader.map((s) => {
        return s.field;
      });
      if (
        state !== undefined &&
        state.columns.length !== 0 &&
        stateCols.every((element: any) => {
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
      } else {
        setColumns(columnHeader);
      }
    }
  }, [state]);

  const getFIPhysicalPersons = () => {
    setLoading(true);
    loadFiPhysicalPersons(pagingPage, pagingLimit, fiId)
      .then((res) => {
        const data = res.data;
        if (data) {
          setPersonsLength(data.totalResults);
          setPersons(data.list);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        openErrorWindow(error, t("error"), true);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const rowEdit = (row: PhysicalPersonDataType) => {
    history.push(`/fi/${fiId}/physicalperson/${row.fiPersonId}?edit=true`);
  };

  const rowDelete = async (row: PhysicalPersonDataType) => {
    await deleteFiPerson(fiId, row.fiPersonId)
      .then(() => {
        getFIPhysicalPersons();
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const deleteMultiPerson = async (data: PhysicalPersonDataType[]) => {
    let arrayId = data.map(
      (personItem: PhysicalPersonDataType) => personItem.id
    );
    await deleteFiMultiPerson(fiId, arrayId)
      .then(() => {
        getFIPhysicalPersons();
        enqueueSnackbar(t("deleted"), { variant: "success" });
        setSelectedRows([]);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  return (
    <FIPhysicalPersonPageMain
      columns={columns}
      persons={persons}
      setPersons={setPersons}
      personsLength={personsLength}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      loading={loading}
      tabName={tabName}
      rowDelete={rowDelete}
      rowEdit={rowEdit}
      deleteMultiPerson={deleteMultiPerson}
      setSelectedRows={setSelectedRows}
      selectedRows={selectedRows}
      setColumns={setColumns}
      fiId={fiId}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "fiPhysicalPersonTableCustomization"]),
  pagingPage: state.get("fiPhysicalPerson").pagingPage,
  pagingLimit: state.get("fiPhysicalPerson").pagingLimit,
});

const dispatchToProps = (dispatch: Dispatch) => ({
  setPagingPage: bindActionCreators(
    changefiPhysicalPersonPagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changefiPhysicalPersonPagingLimitAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(FIPhysicalPersonContainer);
