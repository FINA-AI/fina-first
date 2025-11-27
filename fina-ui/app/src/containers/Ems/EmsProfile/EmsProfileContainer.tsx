import EmsProfilePage from "../../../components/EMS/EmsFiProfile/EmsProfilePage";
import { loadInspectionTypes } from "../../../api/services/ems/emsInspectionService";
import { EmsInspectionType } from "../../../types/inspection.type";
import { useEffect, useState } from "react";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { loadSanctionTypes } from "../../../api/services/ems/emsSanctionService";
import { SanctionDataType } from "../../../types/sanction.type";
import {
  loadFis,
  loadFiTreeData,
} from "../../../api/services/ems/emsFisService";
import { FiType } from "../../../types/fi.type";
import { BASE_URL, getLanguage } from "../../../util/appUtil";

interface EmsProfileContainerProps {}

const EmsProfileContainer: React.FC<EmsProfileContainerProps> = ({}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const langCode = getLanguage();

  const [inspectionTypes, setInspectionTypes] = useState<EmsInspectionType[]>(
    []
  );
  const [sanctionTypes, setSanctionTypes] = useState<SanctionDataType[]>([]);
  const [fis, setFis] = useState<any[]>([]);
  const [sqlQuery, setSqlQuery] = useState<{ query: string }>({
    query: "1 = 1",
  });
  const [selectedInspectionRow, setSelectedInspectionRow] = useState<any>();
  const [inspectionFis, setInspectionFis] = useState<FiType[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    getInspectionTypes();
    getSanctionTypes();
    getFiTypes();
    getInspectionFis();
  };

  const getFiTypes = async () => {
    try {
      const res = await loadFiTreeData();
      setFis(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  //TODO refactor
  const getInspectionTypes = () => {
    loadInspectionTypes(1, 1000000)
      .then((res) => {
        const resData = res.data;
        const data: EmsInspectionType[] = resData.list.map((item) => {
          const names =
            (item.names && item.names[langCode]) ||
            (Object.keys(item.names).length > 0 &&
              Object.values(item.names)[0]) ||
            "NONAME";

          const descriptions =
            (item.descriptions && item.descriptions[langCode]) ||
            (Object.keys(item.descriptions).length > 0 &&
              Object.values(item.descriptions)[0]) ||
            names;

          return {
            ...item,
            names,
            descriptions,
          };
        });

        setInspectionTypes(data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getSanctionTypes = () => {
    loadSanctionTypes(1, 1000000)
      .then((res) => {
        const resData = res.data;
        const data: SanctionDataType[] = resData.list.map((item) => ({
          ...item,
          name: item.names[langCode],
          type: item.type,
        }));
        setSanctionTypes(data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getInspectionFis = () => {
    loadFis()
      .then((res) => {
        const resData = [...res.data.list];
        setInspectionFis(resData);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const advancedFilterHandler = (query: string) => {
    const modifiedQueryString = query.slice(1, -1);
    setSqlQuery({ query: modifiedQueryString });
  };

  const onExportClick = () => {
    window.open(
      BASE_URL +
        `/rest/ems/v1/fi/export?filter=${
          sqlQuery.query ? encodeURIComponent(sqlQuery.query) : "1=1"
        }`,
      "_blank"
    );
  };

  return (
    <EmsProfilePage
      inspectionTypes={inspectionTypes}
      sanctionTypes={sanctionTypes}
      fis={fis}
      sqlQuery={sqlQuery}
      selectedInspectionRow={selectedInspectionRow}
      setSelectedInspectionRow={setSelectedInspectionRow}
      inspectionFis={inspectionFis}
      advancedFilterHandler={advancedFilterHandler}
      onExportClick={onExportClick}
      setSqlQuery={setSqlQuery}
    />
  );
};

export default EmsProfileContainer;
