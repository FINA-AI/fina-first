import { useEffect, useState } from "react";
import {
  deleteLicenseOperation,
  getLicenseOperation,
  getLicenseType,
  saveLicenseOperation,
  updateLicenseOperation,
} from "../../../../api/services/licenseService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { LicenseOperationType, LicenseType } from "../../../../types/fi.type";
import { CurrencyItem } from "../../../../components/FI/Configuration/License/Create/ConfigLicenseCreate";
import ConfigLicenseItemPage from "../../../../components/FI/Configuration/License/Item/ConfigLicenseItemPage";

export interface LicenseTypeWithUIProps extends LicenseType {
  children: LicenseOperationType[];
  description: string;
  level: number;
  name: string;
  licenseTypeId: number;
  parentId: number;
  nationalCurrency: boolean;
  foreignCurrency: boolean;
}

const ConfigLicenseItemContainer = () => {
  const [licenseItem, setLicenseItem] = useState<LicenseTypeWithUIProps>(
    {} as LicenseTypeWithUIProps
  );
  const [loading, setLoading] = useState(true);
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  let { id } = useParams<{ id: string }>();

  // const onFilterClick = (searchValue: string) => {
  //   if (!searchValue || (searchValue && searchValue.trim().length > 2)) {
  //     //TODO Configuration License Inner Page Search
  //     console.log(searchValue);
  //   }
  // };

  const loadLicenseType = async () => {
    setLoading(true);
    await getLicenseType(id)
      .then((resp) => {
        let data = resp.data;
        if (data) {
          let operations = [...data.operations];
          setLicenseItem({
            ...resp.data,
            id: 0,
            level: 1,
            description: resp.data.name,
            children: operations.map((item) => {
              let newObj = { ...item, level: 2 };
              delete newObj.children;
              return newObj;
            }),
          });

          let expandedRows = [];
          expandedRows.push(data.id);
          for (let licItem of operations) {
            expandedRows.push(licItem.id);
          }
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLicenseType();
  }, []);

  const loadChildren = async (row: LicenseTypeWithUIProps) => {
    await getLicenseOperation(row.licenseTypeId, row.id)
      .then((resp) => {
        const data = resp.data;
        if (data) {
          let newChildren = licenseItem.children.map((item) => {
            if (
              item.id === row.id &&
              item.licenseTypeId === row.licenseTypeId
            ) {
              let subChildren = data.map((sumItem: LicenseOperationType) => {
                return { ...sumItem, level: 3 };
              });
              return { ...item, children: [...subChildren] };
            } else {
              return item;
            }
          });
          setLicenseItem({ ...licenseItem, children: newChildren });
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const deleteLicense = (row: LicenseTypeWithUIProps) => {
    setLoading(true);
    deleteLicenseOperation(row.id)
      .then(() => {
        if (row.parentId === 0) {
          let licenseOperations = [
            ...licenseItem.children.filter((opItem) => opItem.id !== row.id),
          ];
          setLicenseItem({ ...licenseItem, children: licenseOperations });
        } else {
          let licenseOperations = [
            ...licenseItem.children.map((opItem) => {
              if (opItem.id === row.parentId) {
                let opSubLevelItems = [
                  ...opItem.children.filter((subItem) => subItem.id !== row.id),
                ];
                return { ...opItem, children: opSubLevelItems };
              } else {
                return opItem;
              }
            }),
          ];
          setLicenseItem({ ...licenseItem, children: licenseOperations });
        }
        enqueueSnackbar(t("deleted"), { variant: "success" });
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const saveLicense = (isEdit: boolean, data: any, defaultData: any) => {
    if (!data.code || !data.name) {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
    } else {
      if (isEdit) {
        let obj: any = {};
        if (defaultData.id === 0) {
          obj = {
            code: data.code,
            id: Number(id),
            name: data.name,
            nameStrId: defaultData.nameStrId,
            operations: defaultData.operations,
            version: defaultData.version,
          };
        } else {
          let currencies = data.currencies;

          obj = {
            children: [],
            code: data.code,
            description: data.name,
            descriptionStrId: defaultData.descriptionStrId,
            foreignCurrency:
              currencies !== null &&
              currencies.some(
                (item: CurrencyItem) => item.value === "foreignCurrency"
              ),
            id: defaultData.id,
            licenseTypeId: defaultData.licenseTypeId,
            nationalCurrency:
              currencies !== null &&
              currencies.some(
                (item: CurrencyItem) => item.value === "nationalCurrency"
              ),
            parentId: defaultData.parentId,
          };
        }
        setLoading(true);
        updateLicenseOperation(obj)
          .then(() => {
            if (obj.parentId === 0) {
              let licenseOperations = [
                ...licenseItem.children.map((item) => {
                  return item.id === obj.id
                    ? { ...obj, level: 2, children: item.children }
                    : item;
                }),
              ];
              setLicenseItem({ ...licenseItem, children: licenseOperations });
            } else {
              let licenseOperations = [
                ...licenseItem.children.map((opItem) => {
                  if (opItem.id === obj.parentId) {
                    let opItemSubLevels = opItem.children.map((subItem) => {
                      return subItem.id === obj.id
                        ? { ...obj, level: 3 }
                        : subItem;
                    });
                    return { ...opItem, children: opItemSubLevels };
                  } else {
                    return opItem;
                  }
                }),
              ];

              setLicenseItem({ ...licenseItem, children: licenseOperations });
            }

            enqueueSnackbar(t("saved"), { variant: "success" });
            setLoading(false);
          })
          .catch((err) => {
            openErrorWindow(err, t("error"), true);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        let currencies = data.currencies;
        let obj = {
          children: [],
          code: data.code,
          description: data.name,
          descriptionStrId: "",
          foreignCurrency: null,
          id: 0,
          licenseTypeId: id,
          nationalCurrency: null,
          parentId: 0,
        };
        if (defaultData.id !== 0) {
          obj.parentId = defaultData.id;
        } else {
          obj.foreignCurrency =
            currencies !== null &&
            currencies.some(
              (item: CurrencyItem) => item.value === "foreignCurrency"
            );
          obj.nationalCurrency =
            currencies !== null &&
            currencies.some(
              (item: CurrencyItem) => item.value === "nationalCurrency"
            );
        }

        saveLicenseOperation(obj)
          .then((resp) => {
            let data = resp.data;
            if (data) {
              let newOperations = { ...licenseItem };
              if (defaultData.id === 0) {
                newOperations.children.unshift({ ...data, level: 2 });
                setLicenseItem(newOperations);
              } else {
                for (let item of newOperations.children) {
                  if (item.id === data.parentId && item.children) {
                    item.children.unshift({ ...data, level: 3 });
                    break;
                  }
                }

                setLicenseItem(newOperations);
              }
            }
            enqueueSnackbar(t("saved"), { variant: "success" });
          })
          .catch((err) => {
            openErrorWindow(err, t("error"), true);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  return (
    <ConfigLicenseItemPage
      licenseItem={licenseItem}
      loadChildren={loadChildren}
      deleteLicense={deleteLicense}
      saveLicense={saveLicense}
      loading={loading}
    />
  );
};

export default ConfigLicenseItemContainer;
