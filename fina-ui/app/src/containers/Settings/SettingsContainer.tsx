import SettingsPage from "../../components/Settings/SettingsPage";
import {
  loadProperties,
  saveProperties,
} from "../../api/services/configService";
import { memo, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { Language, Property } from "../../types/settings.type";

const SettingsContainer = () => {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [activeList, setActiveList] = useState("security");
  const [asGridActive, setAsGridActive] = useState(false);
  const [changeTabName, setChangeTabName] = useState<boolean | string>();
  const [langConfirmModal, setLangConfirmModal] = useState<boolean>();
  const [languages, setLanguages] = useState<Partial<Language>[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    loadProperties()
      .then((resp) => {
        const data = resp.data.map((r: Property, index: number) => {
          return { ...r, id: index };
        });
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeSecurity = (key: string, value: string) => {
    const field = data.find((item) => item.key === key);
    if (!field) return;
    setData(
      data.map((item) =>
        item.id === field.id
          ? { ...item, immutableData: { ...field }, value: value }
          : item
      )
    );
  };

  const onSaveLanguage = (key: string, activeLang: Language) => {
    const langObj = data.find((item) => item.key === key);
    if (langObj) {
      langObj.value = activeLang.code;

      const submitLanguage = [{ id: langObj.id, key, value: langObj.value }];
      saveProperties(submitLanguage)
        .then(() => {
          loadData();
        })
        .finally(() => {});
    }
  };

  const onChange = (key: string, value: string) => {
    const field = data.find((item) => item.key === key);
    if (field) {
      field.immutableData = { ...field };
      field.value = value;
    }
  };

  const onSaveClick = () => {
    setLoading(true);
    const submitData = data
      .filter((d) => !!d.immutableData)
      .map((d) => {
        return {
          id: d.id,
          key: d.key,
          value: d.value,
        };
      });

    saveProperties(submitData)
      .then(() => {
        loadData();
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const changeTabNameHandler = () => {
    if (typeof changeTabName === "string") {
      setActiveList(changeTabName);
      langConfirmModal && setLangConfirmModal(false);
    } else {
      setAsGridActive(!changeTabName);
    }
  };

  const onChangeTabConfirm = () => {
    loadData();
    changeTabNameHandler();
    setCancelOpen(false);
  };

  return (
    <SettingsPage
      data={data}
      setData={setData}
      onSaveClick={onSaveClick}
      loading={loading}
      onChange={onChange}
      onChangeSecurity={onChangeSecurity}
      isCancelOpen={isCancelOpen}
      setCancelOpen={setCancelOpen}
      onChangeTabConfirm={onChangeTabConfirm}
      activeList={activeList}
      setActiveList={setActiveList}
      asGridActive={asGridActive}
      setAsGridActive={setAsGridActive}
      setChangeTabName={setChangeTabName}
      onSaveLanguage={onSaveLanguage}
      langConfirmModal={langConfirmModal}
      languages={languages}
      setLanguages={setLanguages}
    />
  );
};

export default memo(SettingsContainer);
