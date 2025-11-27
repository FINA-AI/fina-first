import ClosableModal from "./ClosableModal";
import { Box } from "@mui/system";
import GridTable from "../Grid/GridTable";
import MiniPaging from "../Paging/MiniPaging";
import PrimaryBtn from "../Button/PrimaryBtn";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useTranslation } from "react-i18next";
import TableCustomizationButton from "../Button/TableCustomizationButton";
import React from "react";
import { FilterType, GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface FIHistoryModalProps {
  onCloseHistoryClick: () => void;
  data: any;
  filterOnChangeFunction?: (filters: FilterType[]) => void;
  columns: GridColumnType[];
  pagingPage: number;
  pagingLimit: number;
  totalResults: number;
  setPagingPage: (value: number) => void;
  loading?: boolean;
  setColumns: (columns: GridColumnType[]) => void;
  tableKey: string;
  onPagingLimitChange?: (page: number) => void;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  height: 40,
  padding: 10,
  justifyContent: "space-between",
  ...theme.modalFooter,
}));

const FIHistoryModal: React.FC<FIHistoryModalProps> = ({
  onCloseHistoryClick,
  data,
  filterOnChangeFunction,
  columns,
  totalResults,
  pagingPage,
  setPagingPage,
  pagingLimit,
  loading,
  setColumns,
  tableKey,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ClosableModal
        onClose={onCloseHistoryClick}
        open={true}
        title={t("changeHistory")}
        titleFontWeight={"600px"}
        width={900}
        height={600}
        includeHeader={true}
      >
        <Box
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <GridTable
            columns={columns}
            rows={data}
            selectedRows={[]}
            setRows={() => {}}
            loading={loading}
            filterOnChangeFunction={filterOnChangeFunction}
          />
          <StyledFooter>
            <Box>
              <span>
                <TableCustomizationButton
                  columns={columns}
                  setColumns={setColumns}
                  tableKey={tableKey}
                />
              </span>
            </Box>
            <MiniPaging
              totalNumOfRows={totalResults}
              initialedPage={pagingPage}
              onPageChange={(number) => setPagingPage(number)}
              initialRowsPerPage={pagingLimit}
            />
            <Box>
              <PrimaryBtn
                onClick={onCloseHistoryClick}
                endIcon={<CheckRoundedIcon />}
                data-testid={"confirm-button"}
              >
                {t("okay")}
              </PrimaryBtn>
            </Box>
          </StyledFooter>
        </Box>
      </ClosableModal>
    </>
  );
};

export default FIHistoryModal;
