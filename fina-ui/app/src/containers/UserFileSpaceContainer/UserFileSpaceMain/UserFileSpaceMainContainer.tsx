import UserFileSpaceMainPage from "../../../components/UserFileSpace/Main/UserFileSpaceMainPage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GridNameCell from "../../../components/UserFileSpace/Main/GridNameCell";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import {
  changeUserFileSpacePagingLimitAction,
  changeUserFileSpacePagingPageAction,
} from "../../../redux/actions/userFileSpaceActions";
import { loadFileSpaces } from "../../../api/services/fileRepositoryService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { ConfigType } from "../../../types/common.type";
import { UserFile } from "../../../types/userFileSpace.type";

interface UserFileSpaceMainContainerProps {
  pagingPage: number;
  setPagingPage: (val: number) => void;
  pagingLimit: number;
  setPagingLimit: (val: number) => void;
  config: ConfigType;
}

const UserFileSpaceMainContainer: React.FC<UserFileSpaceMainContainerProps> = ({
  pagingPage,
  setPagingPage,
  pagingLimit,
  setPagingLimit,
  config,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();

  const [data, setData] = useState<UserFile[]>([]);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState("");

  let columnHeaders = [
    {
      field: "name",
      headerName: t("name"),
      flex: 1,
      renderCell: (val: string) => {
        return <GridNameCell value={val} />;
      },
    },
    {
      field: "descriptions",
      headerName: t("description"),
      flex: 1,
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
      flex: 1,
      renderCell: (value: number) => {
        return getFormattedDateValue(value, getDateFormat(true));
      },
    },
  ];

  const loadUserFileSpace = (start: number, filterByName?: string) => {
    setLoading(true);
    loadFileSpaces(start, pagingLimit, "root", filterByName)
      .then((resp) => {
        const response = resp.data;
        setData(response.list);
        setTotalResult(response.totalResults);
      })
      .catch((error) => openErrorWindow(error, t("error"), true))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUserFileSpace(pagingLimit * pagingPage - pagingLimit);
  }, [pagingPage, pagingLimit]);

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onFilterFunction = (filterByName: string) => {
    if (filterByName === filterValue) return;

    setFilterValue(filterByName);
    loadUserFileSpace(0, filterByName || undefined);
  };

  const onFilterClear = () => {
    loadUserFileSpace(0);
    setFilterValue("");
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
    <UserFileSpaceMainPage
      data={data}
      setData={setData}
      columnHeaders={columnHeaders}
      pagingPage={pagingPage}
      onPagingLimitChange={onPagingLimitChange}
      pagingLimit={pagingLimit}
      setPagingPage={setPagingPage}
      totalResult={totalResult}
      loading={loading}
      onFilter={onFilterFunction}
      onFilterClear={onFilterClear}
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
)(UserFileSpaceMainContainer);
