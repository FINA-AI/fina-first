import BundlesPage from "../../components/Bundles/BundlesPage";
import React, { useEffect, useRef, useState } from "react";
import { FilterTypes } from "../../util/appUtil";
import { connect } from "react-redux";
import LanguageColumns from "../../components/Bundles/LanguageColumns";
import { useTranslation } from "react-i18next";
import { SaveIcon } from "../../api/ui/icons/SaveIcon";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import { loadBundles, updateBundles } from "../../api/services/bundleService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  FilterType,
  GridColumnType,
  LanguageType,
} from "../../types/common.type";
import { BundlesDataType } from "../../types/bundles.type";
import { useSnackbar } from "notistack";

interface BundlesContainerProps {
  languages: LanguageType[];
}

const BundlesContainer: React.FC<BundlesContainerProps> = ({ languages }) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [data, setData] = useState<BundlesDataType[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [pagingPage, setPagingPage] = useState<number>(1);
  const [pagingLimit, setPagingLimit] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const originalDataRef = useRef<BundlesDataType[]>();
  const filtersRef = useRef<FilterType[]>([]);
  const { openErrorWindow } = useErrorWindow();
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [bundles, setBundles] = useState<any>([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [scrollToIndex, setScrollToIndex] = useState(-1);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setColumns(columnHeader);
  }, [editMode]);

  const getFilterValue = (key: string) => {
    if (filtersRef.current) {
      let filter = filtersRef.current.find((item) => item.name === key);
      if (filter) {
        return filter.value;
      }
    }
  };

  useEffect(() => {
    initBundles();
  }, []);

  useEffect(() => {
    let filteredData = [...bundles];

    filtersRef.current.forEach((filter) => {
      if (filter.value) {
        const lowerCaseValue = filter.value.toLowerCase();
        filteredData = filteredData.filter((t) => {
          const value = (
            t[filter.name as keyof typeof t] as string
          )?.toLowerCase();
          return value?.includes(lowerCaseValue);
        });
      }
    });

    const slicedData = filteredData.slice(
      (pagingPage - 1) * pagingLimit,
      (pagingPage - 1) * pagingLimit + pagingLimit
    );
    originalDataRef.current = JSON.parse(JSON.stringify(bundles));

    setData(structuredClone(slicedData));
    setTotalResults(filteredData.length);
    setLoading(false);
  }, [pagingPage, pagingLimit, filtersRef, bundles]);

  const initBundles = () => {
    setLoading(true);
    loadBundles()
      .then((resp) => {
        const data = resp.data;
        const translationsData = transformData(data);
        setBundles(translationsData);
      })
      .catch(() => enqueueSnackbar(t("error"), { variant: "error" }))
      .finally(() => setLoading(false));
  };

  const onPageChange = (pageNum: number) => {
    setPagingPage(pageNum);
    setScrollToIndex((prevState) => (prevState === -1 ? 0 : -1));
  };

  const transformData = (data: BundlesDataType) => {
    const translationsData: BundlesDataType[] = [];
    let index = 1;

    let translations: { [key: string]: string } = {};
    let translationsCount = 0;
    for (const property in data) {
      const count = Object.keys(data[property].translations).length;
      if (count > translationsCount) {
        translationsCount = count;
        translations = data[property].translations;
      }
    }

    for (const key in translations) {
      const item: BundlesDataType = {
        id: index++,
        translationKey: key,
      };

      languages.forEach((language) => {
        item[language.code] = data[language.code]?.translations[key];
      });
      translationsData.push(item);
    }

    return translationsData;
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onChangeValue = (rowId: number, key: string, value: string) => {
    if (!originalDataRef.current) return false;

    let originalValue = originalDataRef.current.find(
      (item) => item.id === rowId
    )?.[key];

    setData((currentData) => {
      let field = currentData.find((item) => item.id === rowId);
      if (!field) return currentData;

      if (value !== originalValue) {
        field.dirty = { ...(field.dirty || {}), [key]: true };
      } else {
        // delete field.dirty[key];
      }
      field[key] = value;

      return currentData;
    });

    return value === originalValue;
  };

  const cancelEditHandler = () => {
    setEditMode(false);
    if (originalDataRef.current) {
      filtersRef.current
        ? filterOnChangeFunction(filtersRef.current)
        : setData(
            originalDataRef.current.slice(
              (pagingPage - 1) * pagingLimit,
              (pagingPage - 1) * pagingLimit + pagingLimit
            )
          );
    }
  };

  const undoFunc = (rowId: number, key: string, value: string) => {
    return onChangeValue(rowId, key, value);
  };

  const saveHandler = () => {
    const changedData = data.filter(
      (item) => item.dirty && Object.keys(item.dirty).length > 0
    );

    const changeItems: { key: string; langCode: string; value: string }[] = [];

    changedData.forEach((item) => {
      for (let key in item.dirty) {
        const i18nPostItemBody = {
          key: item.translationKey,
          langCode: key,
          value: item[key],
        };

        changeItems.push(i18nPostItemBody);
      }
    });

    if (changeItems.length > 0) {
      updateBundles(changeItems)
        .then(() => {
          const cleanedData = data.map((item) => {
            const newItem = { ...item };
            delete newItem.dirty;
            return newItem;
          });
          const modifiedOriginalData = originalDataRef.current?.map((item) => {
            const modifiedItem = cleanedData.find((el) => el.id === item.id);
            return modifiedItem || item;
          });
          originalDataRef.current = modifiedOriginalData;
          setData(structuredClone(cleanedData));
          setBundles(structuredClone(modifiedOriginalData));
          setEditMode(false);
          setSaveModalOpen(false);
          setIsSaveDisabled(true);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const highlightBracesHandler = (text: string) => {
    if (text) {
      const parts = text.split(/(\{\{.*?\}\})/);

      return parts.map((part: string, index: number) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          return (
            <span key={index} style={{ color: "red" }}>
              {part}
            </span>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      });
    }

    return text;
  };

  const languageColumns = languages.map((language: LanguageType) => ({
    field: language.code,
    headerName: language.name,
    hideCopy: editMode,
    filter: {
      field: language.code,
      type: FilterTypes.string,
      name: language.code,
      value: getFilterValue(language.code),
    },
    renderCell: (value: string, row: LanguageType) => {
      return (
        <LanguageColumns
          key={row.id}
          editMode={editMode}
          highlightBracesHandler={highlightBracesHandler}
          value={value}
          language={language}
          row={row}
          onChangeValue={onChangeValue}
          undoFunc={undoFunc}
          setIsSaveDisabled={setIsSaveDisabled}
        />
      );
    },
  }));

  const columnHeader = [
    {
      field: "translationKey",
      headerName: t("translationKey"),
      hideCopy: editMode,
      filter: {
        field: "translationKey",
        type: FilterTypes.string,
        name: "translationKey",
        value: getFilterValue("translationKey"),
      },
    },

    ...languageColumns,
  ];

  let translationKeyFilterConfig = [
    {
      field: "translationKey",
      type: FilterTypes.string,
      name: "translationKey",
      value: getFilterValue("translationKey"),
    },
  ];

  const acceptedLanguages = languages.map((language) => {
    return {
      field: language.code,
      type: FilterTypes.string,
      name: language.code,
      value: getFilterValue(language.code),
    };
  });

  const columnFilterConfig = [
    ...translationKeyFilterConfig,
    ...acceptedLanguages,
  ];

  const filterOnChangeFunction = async (obj: FilterType[]) => {
    let newFilteredData: BundlesDataType[] = [];
    let originalData: BundlesDataType[] = JSON.parse(
      JSON.stringify(originalDataRef.current)
    );
    if (obj && obj.length > 0 && Boolean(obj.find((item) => item.value))) {
      for (let o of obj) {
        if (o.value) {
          const lowerCaseValue = o.value.toLowerCase();
          let arr = originalData.filter((t) =>
            t[o.name]?.toLowerCase()?.includes(lowerCaseValue)
          );
          newFilteredData = arr;
        }
      }
    } else {
      newFilteredData = originalData;
    }

    const filteredData = newFilteredData ? newFilteredData : originalData;

    const slicedData = filteredData.slice(
      (pagingPage - 1) * pagingLimit,
      (pagingPage - 1) * pagingLimit + pagingLimit
    );

    filtersRef.current = obj;
    setData(slicedData);
    setTotalResults(filteredData.length);
  };

  const orderRowByHeader = (fieldName: string, direction: string) => {
    const getTrimmedValue = (value: any) => {
      if (!value) return "";
      return value?.toString()?.trim();
    };

    const sortedData = [...bundles].sort((a, b) => {
      const fieldA = getTrimmedValue(a[fieldName]);
      const fieldB = getTrimmedValue(b[fieldName]);

      let comparison = 0;
      comparison = fieldA.localeCompare(fieldB, undefined, {
        sensitivity: "base",
      });

      return direction === "up" ? comparison : -comparison;
    });

    setBundles(sortedData);

    const slicedData = sortedData.slice(
      (pagingPage - 1) * pagingLimit,
      (pagingPage - 1) * pagingLimit + pagingLimit
    );
    setData(slicedData);
  };

  return (
    <>
      <BundlesPage
        columns={columns}
        bundles={data}
        editMode={editMode}
        setEditMode={setEditMode}
        cancelEditHandler={cancelEditHandler}
        saveHandler={saveHandler}
        columnFilterConfig={columnFilterConfig}
        filterOnChangeFunction={(obj: FilterType[]) => {
          filterOnChangeFunction(obj);
          setPagingPage(1);
        }}
        onPageChange={onPageChange}
        pagingLimit={pagingLimit}
        onPagingLimitChange={onPagingLimitChange}
        totalRows={totalResults}
        loading={loading}
        pagingPage={pagingPage}
        setSaveModalOpen={setSaveModalOpen}
        orderRowByHeader={orderRowByHeader}
        isSaveDisabled={isSaveDisabled}
        scrollToIndex={scrollToIndex}
      />
      {saveModalOpen && (
        <ConfirmModal
          isOpen={saveModalOpen}
          setIsOpen={setSaveModalOpen}
          onConfirm={saveHandler}
          confirmBtnTitle={t("save")}
          headerText={t("saveHeaderText")}
          additionalBodyText={t("changes")}
          bodyText={t("saveBodyText")}
          icon={<SaveIcon />}
        />
      )}
    </>
  );
};

const languageReducer = "language";
const mapStateToProps = (state: any) => ({
  languages: state.getIn([languageReducer, "languages"]),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BundlesContainer);
