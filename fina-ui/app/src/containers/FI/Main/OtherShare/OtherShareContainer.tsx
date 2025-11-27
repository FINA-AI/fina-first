import OtherSharePage from "../../../../components/FI/Main/Detail/OtherShare/OtherSharePage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterTypes, getFormattedDateValue } from "../../../../util/appUtil";
import useConfig from "../../../../hoc/config/useConfig";
import { getAllLegalPersonSimple } from "../../../../api/services/fi/fiLegalPersonService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import {
  createShare,
  deleteShare,
  getFIShares,
  updateShare,
} from "../../../../api/services/fi/fiShareService";
import { Box } from "@mui/system";
import LegalPersonLinkButton from "../../../../components/common/Button/LegalPersonLinkButton";
import { loadPaths } from "../../../../api/services/regionService";
import CountryFilter from "../../../../components/common/Filter/CountryFilter";
import {
  columnFilterConfigType,
  CountryDataTypes,
  TreeGridColumnType,
  TreeGridStateType,
} from "../../../../types/common.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import { OtherSharesDataType, ShareType } from "../../../../types/fi.type";

interface OtherShareContainerProps {
  fiId: number;
}

const OtherShareContainer: React.FC<OtherShareContainerProps> = ({ fiId }) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [treeState, setTreeState] = useState<TreeGridStateType>({
    treeData: [],
    columns: [],
  });
  const [countryData, setCountryData] = useState<CountryDataTypes[]>([]);
  const [otherShares, setOtherShares] = useState<OtherSharesDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [legalPersons, setLegalPersons] = useState<LegalPersonDataType[]>([]);
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [columns, setColumns] = useState<TreeGridColumnType[]>([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [isPercentageInfoModalOpen, setPercentageInfoModalOpen] =
    useState(false);

  useEffect(() => {
    setColumns(columnsHeader);
  }, []);

  const columnsHeader: TreeGridColumnType[] = [
    {
      dataIndex: "company.name",
      title: t("name"),
      filter: {
        type: FilterTypes.string,
        name: "name",
      },
      renderer: (value: any, row: OtherSharesDataType) => {
        return (
          <div>
            {value && <LegalPersonLinkButton id={row.company.id} />}
            {value}
          </div>
        );
      },
    },
    {
      dataIndex: "company.identificationNumber",
      title: t("idNumber"),
      filter: {
        type: FilterTypes.string,
        name: "idNumber",
      },
    },
    {
      dataIndex: "company.country.name",
      title: t("country"),
      filter: {
        type: FilterTypes.country,
        name: "countryId",
        renderFilter: (
          columnsFilter: columnFilterConfigType[],
          onFilterClick: () => void,
          onClear: () => void
        ) => {
          return (
            <CountryFilter
              onClickFunction={onFilterClick}
              defaultValue={
                columnsFilter.find(
                  (el: columnFilterConfigType) => el.name === "country"
                )?.value
              }
              closeFilter={onClear}
              data={countryData}
              loading={countryLoading}
            />
          );
        },
      },
    },
    {
      dataIndex: "share",
      title: t("sharePercentage"),
      renderer: (
        value: number,
        row: ShareType,
        colIndex: number,
        expanded: boolean
      ) => {
        return (
          <>
            {expanded ? (
              <Box display={"flex"}>
                <Box fontWeight={600}>{value}% </Box> &nbsp;
                <Box fontWeight={400}> ({t("total")})</Box>
              </Box>
            ) : (
              <span>{value}%</span>
            )}
          </>
        );
      },
    },
    {
      dataIndex: "shareDate",
      title: t("date"),
      hideCopy: true,
      filter: {
        type: FilterTypes.date,
        name: "creationDate",
      },
      renderer: (value: number) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
  ];

  useEffect(() => {
    initOtherShares();
  }, [fiId]);

  const initOtherShares = (filterData?: columnFilterConfigType) => {
    let filter = filterData ? filterData : {};
    getFIShares(fiId, filter)
      .then((res) => {
        const data = res.data;
        if (data) {
          setOtherShares(
            data.map((shareItem: OtherSharesDataType) => {
              let newShareItem = { ...shareItem, parentId: 0, leaf: false };
              newShareItem.children = shareItem.shares.map((childItem) => {
                return {
                  share: childItem.sharePercentage,
                  shareDate: childItem.shareDate,
                  parentId: shareItem.id,
                  children: [],
                  id: childItem.id,
                };
              });
              return newShareItem;
            })
          );
        }
        loadCountry();
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getLegalPersons = () => {
    getAllLegalPersonSimple()
      .then((res) => {
        const data = res.data;
        if (data) {
          setLegalPersons(data);
        }
        return data;
      })
      .catch((err) => openErrorWindow(err, t("error"), true))
      .finally(() => setLoading(false));
  };

  const loadCountry = () => {
    setCountryLoading(true);
    loadPaths()
      .then((resp) => {
        setCountryData(resp.data);
        getLegalPersons();
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }))
      .finally(() => setCountryLoading(false));
  };

  const saveShare = (data: any) => {
    let obj: any = {
      id: 0,
      sharePercentage: data.share,
      shareDate: data.date,
      company: data.legalPerson,
    };

    createShare(fiId, obj)
      .then((res) => {
        let share = treeState.treeData.find(
          (shareItem: OtherSharesDataType) =>
            shareItem.company.id === obj.company.id
        );

        if (!share) {
          obj.parentId = 0;
          obj.children = [];
          obj.share = obj.sharePercentage;
          obj.shares = [];
          obj.id = res.data.id;
          obj.leaf = false;
          obj.level = 0;
          setTreeState({
            ...treeState,
            treeData: [obj, ...treeState.treeData],
          });
        } else {
          if (share.shares.length === 0) {
            setTreeState({
              ...treeState,
              treeData: treeState.treeData.map(
                (shareItem: OtherSharesDataType) => {
                  if (shareItem.company.id === obj.company.id) {
                    let sumShare = Number(shareItem.share) + Number(data.share);
                    let lastIndex = -treeState.treeData.length;
                    return {
                      ...shareItem,
                      share: sumShare,
                      shares: [res.data],
                      id: lastIndex,
                      shareDate:
                        shareItem.shareDate > data.date
                          ? shareItem.shareDate
                          : data.date,
                      children: [
                        {
                          id: shareItem.id,
                          share: shareItem.share,
                          shareDate: shareItem.shareDate,
                          parentId: lastIndex,
                          leaf: true,
                        },
                        {
                          id: res.data.id,
                          share: data.share,
                          shareDate: res.data.shareDate,
                          parentId: lastIndex,
                          leaf: true,
                        },
                      ],
                    };
                  } else {
                    return shareItem;
                  }
                }
              ),
            });
          } else {
            setTreeState({
              ...treeState,
              treeData: [
                ...treeState.treeData.map((shareItem: OtherSharesDataType) => {
                  let sumShare = Number(shareItem.share) + Number(data.share);
                  let sharesDate = [
                    ...shareItem.children.map((share) => {
                      return share.shareDate;
                    }),
                  ];
                  let maxDate =
                    sharesDate.length !== 0
                      ? sharesDate.reduce((a, b) => {
                          return Math.max(a, b);
                        })
                      : 0;
                  let newShareItem = {
                    share: data.share,
                    shareDate: data.date,
                    parentId: shareItem.id,
                    children: [],
                    id: res.data.id,
                    leaf: true,
                  };
                  return shareItem.company.id === obj.company.id
                    ? {
                        ...shareItem,
                        share: sumShare,
                        shareDate: maxDate > data.date ? maxDate : data.date,
                        children: [newShareItem, ...shareItem.children],
                        shares: [shareItem.shares, ...shareItem.shares],
                      }
                    : shareItem;
                }),
              ],
            });
          }
        }
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((error) => {
        const errorResp = error && error.response && error.response.data;
        if (errorResp && errorResp.code === "INVALID_VALUE") {
          setPercentageInfoModalOpen(true);
        } else {
          openErrorWindow(error, t("error"), true);
        }
      });
  };

  const updateShareFunction = (data: any) => {
    let obj: any = {
      id: data.id,
      sharePercentage: data.share,
      shareDate: data.date,
      company: data.legalPerson,
    };
    updateShare(fiId, obj)
      .then(() => {
        let share = treeState.treeData.find(
          (shareItem: OtherSharesDataType) =>
            shareItem.company.id === obj.company.id
        );
        if (share.shares.length === 0) {
          setTreeState({
            ...treeState,
            treeData: treeState.treeData.map(
              (shareItem: OtherSharesDataType) => {
                if (shareItem.company.id === data.legalPerson.id) {
                  return {
                    ...shareItem,
                    shareDate: data.date,
                    share: data.share,
                  };
                } else return shareItem;
              }
            ),
          });
        } else {
          let newData = treeState.treeData.map(
            (shareItem: OtherSharesDataType) => {
              if (shareItem.company.id === data.legalPerson.id) {
                let currentShareItem = shareItem.children.find(
                  (item) => item.id === data.id
                );
                let sharesDate = shareItem.children
                  .filter((s) => s.id !== data.id)
                  .map((share) => {
                    return share.shareDate;
                  });
                let maxDate = sharesDate.reduce((a, b) => {
                  return Math.max(a, b);
                });
                let sumShare =
                  shareItem.share -
                  currentShareItem!.share +
                  Number(data.share);
                return {
                  ...shareItem,
                  share: sumShare,
                  shares: shareItem.shares,
                  shareDate: maxDate > data.date ? maxDate : data.date,
                  children: shareItem.children.map((item) => {
                    return item.id === data.id
                      ? {
                          share: Number(data.share),
                          shareDate: data.date,
                          id: item.id,
                          parentId: shareItem.id,
                          children: [],
                        }
                      : item;
                  }),
                };
              } else return shareItem;
            }
          );
          setTreeState({ ...treeState, treeData: newData });
        }
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((error) => {
        const errorResp = error && error.response && error.response.data;
        if (errorResp && errorResp.code === "INVALID_VALUE") {
          setPercentageInfoModalOpen(true);
        } else {
          openErrorWindow(error, t("error"), true);
        }
      });
  };

  const deleteShareItem = async (row: {
    data: OtherSharesDataType;
    isEdit: boolean;
  }) => {
    await deleteShare(row.data.company.id, row.data.id)
      .then(() => {
        enqueueSnackbar(t("deleted"), { variant: "success" });
        if (row.data.id > 0 && row.data.parentId === 0) {
          setTreeState({
            ...treeState,
            treeData: [
              ...treeState.treeData.filter(
                (share: OtherSharesDataType) => share.id !== row.data.id
              ),
            ],
          });
        } else {
          let result = [
            ...treeState.treeData.map((share: OtherSharesDataType) => {
              if (share.id === row.data.parentId) {
                let children = share.children.filter(
                  (child) => child.id !== row.data.id
                );
                if (share.children.length === 2) {
                  return {
                    ...share,
                    ...children[0],
                    parentId: 0,
                    children: [],
                    shares: [],
                  };
                } else {
                  let shares = 0;
                  for (let child of children) {
                    shares += Number(child.share);
                  }
                  return { ...share, children: children, share: shares };
                }
              } else {
                return share;
              }
            }),
          ];
          setTreeState({
            ...treeState,
            treeData: result.filter(
              (row) =>
                row.id > 0 ||
                (row.id < 0 && row.children && row.children.length > 0)
            ),
          });
        }
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  return (
    <OtherSharePage
      treeState={treeState}
      setTreeState={setTreeState}
      loading={loading}
      columns={columns}
      data={otherShares}
      legalPersons={legalPersons}
      saveShare={saveShare}
      deleteShare={deleteShareItem}
      updateShareFunction={updateShareFunction}
      initOtherShares={initOtherShares}
      isPercentageModalOpen={isPercentageInfoModalOpen}
      setIsPercentageModalOpen={setPercentageInfoModalOpen}
    />
  );
};

export default OtherShareContainer;
