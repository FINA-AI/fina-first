import EmsProfileMainToolbar from "./EmsProfileMainToolbar";
import EmsProfileInspectionContainer from "../../../containers/Ems/EmsProfile/EmsProfileInspectionContainer";
import { Box } from "@mui/material";
import EMSMainLayoutResizer from "../EmsLayout/EMSMainLayoutResizer";
import { BASE_URL, getLanguage, resizerMovement } from "../../../util/appUtil";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  EmsInspectionType,
  InspectionColumnData,
} from "../../../types/inspection.type";
import { SanctionDataType } from "../../../types/sanction.type";
import { FiType } from "../../../types/fi.type";
import AdvancedFilterModal from "./AdvancedFilterModal";
import EMSProfileDetails from "./EMSProfileDetails";
import { EmsFiProfileInspectionType } from "../../../types/emsFiProfile.type";
import { loadInspections } from "../../../api/services/ems/emsInspectionService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { inspectionFilter } from "../../../api/services/ems/emsFilterService";
import { loadInspectionColumns } from "../../../api/services/ems/emsInspectionColumnService";
import { styled } from "@mui/material/styles";

interface EmsProfilePageProps {
  inspectionTypes: EmsInspectionType[];
  sanctionTypes: SanctionDataType[];
  fis: any[];
  sqlQuery: { query: string };
  selectedInspectionRow: any;
  setSelectedInspectionRow: React.Dispatch<React.SetStateAction<any>>;
  inspectionFis: FiType[];
  advancedFilterHandler: (query: string) => void;
  onExportClick: () => void;
  setSqlQuery: React.Dispatch<React.SetStateAction<{ query: string }>>;
}

const StyledDetailWrapper = styled(Box)({
  height: "100%",
  display: "flex",
  boxSizing: "border-box",
  minWidth: "0px",
  flexDirection: "column",
});

const StyledContent = styled(Box)({
  height: "100%",
  display: "flex",
  boxSizing: "border-box",
  minWidth: "0px",
  minHeight: "0px",
});

const EmsProfilePage: React.FC<EmsProfilePageProps> = ({
  inspectionTypes,
  sanctionTypes,
  fis,
  sqlQuery,
  selectedInspectionRow,
  setSelectedInspectionRow,
  inspectionFis,
  advancedFilterHandler,
  onExportClick,
  setSqlQuery,
}: EmsProfilePageProps) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const langCode = getLanguage();

  const isMouseDownRef = useRef(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const resizerContainerRef = useRef<HTMLDivElement>(null);
  const inspectionRef = useRef<HTMLDivElement>(null);
  const [advancedFilterModal, setAdvancedFilterModal] = useState(false);
  const [resetToolbar, setResetToolbar] = useState(false);

  //EmsProfileInspectionContainer states
  const [rows, setRows] = useState<EmsFiProfileInspectionType[]>([]);
  const [rowsLen, setRowsLen] = useState<number>(0);
  const [pagingPage, setPagingPage] = useState<number>(1);
  const [pagingLimit, setPagingLimit] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const [isAdvancedFilterActive, setIsAdvancedFilterActive] =
    useState<boolean>(false);
  const [infoModal, setInfoModal] = useState(false);
  const [searched] = useState<object>({ fiCode: "" });
  const [filterQuery, setFilterQuery] = useState("1 = 1");
  const [inspectionColumns, setInspectionColumns] = useState<
    InspectionColumnData[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!inspectionColumns) {
        await getInspectionColumns();
      }
      await getInspections();
    };
    fetchData();
  }, [pagingLimit, pagingPage]);

  const handleMouseMove = (event: React.MouseEvent) => {
    resizerMovement(isMouseDownRef.current, event.clientX, resizerRef);
  };

  const getInspectionColumns = async () => {
    setLoading(true);
    loadInspectionColumns()
      .then((res) => {
        setInspectionColumns(res.data.filter((item) => item.visible));
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getInspections = (inspections?: any[]): void => {
    setLoading(true);
    let filter: any = { ...searched };
    if (inspections && inspections.length > 0) {
      filter.idFilter = inspections;
    }
    loadInspections(pagingPage, pagingLimit, filter)
      .then((res) => {
        const resData = res.data;
        setRowsLen(resData.totalResults);
        const data: any[] = resData.list.map((item) => ({
          ...item,
        }));
        setRows(data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const advancedFilterWrapper = (query: string) => {
    setResetToolbar(true);
    setIsFilterActive(false);
    setIsAdvancedFilterActive(true);
    setFilterQuery("1 = 1");
    filterInspections(query);
    advancedFilterHandler(query);
  };

  const filterInspections = (query: string) => {
    inspectionFilter(query)
      .then((res) => {
        if (res.data.inspections?.length === 0) {
          setRows([]);
          setRowsLen(0);
          setPagingPage(1);
          setLoading(false);
          setInfoModal(true);
        } else {
          getInspections(res.data.inspections);
        }
      })
      .catch((err) => {
        setLoading(false);
        openErrorWindow(err, t("error"), true);
      });
  };

  const onFilterClick = (filterData: any) => {
    let conditions: string[] = [];

    if (filterData.fis && filterData.fis.length > 0) {
      let fis = filterData.fis
        .filter((item: any) => item.level !== 0)
        .map((f: { id: string }) => f.id);
      if (fis.length > 0) {
        conditions.push(`inspection.fiId in (${fis.toString()})`);
      }
    }

    if (filterData.inspectionDocumentNumber) {
      conditions.push(
        `inspection.documentNumber like '%${filterData.inspectionDocumentNumber}%'`
      );
    }

    if (filterData.inspectionTypes?.id) {
      conditions.push(`inspectionTypes.id = ${filterData.inspectionTypes.id}`);
    }

    if (Number(filterData.status) >= 0) {
      conditions.push(`inspection.status = ${filterData.status}`);
    }

    if (filterData.sanctionDocumentNumber) {
      conditions.push(
        `sanction.documentNumber like '%${filterData.sanctionDocumentNumber}%'`
      );
    }

    if (filterData.sanctionType?.id) {
      conditions.push(
        `sanction.sanctionType.id = ${filterData.sanctionType.id}`
      );
    }

    if (filterData.synchronizedtype) {
      let isSynchronized = Boolean(
        filterData.synchronizedtype === "synchronizedaml"
      );
      conditions.push(`inspection.isSyncronized = ${isSynchronized}`);
    }

    if (conditions.length === 0) {
      return;
    }
    const query = `(${conditions.join(" and ")})`;

    if (filterQuery === query) return;

    setLoading(true);
    setIsFilterActive(true);
    setFilterQuery(query);
    filterInspections(query);
  };
  const onInspectionsExport = () => {
    const url = `${BASE_URL}/rest/ems/v1/file/export?filter=${encodeURIComponent(
      filterQuery
    )}&locale=${langCode}`;
    window.open(url, "_blank");
  };

  const onAdvancedFilterClear = () => {
    if (sqlQuery?.query && sqlQuery.query !== "1 = 1") {
      setIsAdvancedFilterActive(false);
      clearFilter(true);
    }
  };

  const onGridFilterClear = () => {
    if (filterQuery && filterQuery !== "1 = 1") {
      setIsFilterActive(false);
      clearFilter(false);
    }
  };

  const clearFilter = (isAdvancedFilter: boolean) => {
    isAdvancedFilter
      ? setSqlQuery({ query: "1 = 1" })
      : setFilterQuery("1 = 1");
    getInspections();
  };

  const MemoizedToolbar = useMemo(
    () => (
      <EmsProfileMainToolbar
        inspectionTypes={inspectionTypes}
        sanctionTypes={sanctionTypes}
        fis={fis}
        onFilterClick={onFilterClick}
        onFilterClear={onGridFilterClear}
        setAdvancedFilterModal={setAdvancedFilterModal}
        onExportClick={onExportClick}
        setSelectedInspectionRow={setSelectedInspectionRow}
        isFilterActive={isFilterActive}
        resetToolbar={resetToolbar}
        onResetHandled={() => setResetToolbar(false)}
        isAdvancedFilterActive={isAdvancedFilterActive}
      />
    ),
    [
      fis,
      sanctionTypes,
      inspectionTypes,
      filterQuery,
      isFilterActive,
      resetToolbar,
      isAdvancedFilterActive,
    ]
  );

  return (
    <StyledDetailWrapper
      onMouseMove={handleMouseMove}
      ref={mainContainerRef}
      data-testid={"fi-profile-page"}
    >
      {MemoizedToolbar}
      <StyledContent>
        <StyledContent flex={3} ref={inspectionRef}>
          <EmsProfileInspectionContainer
            resizerRef={resizerContainerRef}
            inspectionRef={inspectionRef}
            sqlQuery={sqlQuery}
            selectedInspectionRow={selectedInspectionRow}
            setSelectedInspectionRow={setSelectedInspectionRow}
            fis={inspectionFis}
            inspectionTypes={inspectionTypes}
            rows={rows}
            setRows={setRows}
            rowsLen={rowsLen}
            setRowsLen={setRowsLen}
            pagingPage={pagingPage}
            setPagingPage={setPagingPage}
            loading={loading}
            setLoading={setLoading}
            infoModal={infoModal}
            setInfoModal={setInfoModal}
            getInspections={getInspections}
            pagingLimit={pagingLimit}
            setPagingLimit={setPagingLimit}
            inspectionColumns={inspectionColumns}
            onInspectionExport={onInspectionsExport}
          />
        </StyledContent>
        <EMSMainLayoutResizer
          isMouseDownRef={isMouseDownRef}
          resizerRef={resizerRef}
          menuRef={menuRef}
          mainContainerRef={mainContainerRef}
          minWidth={50}
          position={"right"}
          setIsMenuOpen={() => {}}
          resizerContainerRef={resizerContainerRef}
        />
        <EMSProfileDetails
          menuRef={menuRef}
          selectedInspectionRow={selectedInspectionRow}
          sanctionTypes={sanctionTypes}
        />
      </StyledContent>
      {advancedFilterModal && (
        <AdvancedFilterModal
          advancedFilterModal={advancedFilterModal}
          setAdvancedFilterModal={setAdvancedFilterModal}
          advancedFilterHandler={advancedFilterWrapper}
          onFilterClear={onAdvancedFilterClear}
        />
      )}
    </StyledDetailWrapper>
  );
};

export default EmsProfilePage;
