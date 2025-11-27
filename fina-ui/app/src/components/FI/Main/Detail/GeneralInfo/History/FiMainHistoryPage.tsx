import ClosableModal from "../../../../../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import MiniPaging from "../../../../../common/Paging/MiniPaging";
import PrimaryBtn from "../../../../../common/Button/PrimaryBtn";
import GridTable from "../../../../../common/Grid/GridTable";
import CheckIcon from "@mui/icons-material/Check";
import { FilterTypes } from "../../../../../../util/appUtil";
import { loadFIHistory } from "../../../../../../api/services/fi/fiService";
import useErrorWindow from "../../../../../../hoc/ErrorWindow/useErrorWindow";
import { FI_GENERAL_INFO_HISTORY_TABLE_KEY } from "../../../../../../api/TableCustomizationKeys";
import TableCustomizationButton from "../../../../../common/Button/TableCustomizationButton";
import { styled } from "@mui/material/styles";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../../../../types/common.type";

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalFooter,
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 24px",
}));

interface FiMainHistoryPageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  columns: GridColumnType[];
  setColumns: (cols: GridColumnType[]) => void;
  fiHistory: any[];
  setFIHistory: (rows: any[]) => void;
  fiHistoryLength: number;
  setFIHistoryLength: (length: number) => void;
  columnFilterConfig: columnFilterConfigType[];
  fiId: number;
}

const FiMainHistoryPage: React.FC<FiMainHistoryPageProps> = ({
  open,
  setOpen,
  columns,
  columnFilterConfig,
  setColumns,
  fiHistory,
  setFIHistory,
  fiHistoryLength = 0,
  setFIHistoryLength,
  fiId,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [pagingPage, setPagingPage] = useState<number>(1);
  const [pagingLimit] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(true);
  const [gridFilter, setGridFilter] = useState<Record<string, string | number>>(
    {}
  );

  useEffect(() => {
    if (pagingLimit > 0) {
      setLoading(true);
      loadFIHistory(fiId, pagingPage, pagingLimit)
        .then((res) => {
          const data = res.data;
          if (data) {
            let currId = 0;
            const mappedHistory = data.list.map((fi: any) => {
              currId++;
              return {
                ...fi.entity,
                modifiedAt: fi.modifiedAt,
                revisionType: fi.revisionType,
                id: currId,
              };
            });
            setFIHistory(mappedHistory);
            setFIHistoryLength(data.totalResults);
          }
        })
        .catch((error) => openErrorWindow(error, t("error"), true))
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [pagingPage, pagingLimit, gridFilter]);

  const onPagingPageChange = (page: number) => {
    setPagingPage(page);
  };

  const filterOnChangeFunction = (obj: columnFilterConfigType[]) => {
    const filter: Record<string, string | number> = {};

    for (let o of obj) {
      if (!o.name) continue;

      switch (o.type) {
        case FilterTypes.date:
          if (o.start) {
            filter[o.name + "From"] = o.start;
          }
          if (o.end) {
            filter[o.name + "To"] = o.end;
          }
          break;
        default:
          if (typeof o.value === "string" || typeof o.value === "number") {
            filter[o.name] = o.value;
          }
          break;
      }
    }

    setGridFilter(filter);
  };

  return (
    <ClosableModal
      onClose={() => setOpen(false)}
      open={open}
      width={900}
      height={500}
      title={t("changeHistory")}
      titleFontWeight={"600"}
    >
      <Box
        display={"flex"}
        width={"100%"}
        height={"100%"}
        flexDirection={"column"}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            maxHeight: 400,
          }}
        >
          <GridTable
            columns={columns}
            columnFilterConfig={columnFilterConfig}
            rows={fiHistory ? fiHistory : []}
            setRows={setFIHistory}
            selectedRows={[]}
            rowOnClick={() => {}}
            loading={loading}
            filterOnChangeFunction={filterOnChangeFunction}
          />
        </Box>
        <StyledFooter>
          <span>
            <TableCustomizationButton
              columns={columns}
              setColumns={setColumns}
              isDefault={false}
              hasColumnFreeze={true}
              tableKey={FI_GENERAL_INFO_HISTORY_TABLE_KEY}
            />
          </span>

          <MiniPaging
            totalNumOfRows={fiHistoryLength}
            initialedPage={pagingPage}
            onPageChange={(number) => onPagingPageChange(number)}
            initialRowsPerPage={pagingLimit}
          />

          <PrimaryBtn onClick={() => setOpen(false)} endIcon={<CheckIcon />}>
            {t("okay")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default FiMainHistoryPage;
