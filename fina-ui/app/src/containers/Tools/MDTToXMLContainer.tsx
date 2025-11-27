import MDTToXMLPage from "../../components/Tools/MDTToXML/MDTToXMLPage";
import { useEffect, useState } from "react";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { getReturnDefinitions } from "../../api/services/returnDefinitionService";
import { saveMDTToXML } from "../../api/services/toolsService";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LanguageType } from "../../types/common.type";
import { MDTToXMLData } from "../../types/tools.type";
import { ReturnDefinitionType } from "../../types/returnDefinition.type";
import { MdtDataTypeWithUIProps } from "../../types/mdt.type";

interface MDTToXMLContainerPros {
  languages: LanguageType[];
}

const MDTToXMLContainer = ({ languages }: MDTToXMLContainerPros) => {
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [data, setData] = useState<MDTToXMLData>({
    folder: "",
    language: null,
    definition: null,
    mdt: [],
    allReturns: false,
  });
  const [language, setLanguage] = useState<LanguageType[]>([]);
  const [definitions, setDefinitions] = useState<ReturnDefinitionType[]>([]);
  const [mask, setMask] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let result = languages.map((item) => {
      return { ...item, value: item.id, label: item.name };
    });
    setLanguage(result);
    setData({ ...data, language: result[0] });
    setMask(false);

    getReturnDefinitions()
      .then((res) => {
        setDefinitions([...res.data]);
        setData({ ...data, definition: res.data[0] });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const MDTChips = [
    { chipName: "all", value: "all" },
    { chipName: "id", value: "id" },
    { chipName: "parentId", value: "parentId" },
    { chipName: "dataType", value: "dataType" },
    { chipName: "type", value: "type" },
    { chipName: "sequence", value: "sequence" },
    { chipName: "evaluationMethod", value: "evalMethod" },
    { chipName: "descriptions", value: "descriptions" },
    { chipName: "code", value: "code" },
    { chipName: "required", value: "required" },
    { chipName: "toolsDisabled", value: "disabled" },
    { chipName: "equation", value: "equation" },
    { chipName: "comparisons", value: "comparisons" },
    { chipName: "dependentNodes", value: "dependents" },
    { chipName: "optional", value: "optional" },
  ];
  const save = () => {
    setMask(true);
    let info = {
      definitionCode: data.definition?.code,
      folderLocation: data.folder,
      allReturns: data.allReturns,
      body: [
        ...data.mdt
          .filter((item) => item.value !== "all")
          .map((item) => item.value),
      ],
    };
    saveMDTToXML(info)
      .then(() => {
        enqueueSnackbar(t("generateSuccessfully"), { variant: "success" });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setMask(false);
      });
  };

  const onMDTChange = (chip: { chipName: string; value: string }) => {
    let result: Partial<MdtDataTypeWithUIProps>[] = [];

    if (chip.value === "all") {
      result = data.mdt.find((item) => item.value === chip.value)
        ? []
        : [...MDTChips];
    } else {
      if (data.mdt.find((item) => item.value === chip.value)) {
        result = [
          ...data.mdt.filter(
            (item) => item.value !== "all" && item.value !== chip.value
          ),
        ];
      } else {
        if (data.mdt.length === MDTChips.length - 2) {
          result = [...MDTChips];
        } else {
          result = [...data.mdt, chip];
        }
      }
    }

    setData({ ...data, mdt: result });
  };

  return (
    <MDTToXMLPage
      languageData={language}
      MDTChips={MDTChips}
      setData={setData}
      data={data}
      definitions={definitions}
      save={save}
      loading={mask}
      onMDTChange={onMDTChange}
    />
  );
};

const languageReducer = "language";
const mapStateToProps = (state: any) => ({
  languages: state.getIn([languageReducer, "languages"]),
});

MDTToXMLContainer.propTypes = {
  languages: PropTypes.array,
};

export default connect(mapStateToProps)(MDTToXMLContainer);
