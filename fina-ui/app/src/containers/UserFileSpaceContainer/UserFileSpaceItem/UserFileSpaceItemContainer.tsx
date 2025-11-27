import UserFileSpaceItem from "../../../components/UserFileSpace/Item/UserFileSpaceItem";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import GridNameCell from "../../../components/UserFileSpace/Main/GridNameCell";
import { BASE_REST_URL, getFormattedDateValue } from "../../../util/appUtil";
import { useTranslation } from "react-i18next";
import useConfig from "../../../hoc/config/useConfig";
import { bindActionCreators, Dispatch } from "redux";
import {
  changeUserFileSpacePagingLimitAction,
  changeUserFileSpacePagingPageAction,
} from "../../../redux/actions/userFileSpaceActions";
import { connect } from "react-redux";
import {
  loadFileSpaces,
  loadFileSpacesVersionService,
} from "../../../api/services/fileRepositoryService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { Box } from "@mui/system";
import { ConfigType } from "../../../types/common.type";
import { SideMenuType, UserFile } from "../../../types/userFileSpace.type";
import { Typography } from "@mui/material";
import ActiveCell from "../../../components/common/ActiveCell";

interface UserFileSpaceItemContainerProps {
  pagingPage: number;
  setPagingPage: (val: number) => void;
  pagingLimit: number;
  setPagingLimit: (val: number) => void;
  config: ConfigType;
}

const UserFileSpaceItemContainer: React.FC<UserFileSpaceItemContainerProps> = ({
  pagingPage,
  setPagingPage,
  pagingLimit,
  setPagingLimit,
  config,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const { userFileName }: { userFileName: string } = useParams();

  const [listData, setListData] = useState<UserFile[]>([]);
  const [data, setData] = useState<UserFile[]>([]);
  const [totalListItemResult, setTotalListItemResult] = useState<number>(0);
  const [gridPagingPage, setGridPagingPage] = useState<number>(1);
  const [gridPagingLimit, setGridPagingLimit] = useState<number>(25);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [versions, setVersions] = useState<UserFile[]>([]);
  const [selectedUserFileId, setSelectedUserFileId] = useState<string>("");
  const [sideMenu, setSideMenu] = useState<SideMenuType>({
    open: false,
    row: null,
  });
  const [listLoading, setListLoading] = useState(false);
  const [gridLoading, setGridLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    root: "",
    child: "",
  });

  useEffect(() => {
    loadUserFiles();
  }, [pagingPage]);

  useEffect(() => {
    if (listData.length > 0) loadUserFileDetails(listData);
  }, [gridPagingPage, gridPagingLimit]);

  const onFilterFunction = (filterByName: string, filterType: string) => {
    if (filterValues[filterType] === filterByName) return;
    const nodeId = filterType === "root" ? "root" : selectedUserFileId;
    setFilterValues({ ...filterValues, [filterType]: filterByName });

    const [start, limit] = getDetailsPagingData();
    if (filterByName) {
      loadUserFileSpace(nodeId, limit, start, filterByName);
    } else {
      loadUserFileSpace(nodeId, limit, start);
    }
  };

  const loadUserFileSpace = (
    nodeId: string,
    limit: number,
    start: number,
    filterByName?: string
  ) => {
    nodeId === "root" ? setListLoading(true) : setGridLoading(true);
    loadFileSpaces(start, limit, nodeId, filterByName)
      .then((resp) => {
        const response = resp.data;
        if (nodeId === "root") {
          setListData(response.list);
          setTotalListItemResult(response.totalResults);
          if (!selectedUserFileId) {
            loadUserFileDetails(response.list);
          }
        } else {
          setData(response.list);
          setTotalResult(response.totalResults);
        }
      })
      .catch((error) => openErrorWindow(error, t("error"), true))
      .finally(() => {
        setListLoading(false);
        setGridLoading(false);
      });
  };

  let columnHeaders = [
    {
      field: "name",
      headerName: t("name"),
      renderCell: (value: string, row: UserFile) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            <GridNameCell
              value={value}
              innerPage={true}
              downloadUserFileHandler={downloadUserFileHandler}
              row={row}
            />
          </Box>
        );
      },
    },
    {
      field: "descriptions",
      headerName: t("description"),
      copyFunction: (row: UserFile) => {
        return row?.descriptions.find(
          (desc: any) => desc?.lc === config.language
        )?.dc;
      },
      renderCell: (value: { lc: string; dc: string }[]) => {
        return value.find((desc: any) => desc?.lc === config.language)?.dc;
      },
    },
    {
      field: "lastModified",
      headerName: t("modifiedDate"),
      hideCopy: true,
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },

    {
      field: "deleted",
      headerName: t("status"),
      hideCopy: true,
      renderCell: (deleted: boolean) => {
        return (
          <ActiveCell active={!deleted}>
            <Typography
              style={{ width: 50, display: "flex", justifyContent: "center" }}
            >
              {deleted ? t("deleted") : t("active")}
            </Typography>
          </ActiveCell>
        );
      },
    },
  ];

  const loadVersionHandler = (nodeId: string) => {
    loadFileSpacesVersionService(nodeId)
      .then((resp) => {
        const responseList = resp.data;
        setVersions(responseList);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const loadUserFiles = (filterByName?: string) => {
    let limit = pagingPage * pagingLimit;
    let start = limit - pagingLimit;

    return loadUserFileSpace("root", limit, start, filterByName);
  };

  const getDetailsPagingData = () => {
    let limit = gridPagingPage * gridPagingLimit;
    let start = limit - gridPagingLimit;
    return [start, limit];
  };
  const loadUserFileDetails = (list: UserFile[]) => {
    const [start, limit] = getDetailsPagingData();
    if (!selectedUserFileId) {
      let selectedListItem = list.find(
        (item: any) => item.name === userFileName
      );
      if (selectedListItem) {
        loadUserFileSpace(selectedListItem.id, limit, start);
        setSelectedUserFileId(selectedListItem.id);
      }
    } else {
      return loadUserFileSpace(selectedUserFileId, limit, start);
    }
  };

  const onListSelect = (item: UserFile) => {
    const [start, limit] = getDetailsPagingData();
    loadUserFileSpace(item.id, limit, start);
    setSelectedUserFileId(item.id);
    setFilterValues({ ...filterValues, child: "" });
    history.push(`/userfilespace/${item.name}`);
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };
  const onGridPagingLimitChange = (limit: number) => {
    setGridPagingPage(1);
    setGridPagingLimit(limit);
  };

  const downloadUserFileHandler = (
    row: UserFile,
    event: React.MouseEvent<
      HTMLAnchorElement | HTMLSpanElement | HTMLButtonElement,
      MouseEvent
    >
  ) => {
    event.stopPropagation();
    window.open(
      BASE_REST_URL +
        `/jcr/repository/${
          sideMenu?.open ? sideMenu.row && sideMenu.row.id : row.id
        }/versions/${row.versionId}/content`,
      "_blank"
    );
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setData((prevData) =>
      [...prevData].sort((a, b) => {
        let valueA =
          cellName === "descriptions"
            ? a.descriptions?.[0]?.dc ?? ""
            : (a as any)?.[cellName] ?? "";

        let valueB =
          cellName === "descriptions"
            ? b.descriptions?.[0]?.dc ?? ""
            : (b as any)?.[cellName] ?? "";

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <UserFileSpaceItem
      listData={listData}
      onListSelect={onListSelect}
      data={data}
      setData={setData}
      columns={columnHeaders}
      pagingPage={pagingPage}
      onPagingLimitChange={onPagingLimitChange}
      pagingLimit={pagingLimit}
      setPagingPage={setPagingPage}
      totalListItemResult={totalListItemResult}
      gridPagingPage={gridPagingPage}
      gridPagingLimit={gridPagingLimit}
      totalResult={totalResult}
      onGridPagingLimitChange={onGridPagingLimitChange}
      setGridPagingPage={setGridPagingPage}
      downloadUserFileHandler={downloadUserFileHandler}
      loadVersionHandler={loadVersionHandler}
      versions={versions}
      sideMenu={sideMenu}
      setSideMenu={setSideMenu}
      listLoading={listLoading}
      gridLoading={gridLoading}
      onFilter={onFilterFunction}
      filterValues={filterValues}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("userFileSpace").pagingPage,
  pagingLimit: state.get("userFileSpace").pagingLimit,
  config: state.get("config").config,
});

const dispatchToProps = (dispatch: Dispatch<any>) => ({
  setPagingPage: bindActionCreators(
    changeUserFileSpacePagingPageAction,
    dispatch
  ),
  setPagingLimit: bindActionCreators(
    changeUserFileSpacePagingLimitAction,
    dispatch
  ),
});
export default connect(
  mapStateToProps,
  dispatchToProps
)(UserFileSpaceItemContainer);
