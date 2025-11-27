import PackagePage from "../../components/Tools/Package/PackagePage";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import React, { useEffect, useState } from "react";
import {
  deletePackage,
  getPackages,
  loadToolFiTypes,
  postPackage,
} from "../../api/services/toolsService";
import { getReturnTypes } from "../../api/services/returnsService";
import { OSTPackage } from "../../types/tools.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import { ReturnType } from "../../types/returnDefinition.type";
import { FiTypeDataType } from "../../types/fi.type";
import { FilterTypes } from "../../util/appUtil";

export interface DeleteModal {
  isOpen: boolean;
  row: OSTPackage | null;
}

const PackageContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [originalData, setOriginalData] = useState<OSTPackage[]>([]);
  const [data, setData] = useState<OSTPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({
    isOpen: false,
    row: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [returnTypes, setReturnTypes] = useState<ReturnType[]>();
  const [fiTypes, setFiTypes] = useState<FiTypeDataType[]>();
  const [columnFilterConfig, setColumnFilterConfig] = useState<
    columnFilterConfigType[]
  >([]);

  const getFilters = () => {
    let filterArray = fiTypes?.map((item) => ({
      label: `${item.code} / ${item.name}`,
      value: item.id,
    }));

    return [
      {
        field: "code",
        type: FilterTypes.string,
        name: "filterCode",
      },
      {
        field: "note",
        type: FilterTypes.string,
        name: "filterNote",
      },
      {
        field: "type",
        type: FilterTypes.list,
        name: "filterType",
        filterArray: filterArray,
      },
    ];
  };

  useEffect(() => {
    init();
    initFiTypes();
    initReturnTypes();
    setColumns([
      {
        field: "code",
        headerName: t("packageCode"),
        flex: 1,
      },
      {
        field: "note",
        headerName: t("packageNote"),
        flex: 1,
      },
      {
        field: "type",
        headerName: t("type"),
        flex: 1,
        renderCell: (val, row) => {
          return row.fiTypes[0]?.name;
        },
      },
    ]);
  }, []);

  useEffect(() => {
    if (fiTypes) {
      setColumnFilterConfig(getFilters());
    }
  }, [fiTypes]);

  const initFiTypes = async () => {
    const res = await loadToolFiTypes();
    setFiTypes(res.data);
  };

  const initReturnTypes = async () => {
    const res = await getReturnTypes();
    setReturnTypes(res.data);
  };

  const init = () => {
    getPackages()
      .then((resp) => {
        const data = resp.data.map((row: OSTPackage) => {
          return {
            ...row,
            type: row.fiTypes.length > 0 ? row.fiTypes[0].name : "",
          };
        });
        setData(data);
        setOriginalData(data);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const rowEditFunction = () => {};

  const rowDeleteFunction = (row: OSTPackage) => {
    setDeleteModal({ isOpen: true, row: row });
  };

  const onDeleteFunction = () => {
    deletePackage(deleteModal?.row?.id)
      .then(() => {
        setData(data.filter((row) => row.id !== deleteModal?.row?.id));
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        closeDeleteModal();
      });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, row: null });
  };

  const onPackageSave = (item: OSTPackage) => {
    postPackage(item)
      .then((res) => {
        let resp = res.data;
        setIsEditModalOpen(false);
        if (!item.id) {
          setData([...data, resp]);
        } else {
          if (resp) {
            setData([
              ...data.map((item) => {
                if (item.id === resp.id) {
                  return resp;
                }
                return item;
              }),
            ]);
          }
        }
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const filterOnChangeFunction = (filters: FilterType[]) => {
    let filtered = [...originalData];

    filters.forEach((filter) => {
      if (!filter.value || filter.value === "") return;

      switch (filter.type) {
        case FilterTypes.string:
          filtered = filtered.filter((row) =>
            (row.code ?? "").toLowerCase().includes(filter.value.toLowerCase())
          );
          break;

        case FilterTypes.list:
          filtered = filtered.filter(
            (row) => row.fiTypes[0].id === Number(filter.value)
          );
          break;

        default:
          break;
      }
    });

    setData(filtered);
  };

  return (
    <PackagePage
      data={data}
      loading={loading}
      columns={columns}
      setData={setData}
      rowEditFunction={rowEditFunction}
      rowDeleteFunction={rowDeleteFunction}
      deleteModal={deleteModal}
      onDeleteFunction={onDeleteFunction}
      closeDeleteModal={closeDeleteModal}
      onPackageSave={onPackageSave}
      isEditModalOpen={isEditModalOpen}
      setIsEditModalOpen={setIsEditModalOpen}
      returnTypes={returnTypes}
      fiTypes={fiTypes}
      columnFilterConfig={columnFilterConfig}
      filterOnChangeFunction={filterOnChangeFunction}
    />
  );
};

export default PackageContainer;
