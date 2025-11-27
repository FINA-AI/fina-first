import FAQPage from "../../components/FAQ/FAQPage";
import React, { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useConfig from "../../hoc/config/useConfig";
import { Box } from "@mui/material";
import { getFormattedDateValue, NumOfRowsPerPage } from "../../util/appUtil";
import {
  categoryPut,
  deleteFaqCategory,
  deleteFaqCategoryItem,
  getAllFAQ,
  getFAQByCategory,
  getFAQCategories,
  moveFaqItem,
  postCategory,
  postQuestion,
  questionPut,
} from "../../api/services/FAQService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import { GridColumnType, TreeGridStateType } from "../../types/common.type";
import {
  FaqCategoryDataType,
  FaqDataType,
  FaqListDataType,
} from "../../types/faq.type";

export interface TableRefType {
  resetData: () => number;
}

const FAQContainer = () => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getDateFormat } = useConfig();

  const [treeState, setTreeState] = useState<TreeGridStateType>({
    treeData: [],
    columns: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [loadMask, setLoadMask] = useState<boolean>(false);
  const [faqCategoryLoading, setFaqCategoryLoading] = useState<boolean>(true);
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [listData, setListData] = useState<FaqListDataType[]>([]);
  const [data, setData] = useState<FaqDataType[]>([]);
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(
    NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [scrollToIndex, setScrollToIndex] = useState(-1);
  let tableRef = useRef<TableRefType>(null);

  const selectedCategory = useRef<FaqListDataType | null>(null);

  const columnHeader = [
    {
      field: "question",
      headerName: t("question"),
    },
    {
      field: "answer",
      headerName: t("answer"),
    },
    {
      field: "user",
      headerName: t("user"),
    },
    {
      field: "publish",
      headerName: t("publishDate"),
      hideCopy: true,
      renderCell: (value: number) => {
        return (
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            {getFormattedDateValue(value, getDateFormat(true))}
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    getFAQCategories(0)
      .then((res) => {
        setListData([
          {
            id: -1,
            leaf: false,
            name: "Categories",
            parentId: 0,
            level: 0,
            children: res.data.map((item: FaqListDataType) => {
              return { ...item, level: 1, parentId: -1 };
            }),
          },
        ]);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setFaqCategoryLoading(false);
      });
    setColumns(columnHeader);
  }, []);

  useEffect(() => {
    resetTableData();

    if (selectedCategory.current) {
      loadFAQByCategory(selectedCategory.current);
    } else {
      loadAllFAQ();
    }
    setScrollToIndex((prevState) => (prevState === -1 ? 0 : -1));
  }, [activePage, pagingLimit, searchValue]);

  const resetTableData = () => {
    if (tableRef.current) tableRef.current.resetData();
  };

  const addSequenceNumbers = (data: FaqDataType[]) => {
    return data.map((item, index) => ({
      ...item,
      sequence: index + 1,
    }));
  };

  const loadAllFAQ = async () => {
    setLoading(true);
    await getAllFAQ(activePage, pagingLimit, searchValue)
      .then((res) => {
        setDataLength(res.data["totalResults"]);
        setData(addSequenceNumbers(res.data.list));
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
        setLoadMask(false);
      });
  };

  const loadFAQByCategory = (row: FaqListDataType) => {
    resetTableData();

    setLoading(true);
    getFAQByCategory(row.id, activePage, pagingLimit)
      .then((res) => {
        setDataLength(res.data["totalResults"]);
        setData(addSequenceNumbers(res.data.list));
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setActivePage(1);
    setPagingLimit(limit);
  };

  const fetchListData = async (
    rowId: number,
    data: FaqListDataType[],
    row: FaqListDataType
  ) => {
    if (rowId === 0) {
      return listData;
    } else {
      let result: FaqListDataType[] = [];

      await getFAQCategories(row.id)
        .then((res) => {
          result = res.data.map((item: FaqListDataType) => {
            return { ...item };
          });
        })
        .catch((error) => {
          openErrorWindow(error, t("error"), true);
        });

      return result;
    }
  };

  const onCategorySelect = (row: FaqListDataType) => {
    setActivePage(1);
    selectedCategory.current = row.id < 0 ? null : row;

    if (searchValue) {
      loadAllFAQ();
    } else {
      loadFAQByCategory(row);
    }
  };

  const deleteCategory = (
    row: FaqListDataType,
    setSelectedListItem: React.Dispatch<
      React.SetStateAction<FaqListDataType | undefined>
    >
  ) => {
    if (row && row.id !== -1) {
      deleteFaqCategory(row.id)
        .then(() => {
          const getChildrenRecursive = (parent: FaqListDataType) => {
            if (parent.children) {
              if (parent.children.find((item) => item.id === row.id)) {
                parent.children = parent.children.filter(
                  (item) => item.id !== row.id
                );
              } else {
                parent.children.forEach((item) => {
                  getChildrenRecursive(item);
                });
              }
            }
          };

          listData.forEach((item) => {
            getChildrenRecursive(item);
          });

          setTreeState({ ...treeState, treeData: [...listData] });

          enqueueSnackbar(t("deleted"), { variant: "success" });
          setSelectedListItem(undefined);
        })
        .catch((error) => {
          openErrorWindow(error, t("error"), true);
        });
    }
  };

  const deleteCategoryItem = (
    category: FaqCategoryDataType,
    row: FaqDataType
  ) => {
    setLoadMask(true);
    deleteFaqCategoryItem(category.id, row.id)
      .then(() => {
        setData(addSequenceNumbers([...data.filter((r) => r.id !== row.id)]));
        setDataLength(dataLength - 1);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => setLoadMask(false));
  };

  const changeFAQSequence = async (
    faqId: number | undefined,
    onArrowDisableFn: (value: boolean) => void,
    moveUp: boolean
  ) => {
    onArrowDisableFn(true);
    await moveFaqItem(faqId, moveUp)
      .then(() => {
        onArrowDisableFn(false);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const addCategory = (data: FaqListDataType, parentRow: FaqListDataType) => {
    if (data.parentId < 0) {
      data.parentId = 0;
    }
    postCategory(data)
      .then((res) => {
        if (parentRow.children) {
          const addedItem = res.data[0];
          addedItem.level = parentRow.level + 1;
          parentRow.children.push(addedItem);
        }

        setTreeState({ ...treeState, treeData: [...listData] });
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const addQuestion = (id: number, item: FaqDataType) => {
    postQuestion(id, item)
      .then((res) => {
        setData([...data, res.data[0]]);
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const editCategory = (
    id: number,
    listItem: FaqListDataType,
    selectedRow: FaqListDataType
  ) => {
    if (listItem.parentId < 0) {
      listItem.parentId = 0;
    }

    categoryPut(id, listItem)
      .then((res) => {
        const data = res.data[0];

        selectedRow.leaf = data.leaf;
        selectedRow.nameStrId = data.nameStrId;
        selectedRow.name = data.name;

        setTreeState({ ...treeState, treeData: [...listData] });
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const editQuestion = (id: number, item: FaqDataType) => {
    questionPut(id, item)
      .then((res) => {
        let newArr = data.map((item) => {
          if (item.id === id) {
            return res.data[0];
          }
          return item;
        });

        setData(newArr);
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const onFilterFunction = (searchText: string) => {
    selectedCategory.current = null;

    searchText = searchText.trim();
    if (searchText.length > 2 && searchText !== searchValue) {
      setLoadMask(true);
      setSearchValue(searchText);
      setActivePage(1);
    } else if (!searchText) {
      setLoadMask(true);
      setSearchValue("");
      setActivePage(1);
    }
  };

  return (
    <FAQPage
      treeState={treeState}
      setTreeState={setTreeState}
      columns={columns}
      dataLength={dataLength}
      setRowPerPage={onPagingLimitChange}
      pagingPage={activePage}
      initialRowsPerPage={pagingLimit}
      setActivePage={setActivePage}
      loading={loading}
      loadMask={loadMask}
      data={data}
      listData={listData}
      fetchListData={fetchListData}
      onCategorySelect={onCategorySelect}
      deleteCategory={deleteCategory}
      deleteCategoryItem={deleteCategoryItem}
      changeFAQSequence={changeFAQSequence}
      addCategory={addCategory}
      addQuestion={addQuestion}
      editCategory={editCategory}
      editQuestion={editQuestion}
      onFilter={onFilterFunction}
      scrollToIndex={scrollToIndex}
      faqCategoryLoading={faqCategoryLoading}
      tableRef={tableRef}
      setSearchValue={setSearchValue}
    />
  );
};

export default memo(FAQContainer);
