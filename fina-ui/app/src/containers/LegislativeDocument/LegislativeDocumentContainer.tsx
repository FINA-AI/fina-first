import React, { memo, useEffect, useState } from "react";
import LegislativeDocumentPage from "../../components/LegislativeDocument/LegislativeDocumentPage";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { loadFiTypes } from "../../api/services/fi/fiService";
import { Box } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ListIcon from "@mui/icons-material/List";
import {
  BASE_REST_URL,
  getFileSize,
  getFormattedDateValue,
} from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import {
  deleteLegislativeCategoryDocument,
  getLegislativeCategories,
  getLegislativeCategoryDocuments,
  postCategory,
  postCategoryDocument,
} from "../../api/services/legislativeDocumentService";
import {
  CategoryAttachmentType,
  CategoryType,
  LegislativeDocumentType,
  UploadDataType,
} from "../../types/legislativeDocument.type";
import { TreeGridColumnType, TreeGridStateType } from "../../types/common.type";
import { useSnackbar } from "notistack";
import { FileIcon } from "../../api/ui/icons/FileIcon";

const LegislativeDocumentContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { getDateFormat } = useConfig();
  const { enqueueSnackbar } = useSnackbar();

  const [treeState, setTreeState] = useState<TreeGridStateType>({
    treeData: [],
    columns: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LegislativeDocumentType[]>([]);
  const [columns, setColumns] = useState<TreeGridColumnType[]>([]);
  const [maskLoader, setMaskLoader] = useState<boolean>(false);

  const headerColumns = [
    {
      dataIndex: "code",
      title: t("name"),
      minWidth: 230,
      hideSort: true,
      renderer: (value: string, row: CategoryAttachmentType) => {
        const isLink = row.level === 2;

        return (
          <Box display={"flex"} alignItems={"center"} flexShrink={0}>
            {row.level === 0 ? (
              <FolderOpenIcon
                style={{
                  fill: "#FF8D00",
                  width: "20px",
                  height: "20px",
                }}
              />
            ) : row.level === 1 ? (
              <ListIcon
                style={{
                  fill: "#2962FF",
                  width: "20px",
                  height: "20px",
                }}
              />
            ) : (
              <FileIcon
                extension={row?.fileName?.split(".").pop()?.toLowerCase()}
              />
            )}
            <Box
              component={"span"}
              sx={(theme) => ({
                color: isLink ? theme.palette.secondary.main : "inherit",
              })}
              style={{
                flex: 1,
                marginLeft: "5px",
                cursor: isLink ? "pointer" : "",
                textDecoration: isLink ? "underline" : "none",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
              onClick={() => isLink && onFileDownload(row)}
              data-testid={"file-name"}
            >
              {value}
            </Box>
          </Box>
        );
      },
    },
    {
      dataIndex: "description",
      title: t("description"),
      minWidth: 230,
      hideSort: true,
    },
    {
      dataIndex: "bytes",
      title: t("size"),
      minWidth: 150,
      hideSort: true,
      renderer: (value: number) => value && getFileSize(value),
    },
    {
      dataIndex: "publisher",
      title: t("publisher"),
      minWidth: 150,
      hideSort: true,
    },
    {
      dataIndex: "publish",
      title: t("published"),
      minWidth: 150,
      hideSort: true,
      renderer: (value: number) =>
        getFormattedDateValue(value, getDateFormat(false)),
    },
    {
      dataIndex: "sign",
      title: t("sign"),
      minWidth: 150,
      hideSort: true,
      renderer: (value: boolean) => `${value || ""}`,
    },
    {
      dataIndex: "notify",
      title: t("notify"),
      minWidth: 150,
      hideSort: true,
      renderer: (value: boolean) => `${value || ""}`,
    },
  ];

  useEffect(() => {
    init();
  }, []);

  const loadFiTypesFunction = (categories: CategoryType[]) => {
    setLoading(true);
    loadFiTypes(false)
      .then((res) => {
        let result = res.data;
        if (result) {
          setData(
            result.map((row: LegislativeDocumentType) => {
              return {
                ...row,
                parentRowId: 0,
                id: `${row.id}_${row.code}`,
                children: [
                  ...categories.map((child: CategoryType) => {
                    return {
                      ...child,
                      id: `${child.id}_${row.code}_child`,
                      parentRowId: `${row.id}_${row.code}`,
                      level: 1,
                      leaf: false,
                    };
                  }),
                ],
              };
            })
          );
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initCategories = async () => {
    setLoading(true);
    setColumns(headerColumns);
    let categories: CategoryType[] = [];
    await getLegislativeCategories()
      .then((res) => {
        categories = res.data.map((item: CategoryType) => {
          let tmp = item.name;
          delete item.name;
          return { ...item, code: tmp };
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
    return categories;
  };

  const init = async () => {
    const categories = await initCategories();
    if (categories.length > 0) {
      loadFiTypesFunction(categories);
    }
  };

  const initCategoryDocuments = async (
    fiTypeId: string,
    categoryId: string
  ) => {
    const typeId = fiTypeId.split("_")[0];
    const cId = categoryId.split("_")[0];
    try {
      const res = await getLegislativeCategoryDocuments(typeId, cId);
      if (res.data) {
        let tmp = res.data.map((item: CategoryAttachmentType) => {
          return {
            ...item,
            parentRowId: categoryId,
            leaf: true,
            level: 2,
            code: item.fileName,
          };
        });

        data.forEach((parent) => {
          if (parent.children) {
            if (parent.children.find((item) => item.id === cId)) {
              parent.children = tmp;
            }
          }
        });

        setTreeState({ ...treeState, treeData: [...data] });

        return tmp;
      } else {
        return [];
      }
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  const fetchFunction = async (
    parentId: number,
    data: LegislativeDocumentType[],
    row: CategoryType
  ) => {
    if (parentId === 0) {
      return data;
    } else {
      if (row.level === 1) {
        return initCategoryDocuments(
          row.parentRowId as string,
          row.id as string
        );
      }
    }
  };

  const onFileDownload = (row: CategoryAttachmentType) => {
    window.open(
      BASE_REST_URL + `/legislative/document/download/${row.id}`,
      "_blank"
    );
  };

  const onDeleteFile = (row: CategoryAttachmentType) => {
    setLoading(true);
    deleteLegislativeCategoryDocument(row.id)
      .then(() => {
        data.forEach((parent) => {
          parent.children.forEach((category) => {
            category.children?.forEach((categoryAttach) => {
              if (row.id === categoryAttach.id) {
                category.children = category.children?.filter(
                  (item) => item.id !== row.id
                );
              }
            });
          });
        });

        setTreeState({ ...treeState });

        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const onFileUpload = (category: CategoryType, uploadData: UploadDataType) => {
    setMaskLoader(true);
    const fiTypeId = category.parentRowId;
    const categoryId = category.id;
    const typeId =
      typeof fiTypeId === "string" ? Number(fiTypeId.split("_")[0]) : fiTypeId;
    const cId =
      typeof categoryId === "string"
        ? Number(categoryId.split("_")[0])
        : categoryId;

    let formData = new FormData();
    formData.append("description", uploadData.description);

    if (uploadData.file.length > 0) {
      uploadData.file.forEach((file, index) => {
        formData.append(`attachment_${index}`, file, file.name);
        formData.append(`fileName_${index}`, file.name);
      });
    }
    formData.append("notify", `${uploadData.notify}`);
    formData.append("sign", `${uploadData.sign}`);
    if (uploadData.id) {
      formData.append("id", `${uploadData.id}`);
    } else {
      formData.append("id", "0");
    }

    postCategoryDocument(typeId, cId, formData)
      .then((res) => {
        if (category.children) {
          const addedItems: CategoryAttachmentType[] = res.data;

          if (addedItems) {
            addedItems.forEach((addedItem: CategoryAttachmentType) => {
              if (uploadData.id > 0) {
                const existingItem: CategoryAttachmentType | undefined =
                  category.children!.find((c) => c.id === uploadData.id);
                if (existingItem) {
                  existingItem.code = addedItem.fileName;
                  existingItem.description = addedItem.description;
                  existingItem.bytes = addedItem.bytes;
                  existingItem.publish = addedItem.publish;
                  existingItem.publisher = addedItem.publisher;
                  existingItem.sign = addedItem.sign;
                  existingItem.notify = addedItem.notify;
                }
              } else {
                addedItem.level = category.level
                  ? category.level + 1
                  : category.level;
                addedItem.parentRowId = `${category.id}`;
                addedItem.leaf = true;
                addedItem.code = addedItem.fileName;
                category.children!.push(addedItem);
              }
            });
          }
        }

        setTreeState({ ...treeState });
        enqueueSnackbar(t("Upload Successfully"), {
          variant: "success",
        });
        setMaskLoader(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setMaskLoader(false);
      });
  };

  const updateTreeGrid = (categories: CategoryType[]) => {
    if (categories.length === 0) return;
    setTreeState({
      ...treeState,
      treeData: treeState.treeData.map((node: any) => {
        if (node.children.length > 0) {
          return {
            ...node,
            children: [
              ...categories.map((category: CategoryType, index: number) => {
                let child = node.children[index];
                return {
                  ...child,
                  ...category,
                  id: `${category.id}_${node.code}_child`,
                  parentRowId: `${node.id}`,
                  level: 1,
                  leaf: false,
                };
              }),
            ],
          };
        } else return node;
      }),
    });
  };

  const addCategories = (data: CategoryType[]) => {
    postCategory(data)
      .then((res) => {
        if (res.data.length > 0) {
          let categories: CategoryType[] = res.data.map(
            (item: CategoryType) => {
              let tmp = item.name;
              delete item.name;
              return { ...item, code: tmp };
            }
          );
          updateTreeGrid(categories);
        } else {
          setData([]);
        }
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
        setMaskLoader(false);
      });
  };

  const onRefresh = () => {
    setData([]);
    init();
  };

  return (
    <LegislativeDocumentPage
      treeState={treeState}
      setTreeState={setTreeState}
      loader={loading}
      data={data}
      columns={columns}
      fetchFunction={fetchFunction}
      onDeleteFile={onDeleteFile}
      onFileUpload={onFileUpload}
      addCategories={addCategories}
      onRefresh={onRefresh}
      loading={maskLoader}
    />
  );
};

export default memo(LegislativeDocumentContainer);
