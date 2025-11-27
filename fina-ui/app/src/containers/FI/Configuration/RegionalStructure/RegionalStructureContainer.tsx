import RegionalStructurePage from "../../../../components/FI/Configuration/RegionalStructure/RegionalStructurePage";
import React, { useEffect, useState } from "react";
import {
  addProperty,
  deleteProperty,
  deleteRegion,
  getCountryItemByParentId,
  getRegionFIs,
  loadFirstLevel,
  loadProperties,
  loadRegionChildrenSearchPath,
  restore,
  save,
} from "../../../../api/services/regionService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import {
  CountryDataTypes,
  TreeGridColumnType,
  TreeState,
} from "../../../../types/common.type";
import { FiDataType } from "../../../../types/fi.type";

export interface RegionPropertiesType {
  id: number;
  level: string;
  name: string;
}

export interface CountryItemType extends CountryDataTypes {
  leaf?: boolean;
  children?: CountryItemType[];
  countryLevel?: number;
}

const RegionalStructureContainer = () => {
  const [treeState, setTreeState] = useState<TreeState>({
    treeData: [],
    columns: [],
  });
  const [selectedCountry, setSelectedCountry] = useState<
    CountryItemType | undefined
  >();
  const [countries, setCountries] = useState<CountryDataTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [regionFIs, setRegionFIs] = useState<FiDataType[] | null>(null);
  const [regionProperties, setRegionProperties] = useState<
    RegionPropertiesType[]
  >([]);
  const [countryItems, setCountryItems] = useState<CountryItemType[]>([]);
  const [defaultExpandedRowIds, setDefaultExpandedRowIds] = useState<number[]>(
    []
  );
  const [selectedCountrySearchPath, setSelectedCountrySearchPath] = useState<
    CountryItemType[]
  >([]);
  const [selectedSearchPathObject, setSelectedSearchPathObject] = useState<{
    name: string;
  }>({ name: "" });
  const [maxLevel, setMaxLevel] = useState(0);
  const [restoreProps, setRestoreProps] = useState<any>({});
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  let columnHeaderArray = [
    {
      field: "name",
      headerName: t("name"),
      dataIndex: "name",
      flex: 1,
      title: "name",
    },
  ];

  const [columns, setColumns] = useState<TreeGridColumnType[]>([]);

  useEffect(() => {
    setColumns(columnHeaderArray);
  }, []);

  useEffect(() => {
    setRegionFIs(null);
    if (regionProperties.length > 1) {
      setCountryItems([
        {
          ...selectedCountry,
          code: selectedCountry?.code ?? "",
          leaf: false,
        } as CountryItemType,
      ]);
    } else {
      setCountryItems([
        {
          ...selectedCountry,
          code: selectedCountry?.code ?? "",
        } as CountryItemType,
      ]);
    }
    setMaxLevel(regionProperties.length);
  }, [regionProperties]);

  const initCountries = async () => {
    setLoading(true);
    await loadFirstLevel()
      .then((resp) => {
        setCountries(resp.data);
        setLoading(false);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const initRegionProperties = async () => {
    await loadProperties()
      .then((resp) => {
        setRegionProperties(resp.data);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const initRegionFIsDemoData = async () => {
    if (countryItems && countryItems[0].id) {
      await getRegionFIs(countryItems[0].id)
        .then((resp) => {
          let data = resp.data;
          if (data) {
            setRegionFIs(data);
          }
        })
        .catch((error) => openErrorWindow(error, t("error"), true));
    }
  };

  useEffect(() => {
    initCountries();
    initRegionProperties();
  }, []);

  const getRegionFIsDemoDataFunction = () => {
    initRegionFIsDemoData();
  };

  const getNewTreeItemDelete = (
    parent: CountryItemType[],
    id: number,
    data: CountryItemType
  ): CountryItemType[] => {
    return parent.map((item) =>
      item.id === id
        ? {
            ...item,
            children: item.children?.filter((child) => child.id !== data.id),
          }
        : {
            ...item,
            children: item.children
              ? getNewTreeItemDelete(item.children, id, data)
              : [],
          }
    );
  };

  const deleteCountryFunction = (country: CountryItemType) => {
    deleteRegion(country.id)
      .then(() => {
        setTreeState({
          ...treeState,
          treeData: getNewTreeItemDelete(
            treeState.treeData as CountryItemType[],
            country.parentId,
            country
          ),
        });
        setCountries(countries.filter((item) => item.id !== country.id));
        if (country.parentId === 0) setSelectedCountry(undefined);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const addCountryFunction = (country: CountryItemType) => {
    const data =
      country.id === 0
        ? countries
        : countries.filter((item) => item.id !== country.id);
    save(country)
      .then((res) => {
        if (country.id > 0) {
          const updated = countries.map((c) =>
            c.id === res.data.id ? res.data : c
          );
          setCountries(updated);
        } else {
          setCountries([...data, res.data]);
        }
        setSelectedCountry(res.data);
        enqueueSnackbar(
          t(
            country.id === 0 ? "countryAddedSuccessfully" : "countryEditSuccess"
          ),
          { variant: "success" }
        );
      })
      .catch((error) => {
        if (error.response?.data?.code === "ENTITY_PROGRAMMATICALLY_DELETED") {
          setOpenRestoreModal(true);
          setRestoreProps({ ...country });
        } else {
          openErrorWindow(error, t("error"), true);
        }
      });
  };

  const onRegionPropertyChangeFunction = (data: RegionPropertiesType[]) => {
    addProperty(data)
      .then(() => {
        setRegionProperties(data);
        enqueueSnackbar(t("regionPropertyEditSuccess"), { variant: "success" });
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const onRegionPropertySaveFunction = (
    regionProperty: RegionPropertiesType
  ) => {
    if (regionProperty.id === 0) {
      let data = [
        ...regionProperties.map((item) => {
          return item.id === 0
            ? { ...item, level: `Level ${regionProperties.length}` }
            : item;
        }),
        {
          ...regionProperty,
          level: `Level ${regionProperties.length}`,
          id: regionProperties.length,
        },
      ];
      onRegionPropertyChangeFunction(data);
    } else {
      let data = [
        ...regionProperties.map((item) => {
          //item.level = `Level ${item.level}`;
          return item.id === regionProperty.id
            ? { ...item, name: regionProperty.name }
            : item;
        }),
      ];
      onRegionPropertyChangeFunction(data);
    }
  };

  const onRegionPropertyDeleteFunction = () => {
    let lastPropertyItem = regionProperties[regionProperties.length - 1];
    let data = regionProperties
      .filter((item) => item.id !== lastPropertyItem.id)
      .map((item, index) => {
        return item.id === 0
          ? { ...item, level: `Level ${regionProperties.length - 2}` }
          : { ...item, level: `Level ${index}` };
      });

    deleteProperty()
      .then(() => {
        setRegionProperties([...data]);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const getCountryItem = () => {
    if (!selectedCountry) return;
    let item: any = { ...selectedCountry } as CountryDataTypes;
    delete item.level;
    item.countryLevel = selectedCountry["level"];
    setCountryItems([item]);
  };

  useEffect(() => {
    if (selectedCountry) {
      getCountryItem();
      loadSelectedCountrySearchPath();
      setRegionFIs(null);
      setSelectedSearchPathObject({ name: "" });
    }
  }, [selectedCountry]);

  const getChildren = async (parentId: number) => {
    if (selectedCountry) {
      if (parentId === 0) {
        return countryItems;
      } else {
        let resp = await getCountryItemByParentId(parentId);
        const data = resp.data;
        let newArray = [];
        for (let o of data) {
          let i = { ...o };
          delete i.level;
          i.countryLevel = o["level"];
          newArray.push(i);
        }

        return data ? newArray : [];
      }
    } else {
      return [];
    }
  };

  const getNewTreeItemADD = (parent: any, id: number, data: any) => {
    if (!parent) return null;
    return parent.map((item: any) => {
      return item.id === id
        ? {
            ...item,
            children: item.children && [
              ...item.children,
              { ...data, level: item.level + 1 },
            ],
          }
        : {
            ...item,
            children: getNewTreeItemADD(item.children, id, data),
          };
    });
  };

  const updateCountries = (updatedCountry: CountryItemType) => {
    setCountries(
      countries.map((country) =>
        country.id === updatedCountry.id
          ? { ...country, name: updatedCountry.name, code: updatedCountry.code }
          : country
      )
    );
  };

  const getNewTreeItemEdit = (treeData: any, editedNode: any) => {
    if (editedNode.level === 0) updateCountries(editedNode);

    return treeData.map((treeNode: any) =>
      treeNode.id === editedNode.id
        ? { ...editedNode }
        : treeNode.children?.length
        ? {
            ...treeNode,
            children: getNewTreeItemEdit(treeNode.children, editedNode),
          }
        : treeNode
    );
  };

  const saveCountryItemFunction = (countryItem: any, selectedItem: any) => {
    let data = { ...countryItem };
    if (countryItem.id === 0 && !Boolean(countryItem.parentId)) {
      data.parentId = selectedItem.id;
      data.level = selectedItem.level + 1;
    }
    save(data)
      .then((resp) => {
        if (countryItem.id === 0) {
          setTreeState({
            ...treeState,
            treeData: getNewTreeItemADD(
              treeState.treeData,
              resp.data.parentId,
              resp.data
            ),
          });
          enqueueSnackbar(t("countryAddedSuccessfully"), {
            variant: "success",
          });
        } else {
          setTreeState({
            ...treeState,
            treeData: getNewTreeItemEdit(treeState.treeData, data),
          });
          enqueueSnackbar(t("countryEditSuccess"), {
            variant: "success",
          });
        }
      })
      .catch((error) => {
        if (error.response.data.code === "ENTITY_PROGRAMMATICALLY_DELETED") {
          setOpenRestoreModal(true);
          setRestoreProps({ ...countryItem, parentId: selectedItem.id });
        } else {
          openErrorWindow(error, t("error"), true);
        }
      });
  };

  const restoreDeletedRegion = () => {
    let data =
      restoreProps.id === 0
        ? countries
        : countries.filter((item) => item.id !== restoreProps.id);
    restore(restoreProps)
      .then((resp) => {
        if (restoreProps.parentId === 0) {
          setCountries([...data, resp.data]);
        } else {
          setTreeState({
            ...treeState,
            treeData: getNewTreeItemADD(
              treeState.treeData,
              resp.data.parentId,
              resp.data
            ),
          });
        }
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const countryItemDeleteFunction = (countryItem: CountryItemType[]) => {
    deleteCountryFunction(countryItem[0]);
  };

  const loadSelectedCountrySearchPath = () => {
    if (!selectedCountry || !selectedCountry.id) return;
    loadRegionChildrenSearchPath(selectedCountry?.id)
      .then((res) => {
        setSelectedCountrySearchPath(res.data);
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const expandToPath = async (region: any) => {
    setSelectedSearchPathObject(region);
    setFilterLoading(true);
    let path = [region?.id];

    const getParentRecursive = (pId: number, arr: any) => {
      if (pId === 0) return arr;

      const p = selectedCountrySearchPath.find((r) => r.id === pId);
      arr.push(p?.id);
      if (p && p.parentId > 0) {
        getParentRecursive(p.parentId, arr);
      }
      return arr;
    };

    getParentRecursive(region.parentId, path);
    path.reverse();

    const result = path.slice(1);
    const updatedItems = [...countryItems];

    const getChildrenRecursive = async (
      parentId: number,
      currentLevel: number,
      path: any
    ) => {
      const resp = await getCountryItemByParentId(parentId);
      const children = resp.data;

      const constructRegionChildren = (
        items: any,
        parentId: number,
        children: any,
        currentLevel: number
      ) => {
        for (let item of items) {
          if (item.id === parentId) {
            item.children = item.children || [];
            const newChildren = children
              .filter(
                (child: any) =>
                  !item.children.some(
                    (existingChild: any) => existingChild.id === child.id
                  )
              )
              .map((child: any) => ({ ...child, level: currentLevel + 1 }));

            item.children = [...item.children, ...newChildren];
            break;
          }
          if (item.children) {
            constructRegionChildren(
              item.children,
              parentId,
              children,
              currentLevel + 1
            );
          }
        }
      };

      constructRegionChildren(updatedItems, parentId, children, currentLevel);

      if (path.length > 0) {
        const [childId, ...remainingPath] = path;
        await getChildrenRecursive(childId, currentLevel, remainingPath);
      }
    };

    await getChildrenRecursive(path[0], 0, result);

    setCountryItems(updatedItems);
    setDefaultExpandedRowIds(path);
    setFilterLoading(false);
  };

  const onFilterClear = () => {
    setDefaultExpandedRowIds([]);
  };

  return (
    <RegionalStructurePage
      treeState={treeState}
      setTreeState={setTreeState}
      loading={loading}
      countries={countries}
      selectedCountry={selectedCountry}
      setSelectedCountry={setSelectedCountry}
      deleteCountryFunction={deleteCountryFunction}
      addCountryFunction={addCountryFunction}
      regionFIs={regionFIs}
      regionProperties={regionProperties}
      onRegionPropertyDeleteFunction={onRegionPropertyDeleteFunction}
      onRegionPropertySaveFunction={onRegionPropertySaveFunction}
      getRegionFIsDemoDataFunction={getRegionFIsDemoDataFunction}
      saveCountryItemFunction={saveCountryItemFunction}
      getChildren={getChildren}
      countryItem={countryItems}
      setCountryItems={setCountryItems}
      columns={columns}
      countryItemDeleteFunction={countryItemDeleteFunction}
      maxLevel={maxLevel}
      openRestoreModal={openRestoreModal}
      setOpenRestoreModal={setOpenRestoreModal}
      restoreRegionFunc={restoreDeletedRegion}
      defaultExpandedRowIds={defaultExpandedRowIds}
      filterLoading={filterLoading}
      regionSearchData={selectedCountrySearchPath}
      expandToPath={expandToPath}
      filterOnClear={onFilterClear}
      filterSelectedItem={selectedSearchPathObject}
    />
  );
};

export default RegionalStructureContainer;
