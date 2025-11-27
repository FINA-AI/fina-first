import { loadManagementTypes } from "../../../../api/services/fi/fiManagementTypeService";
import {
  deleteFiManagement,
  loadFiManagement,
} from "../../../../api/services/fi/fiManagementService";
import React, { FC, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { getFormattedDateValue } from "../../../../util/appUtil";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useConfig from "../../../../hoc/config/useConfig";

import { connect } from "react-redux";
import {
  changeFIManagementPagingLimitAction,
  changeFIManagementPagingPageAction,
  changeFIManagementTypeLoadAction,
} from "../../../../redux/actions/fiManagementActions";
import { bindActionCreators, Dispatch } from "redux";
import FIManagementPageMain from "../../../../components/FI/Main/Detail/Management/Main/FIManagementPageMain";
import Box from "@mui/material/Box";
import PhysicalPersonLinkButton from "../../../../components/common/Button/PhysicalPersonLinkButton";
import { FI_MANAGEMENT_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import CommitteeBtn from "../../../../components/common/Button/CommitteeBtn";
import { Typography } from "@mui/material";
import ActiveCell from "../../../../components/common/ActiveCell";
import {
  FiManagementType,
  ManagementDataType,
} from "../../../../types/fi.type";
import { GridColumnType } from "../../../../types/common.type";

interface FIManagementContainerProps {
  tabName: string;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  fiManagementType: FiManagementType;
  setFIManagementType: (type: FiManagementType) => void;
  state: any;
  pageRef: React.RefObject<HTMLDivElement | null>;
  fiId: number;
}

const FIManagementContainer: FC<FIManagementContainerProps> = ({
  tabName,
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  fiManagementType,
  setFIManagementType,
  state,
  pageRef,
  fiId,
}) => {
  const [managementType, setManagementType] = useState<FiManagementType[]>([]);
  const [management, setManagement] = useState<ManagementDataType[]>([]);
  const [managementLength, setManagementLength] = useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [columns, setColumns] = useState<GridColumnType[]>([]);

  useEffect(() => {
    createColumnHeaderFunction();
  }, [t, fiManagementType]);

  useEffect(() => {
    if (managementType && managementType.length === 0) {
      getFIManagementType();
    }
  }, []);

  useEffect(() => {
    getFIManagement(fiManagementType?.id);
  }, [pagingLimit, pagingPage, fiManagementType, fiId]);

  const getFIManagementType = () => {
    loadManagementTypes()
      .then((res) => {
        if (res.data) {
          const data = res.data;
          data.unshift({
            id: -1,
            code: "ALL",
            name: t("all"),
          });
          setManagementType(
            data.map((type: FiManagementType) => ({ ...type, key: type.id }))
          );
          if (!fiManagementType) {
            setFIManagementType(data[0]);
          }
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
  };

  const getFIManagement = (typeId: number) => {
    if (fiManagementType) {
      loadFiManagement(pagingPage, pagingLimit, fiId, typeId)
        .then((res) => {
          const data = res.data;
          if (data) {
            setManagementLength(data.totalResults);
            setManagement(data.list);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar(error, { variant: "error" });
        });
    }
  };

  const createHeaderItemStructure = (
    key: string,
    type: string,
    colWidth: number
  ): GridColumnType => {
    const itemStructure: GridColumnType = {
      field: key,
      headerName: t("managementField" + key),
      fixed: false,
      hideCopy: !(key === "person"),
      width: colWidth,
    };

    if (key === "disable") {
      itemStructure.hideBackground = true;
      itemStructure.renderCell = function renderCell(value) {
        return (
          <ActiveCell active={!value}>
            {!value ? t("active") : t("inactive")}
          </ActiveCell>
        );
      };

      return itemStructure;
    }

    if (key === "dependencyStatus") {
      itemStructure.hideBackground = false;
      itemStructure.renderCell = function renderCell(value) {
        return <span>{value ? t("dependent") : t("independent")}</span>;
      };

      return itemStructure;
    }
    switch (type) {
      case "date":
      case "Date":
        itemStructure.renderCell = function renderCell(value) {
          return (
            <span>{getFormattedDateValue(value, getDateFormat(true))}</span>
          );
        };
        break;
      case "boolean":
      case "Boolean":
        itemStructure.renderCell = function renderCell(value) {
          return value ? t("yes") : t("no");
        };
        break;
      case "FiPerson":
      case "PersonMetaModel":
        itemStructure.renderCell = function renderCell(value) {
          return (
            value && (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <PhysicalPersonLinkButton id={value?.id} />
                <Typography
                  style={{
                    display: "block",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {value ? value.name : ""}
                </Typography>
              </Box>
            )
          );
        };
        break;
      case "Region":
      case "RegionMetaModel":
        itemStructure.renderCell = function renderCell(value) {
          return value && <span>{value.name}</span>;
        };
        break;
      default:
        break;
    }

    return itemStructure;
  };

  const addComiteteOnClickFunction = (row: ManagementDataType) => {
    history.push(
      `/fi/${fiId}/${tabName}/${fiManagementType.id}/${row.id}?addComitete=true`
    );
  };

  const createColumnHeaderFunction = () => {
    if (
      fiManagementType &&
      fiManagementType.id === -1 &&
      managementType.length > 1
    ) {
      fiManagementType.steps = managementType[1].steps;
    }
    if (fiManagementType?.steps) {
      let step = fiManagementType?.steps;
      let headerColumnArray: GridColumnType[] = [];

      const gridWidth = pageRef?.current?.clientWidth ?? 1200;
      const gridColWidth = 200;
      const gridColSize = fiManagementType.steps[0].columns.length;
      let isFlexColumn = true;
      if ((gridColSize + 2) * gridColWidth > gridWidth) {
        isFlexColumn = false;
      }

      let comiteteColumns: GridColumnType = {
        field: "committeeList",
        headerName: t("comitets"),
        fixed: false,
        hideBackground: true,
        width: isFlexColumn ? 0 : gridColWidth,
        renderCell: (value: any, row: ManagementDataType) => {
          return (
            <CommitteeBtn
              value={value}
              row={row}
              onClickFunction={addComiteteOnClickFunction}
            />
          );
        },
      };
      let idColumn = {
        field: "person.identificationNumber",
        headerName: t("managementFieldID"),
        fixed: false,
        hideCopy: false,
        width: isFlexColumn ? 0 : gridColWidth,
      };
      for (let i of step) {
        let cols = i.columns;

        if (step.length === 1) {
          for (let i = 0; i < cols.length; i++) {
            if (i === cols.length - 1) {
              headerColumnArray.push(comiteteColumns);
              headerColumnArray.push(
                createHeaderItemStructure(
                  cols[i].key,
                  cols[i].type,
                  isFlexColumn ? 0 : gridColWidth
                )
              );
            } else {
              headerColumnArray.push(
                createHeaderItemStructure(
                  cols[i].key,
                  cols[i].type,
                  isFlexColumn ? 0 : gridColWidth
                )
              );
            }
            if (cols[i].key === "person") {
              headerColumnArray.push(idColumn);
            }
          }
        } else {
          for (let k = 0; k < cols.length; k++) {
            if (i.index === step.length) {
              if (k === cols.length - 1) {
                headerColumnArray.push(comiteteColumns);
                headerColumnArray.push(
                  createHeaderItemStructure(
                    cols[k].key,
                    cols[k].type,
                    isFlexColumn ? 0 : gridColWidth
                  )
                );
              } else {
                headerColumnArray.push(
                  createHeaderItemStructure(
                    cols[k].key,
                    cols[k].type,
                    isFlexColumn ? 0 : gridColWidth
                  )
                );
              }
            } else {
              headerColumnArray.push(
                createHeaderItemStructure(
                  cols[k].key,
                  cols[k].type,
                  isFlexColumn ? 0 : gridColWidth
                )
              );
            }
            if (cols[k].key === "person") {
              headerColumnArray.push(idColumn);
            }
          }
        }
      }
      if (
        state &&
        state[`${FI_MANAGEMENT_TABLE_KEY}${fiManagementType.id}`] &&
        state[`${FI_MANAGEMENT_TABLE_KEY}${fiManagementType.id}`].columns
          .length !== 0
      ) {
        let newCols = [];
        for (let item of state[
          `${FI_MANAGEMENT_TABLE_KEY}${fiManagementType.id}`
        ].columns) {
          let headerCell = headerColumnArray.find(
            (el) => item.field === el.field
          );
          if (headerCell) {
            headerCell.hidden = item.hidden;
            headerCell.fixed = item.fixed;
            newCols.push(headerCell);
          }
        }
        setColumns(newCols);
      } else {
        setColumns(headerColumnArray);
      }

      if (fiManagementType.id === -1) {
        const newColumn = {
          field: "managementModel.code",
          headerName: t("managementFieldtype"),
          width: isFlexColumn ? 0 : gridColWidth,
          hideCopy: true,
        };
        setColumns((prevState) => [...prevState, newColumn]);
      }
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const deleteManagement = (row: ManagementDataType) => {
    deleteFiManagement(row.id)
      .then(() => {
        setLoading(false);
        const r = management.filter(function (value) {
          return value.id !== row.id;
        });
        setManagement(r);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error, { variant: "error" });
      });
  };

  const editManagement = (row: ManagementDataType) => {
    history.push(
      `/fi/${fiId}/${tabName}/${fiManagementType.id}/${row.id}?edit=true`
    );
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setManagement((prev) =>
      [...prev].sort((a, b) => {
        let valueA;
        let valueB;

        switch (cellName) {
          case "person":
            valueA = a.person?.name ?? "";
            valueB = b.person?.name ?? "";
            break;
          case "person.identificationNumber":
            valueA = a.person?.identificationNumber ?? "";
            valueB = b.person?.identificationNumber ?? "";
            break;
          default:
            valueA = a[cellName as keyof ManagementDataType] ?? "";
            valueB = b[cellName as keyof ManagementDataType] ?? "";
        }

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <FIManagementPageMain
      fiId={fiId}
      tabName={tabName}
      columns={columns}
      setColumns={setColumns}
      management={management}
      setManagement={setManagement}
      managementLength={managementLength}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      loading={loading}
      managementType={managementType}
      selectedManagementType={fiManagementType}
      setSelectedManagementType={setFIManagementType}
      deleteManagement={deleteManagement}
      editManagement={editManagement}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("fiManagement").pagingPage,
  pagingLimit: state.get("fiManagement").pagingLimit,
  fiManagementType: state.get("fiManagement").fiManagementType,
  state: state.get("state"),
});

const dispatchToProps = (dispatch: Dispatch) => ({
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

export default connect(mapStateToProps, dispatchToProps)(FIManagementContainer);
