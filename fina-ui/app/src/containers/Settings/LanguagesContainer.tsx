import LanguagesPage from "../../components/Settings/Languages/LanguagesPage";
import React, { useEffect, useState } from "react";
import {
  activateLang,
  addNewLanguage,
  deleteLanguage,
  editLanguage,
  getLanguages,
} from "../../api/services/languagesService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import { Language, Property } from "../../types/settings.type";
import { CancelIcon } from "../../api/ui/icons/CancelIcon";

interface LanguagesContainerProps {
  data: Property[];
  onSaveLanguage: (key: string, activeLang: Partial<Language>) => void;
  languages: Partial<Language>[];
  setLanguages: (languages: Partial<Language>[]) => void;
}

const LanguagesContainer: React.FC<LanguagesContainerProps> = ({
  data,
  onSaveLanguage,
  languages,
  setLanguages,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState<any>();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [currLang, setCurrLang] = useState<Language>();

  useEffect(() => {
    initLanguages();
  }, []);

  const initLanguages = () => {
    getLanguages().then((resp) => {
      const initialLang = data.find(
        (item) => item.key === "fina2.default.language.id"
      )?.value;

      let lang: Language[] = resp.data.map((item: Language) => {
        return { ...item, editMode: false };
      });

      let arr = [
        { ...lang.find((item) => item.code === initialLang), isDefault: true },
      ];
      let language: Partial<Language>[] = arr.concat(
        lang
          .filter((item) => item.code !== initialLang)
          .map((item) => {
            return { ...item, isDefault: false };
          })
      );
      setLanguages(language);
    });
  };

  const changeSelected = (lang: string) => {
    const changedLanguage = languages.map((item) => {
      if (item.code === lang) {
        return { ...item, isDefault: true };
      } else {
        return { ...item, isDefault: false };
      }
    });
    setLanguages(changedLanguage);
  };

  const onDeleteLanguage = async (id: number, data: Language) => {
    if (data.isDefault) {
      enqueueSnackbar(t("Default language can't be deleted"), {
        variant: "error",
      });
    } else {
      await deleteLanguage(id)
        .then(() => {
          setLanguages(languages.filter((item) => item.id !== id));
          enqueueSnackbar(t("deleted"), {
            variant: "success",
          });
        })
        .catch((err) => openErrorWindow(err, t("error"), true));
    }
  };

  const onEditLanguage = async (lang: Language) => {
    await editLanguage(lang)
      .then((resp) => {
        let arr = languages.map((item) => {
          return item.id === resp.data.id ? resp.data : item;
        });
        setLanguages(arr);
        enqueueSnackbar(t("edit"), {
          variant: "success",
        });
      })
      .catch((err) => openErrorWindow(err, t("error"), true));
  };

  const onCancelFunc = (card: Language, cardIndex: number) => {
    if (!card?.id) {
      let lang = languages.filter((_, index) => index !== cardIndex);
      setLanguages(lang);
      return;
    }
    setLanguages(languages);
  };

  const validateFields = (newLanguage: any) => {
    const fields = [
      "code",
      "name",
      "dateFormat",
      "dateTimeFormat",
      "htmlCharSet",
      "xmlEncoding",
      "numberFormat",
    ];
    for (let field of fields) {
      if (!newLanguage[field]) {
        return false;
      }
    }
    return true;
  };

  const addNewLanguageFunc = (newLanguage: Language, langIndex: number) => {
    if (validateFields(newLanguage)) {
      setCurrLang(newLanguage);
      addNewLanguage(newLanguage)
        .then((resp) => {
          setLanguages(
            languages.map((item, index) => {
              return langIndex === index
                ? { ...resp.data, editMode: false }
                : item;
            })
          );
          enqueueSnackbar(t("save"), {
            variant: "success",
          });
        })
        .catch((err) => {
          if (
            err.response?.data?.code === "LANGUAGE_PROGRAMMATICALLY_DELETED"
          ) {
            setErrorMessage(err.response?.data);
            setIsErrorModalOpen(true);
            return;
          }
          openErrorWindow(err, t("error"), true);
        });
    } else {
      enqueueSnackbar(t("requiredFieldsAreNotProvided"), {
        variant: "warning",
      });
    }
  };

  const activateDeletedLangHandler = async () => {
    try {
      let id = parseInt(errorMessage?.messageParams.slice(1, -1));
      const res = await activateLang(id);

      setLanguages([
        ...languages.map((item) =>
          item.id === currLang?.id ? res.data : item
        ),
      ]);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  return (
    <>
      <LanguagesPage
        languages={languages}
        changeSelected={changeSelected}
        onSaveLanguage={onSaveLanguage}
        onDeleteLanguage={onDeleteLanguage}
        onEditLanguage={onEditLanguage}
        addNewLanguageFunc={addNewLanguageFunc}
        onCancelFunc={onCancelFunc}
      />
      <ConfirmModal
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        onConfirm={() => {
          activateDeletedLangHandler();
          setIsErrorModalOpen(false);
        }}
        confirmBtnTitle={t("yes")}
        cancelBtnTitle={t("no")}
        bodyText={t("addLangWarning")}
        icon={<CancelIcon />}
      />
    </>
  );
};

export default LanguagesContainer;
