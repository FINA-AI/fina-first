import React, { useEffect, useState } from "react";
import { getCatalogService } from "../../api/services/catalogService";
import MiniCatalog from "../../components/Catalog/MiniCatalog/MiniCatalog";
import { useHistory } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  changeCatalogFilter,
  changeCatalogItemFilter,
  changeCatalogLoadAction,
  changeCatalogPagingLimitAction,
  changeCatalogPagingPageAction,
} from "../../redux/actions/catalogActions";
import { useTranslation } from "react-i18next";
import { getLanguage } from "../../util/appUtil";
import { Catalog, CatalogItemTreeState } from "../../types/catalog.type";

interface CatalogListContainerProps {
  setSelectedCatalog: (catalog: Catalog) => void;
  setPagingPage: (page: number) => void;
  setPagingLimit: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  filterValue: string;
  setFilterValue: (filter: string) => void;
  setCatalogItemFilter: (filter: string | null) => void;
  selectedCatalog: Catalog;
  treeState: CatalogItemTreeState;
  setTreeState: React.Dispatch<React.SetStateAction<CatalogItemTreeState>>;
  catalogId: string;
}

const CatalogListContainer: React.FC<CatalogListContainerProps> = ({
  setSelectedCatalog,
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  filterValue,
  setFilterValue,
  setCatalogItemFilter,
  selectedCatalog,
  treeState,
  setTreeState,
  catalogId,
}) => {
  const { t } = useTranslation();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [catalogLength, setCatalogsLength] = useState(0);
  const history = useHistory();
  let id = catalogId;
  const [loading, setLoading] = useState(true);
  const langCode = getLanguage().replace("_", "-");

  const loadCatalogs = () => {
    setLoading(true);
    getCatalogService(pagingPage, pagingLimit, filterValue).then((res) => {
      const data = res.data;
      if (data) {
        setCatalogsLength(data.totalResults);
        setCatalogs(data.list);

        if (!data.list || data.list.length === 0) {
          //update catalog items treeGrid
          setTreeState({ ...treeState, data: [] });
          setLoading(false);
          return;
        }

        if (id) {
          let tmp = data.list.find((item: Catalog) => item.id === Number(id));
          if (tmp) {
            onCatalogSelect(tmp);
          } else {
            //select first element if reutrned data doesn't contain selected catalog
            onCatalogSelect(data.list[0], true);
          }
        }
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (pagingLimit > 0) {
      loadCatalogs();
    }
  }, [pagingLimit, pagingPage, filterValue]);

  const onCatalogSelect = (item: Catalog, autoSelect?: boolean) => {
    if ((selectedCatalog && selectedCatalog.id !== item?.id) || autoSelect) {
      setSelectedCatalog(item);
    }
    const newItem = { ...item };
    setCatalogItemFilter(null);
    history.push(`${newItem.id}`);
  };

  const configData = (items: Catalog[]) => {
    const getFormattedDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleString(langCode, { month: "short" });
      const year = date.getFullYear();
      return `${t("modifiedat")}  ${day} ${month} ${year}`;
    };

    const filter = (item: Catalog) => {
      const myDate = new Date(item.modifiedAt);
      const modifiedAtText = getFormattedDate(myDate);

      return {
        primaryText: `${item.name} ( ${item.code} )`,
        secondaryText: modifiedAtText,
        details: {
          Abbreviation: item.abbreviation,
          "Catalog Number": item.referenceNumber,
          "MDT Code": item.mdtCode,
        },
        originalData: item,
      };
    };
    const filteredData = items.map((dataEntry) => filter(dataEntry));
    return filteredData;
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onPagingPageChange = (page: number) => {
    setPagingPage(page);
  };

  const onFilterClick = (searchValue: string) => {
    if (!searchValue || searchValue.trim().length) {
      setPagingPage(1);
      setFilterValue(searchValue);
    }
  };

  return (
    <MiniCatalog
      data={configData(catalogs)}
      onSelect={onCatalogSelect}
      itemId={id}
      setActivePage={onPagingPageChange}
      setRowPerPage={onPagingLimitChange}
      catalogLength={catalogLength}
      pagingPage={pagingPage}
      initialRowsPerPage={pagingLimit}
      filterValue={filterValue}
      onFilter={onFilterClick}
      loading={loading}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("catalog").pagingPage,
  pagingLimit: state.get("catalog").pagingLimit,
  filterValue: state.get("catalog").filterValue,
  selectedCatalog: state.getIn(["catalog", "catalog"]),
});

const dispatchToProps = (dispatch: any) => ({
  setSelectedCatalog: bindActionCreators(changeCatalogLoadAction, dispatch),
  setPagingPage: bindActionCreators(changeCatalogPagingPageAction, dispatch),
  setPagingLimit: bindActionCreators(changeCatalogPagingLimitAction, dispatch),
  setFilterValue: bindActionCreators(changeCatalogFilter, dispatch),
  setCatalogItemFilter: bindActionCreators(changeCatalogItemFilter, dispatch),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(React.memo(CatalogListContainer));
