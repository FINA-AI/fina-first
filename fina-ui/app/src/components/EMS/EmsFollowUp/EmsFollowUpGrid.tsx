import { Box } from "@mui/system";
import { FollowUpType } from "../../../types/followUp.type";
import GridTable from "../../common/Grid/GridTable";
import Paging from "../../common/Paging/Paging";
import React, { useEffect, useState } from "react";
import { DeleteFormType, GridColumnType } from "../../../types/common.type";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GhostBtn from "../../common/Button/GhostBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DeleteForm from "../../common/Delete/DeleteForm";
import EmsFollowUpCreateModal from "./EmsFollowUpCreateModal";
import EmsFollowUpStatusCell from "./EmsFollowUpStatusCell";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { EMS_FOLLOW_UP_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import { connect } from "react-redux";
import { Typography } from "@mui/material";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

interface EmsFollowUpGridProps {
  setPagingPage: React.Dispatch<React.SetStateAction<any>>;
  setPagingLimit: React.Dispatch<React.SetStateAction<any>>;
  rowsLen: number;
  loading: boolean;
  rows: FollowUpType[];
  pagingLimit: number;
  pagingPage: number;
  deleteFollowUp: (
    deleteModal: DeleteFormType,
    setDeleteModal: React.Dispatch<React.SetStateAction<DeleteFormType | null>>
  ) => void;
  onRefresh: () => void;
  onCreateFollowUp: (
    data: FollowUpType,
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  onUpdateFollowUp: (
    data: FollowUpType,
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  selectedFollowUpRow: FollowUpType | null;
  setSelectedFollowUpRow: React.Dispatch<
    React.SetStateAction<FollowUpType | null>
  >;
  state: any;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  width: "100%",
  minWidth: "0px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  width: "100%",
  minWidth: "0px",
}));

const StyledHeaderItem = styled(Box)(({ theme }: any) => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  "& .MuiButton-root": {
    marginRight: "10px",
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "dark" ? "#2D3747" : "#F5F7FA",
  },
  margin: 9,
}));

const StyledBody = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
  paddingTop: 0,
  overflow: "hidden",
}));

const StyledPagingBox = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "small" }),
}));

const StyledHeaderText = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#F5F7FA" : "#2D3747",
  maxWidth: "80px",
}));

const EmsFollowUpGrid: React.FC<EmsFollowUpGridProps> = ({
  rows,
  rowsLen,
  setPagingLimit,
  setPagingPage,
  loading,
  pagingLimit,
  pagingPage,
  selectedFollowUpRow,
  setSelectedFollowUpRow,
  deleteFollowUp,
  onRefresh,
  onCreateFollowUp,
  onUpdateFollowUp,
  state,
  orderRowByHeader,
}: EmsFollowUpGridProps) => {
  const { t } = useTranslation();
  const { getDateFormat, hasPermission } = useConfig();

  const [deleteModal, setDeleteModal] = useState<DeleteFormType>({
    isOpen: false,
    selectedRow: null,
  });
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  let headerColumns = [
    {
      field: "fiCode",
      headerName: t("fiCode"),
      width: 150,
      renderCell: (value: any, row: any) => {
        if (row.inspection) {
          return row.inspection.fiCode;
        }
      },
    },
    {
      field: "fiName",
      headerName: t("fiName"),
      width: 150,
      renderCell: (value: any, row: any) => {
        if (row.inspection) {
          return row.inspection.fiName;
        }
      },
    },
    {
      field: "decreeNumber",
      headerName: t("decreenumber"),
      width: 100,
      renderCell: (value: any, row: any) => {
        if (row.inspection) {
          return row.inspection.decreeNumber;
        }
      },
    },
    {
      field: "decreeDate",
      headerName: t("decreedate"),
      width: 100,
      hideCopy: true,
      format: getDateFormat(true),
      renderCell: (value: any, row: any) => {
        if (row.inspection) {
          return (
            <span>
              {getFormattedDateValue(
                row.inspection.decreeDate,
                getDateFormat(true)
              )}
            </span>
          );
        }
      },
    },
    {
      field: "reclamationLetterNumber",
      headerName: t("reclamationletternumber"),
      width: 200,
      renderCell: (value: any, row: any) => {
        if (row.inspection) {
          return row.inspection.reclamationLetterNumber;
        }
      },
    },
    {
      field: "reclamationLetterDate",
      headerName: t("reclamationletterdate"),
      width: 200,
      hideCopy: true,
      format: getDateFormat(true),
      renderCell: (value: any, row: any) => {
        if (row.inspection) {
          return (
            <span>
              {getFormattedDateValue(
                row.inspection.reclamationLetterDate,
                getDateFormat(true)
              )}
            </span>
          );
        }
      },
    },
    {
      field: "status",
      headerName: t("status"),
      width: 180,
      hideCopy: true,
      renderCell: (value: any, row: any) => {
        if (row.status) {
          return <EmsFollowUpStatusCell value={row.status} />;
        }
      },
    },
    {
      field: "result",
      headerName: t("result"),
      width: 100,
      renderCell: (value: any, row: any) => {
        if (row.result) {
          return row.result;
        }
      },
    },
    {
      field: "deadLine",
      headerName: t("deadline"),
      width: 100,
      hideCopy: true,
      format: getDateFormat(true),
      renderCell: (value: any, row: any) => {
        if (row.deadLine) {
          return (
            <span>
              {getFormattedDateValue(row.deadLine, getDateFormat(true))}
            </span>
          );
        }
      },
    },
    {
      field: "note",
      headerName: t("note"),
      width: 100,
      renderCell: (value: any, row: any) => {
        if (row.note) {
          return row.note;
        }
      },
    },
  ];
  const [columns, setColumns] = useState<GridColumnType[]>(headerColumns);

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols = [];
      for (let item of state.columns) {
        let headerCell = columns.find((el) => item.field == el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    } else {
      setColumns(headerColumns);
    }
  }, [state]);

  const handleDelete = () => {
    deleteFollowUp(deleteModal, (modal) => {
      if (modal) {
        setDeleteModal({
          ...modal,
          isOpen: false,
          selectedRow: null,
        });
      }
    });
  };

  let actionButtons = (row: any, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.EMS_FOLLOWUP_AMEND) && (
          <ActionBtn
            onClick={() => {
              setSelectedFollowUpRow(row);
              setModalOpen(true);
            }}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}

        {hasPermission(PERMISSIONS.EMS_FOLLOWUP_DELETE) && (
          <ActionBtn
            onClick={() => setDeleteModal({ isOpen: true, selectedRow: row })}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onSave = (note: string, data: FollowUpType): void => {
    if (data) {
      data.note = note;
      if (data.id && data.id > 0) {
        onUpdateFollowUp(data, setModalOpen);
      } else {
        onCreateFollowUp(data, setModalOpen);
      }
    }
  };

  return (
    <StyledRoot data-testid={"follow-up-grid"}>
      <StyledHeader data-testid={"header"}>
        <StyledHeaderItem>
          <EventAvailableIcon />
          <StyledHeaderText>{t("followUp")}</StyledHeaderText>
        </StyledHeaderItem>
        <StyledHeaderItem justifyContent={"flex-end"} marginRight={"10px"}>
          {hasPermission(PERMISSIONS.EMS_FOLLOWUP_AMEND) && (
            <GhostBtn
              onClick={() => {
                setSelectedFollowUpRow(null);
                setModalOpen(true);
              }}
              startIcon={<AddRoundedIcon />}
              data-testid={"add-button"}
            >
              <StyledHeaderText noWrap>{t("add")}</StyledHeaderText>
            </GhostBtn>
          )}
          <GhostBtn
            onClick={() => onRefresh()}
            startIcon={<CachedRoundedIcon />}
            data-testid={"refresh-button"}
          >
            <StyledHeaderText noWrap>{t("refresh")}</StyledHeaderText>
          </GhostBtn>
          <span style={{ paddingRight: "8px" }}>
            <TableCustomizationButton
              hideLabel={true}
              showTooltip={true}
              columns={columns}
              setColumns={setColumns}
              isDefault={false}
              hasColumnFreeze={true}
              tableKey={EMS_FOLLOW_UP_TABLE_KEY}
            />
          </span>
        </StyledHeaderItem>
      </StyledHeader>
      <StyledBody height={"100%"}>
        <GridTable
          columns={columns}
          rows={rows}
          singleRowSelect={true}
          rowOnClick={(row: any, deselect: any) => {
            if (deselect) {
              setSelectedFollowUpRow(null);
            } else {
              setSelectedFollowUpRow(row);
            }
          }}
          selectedRows={selectedFollowUpRow ? [selectedFollowUpRow] : []}
          loading={loading}
          actionButtons={actionButtons}
          size={"small"}
          orderRowByHeader={orderRowByHeader}
        />
      </StyledBody>

      <StyledPagingBox>
        <Paging
          onRowsPerPageChange={(number: number) => onPagingLimitChange(number)}
          onPageChange={(number: number) => setPagingPage(number)}
          totalNumOfRows={rowsLen}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
          isMini={false}
          size={"small"}
        />
      </StyledPagingBox>
      {deleteModal.isOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("followup")}
          isDeleteModalOpen={deleteModal.isOpen}
          onCloseModal={() =>
            setDeleteModal({
              isOpen: false,
              selectedRow: null,
            })
          }
          onDelete={handleDelete}
          setIsDeleteModalOpen={() => {}}
        />
      )}
      {isModalOpen && (
        <EmsFollowUpCreateModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setModalOpen}
          defaultData={selectedFollowUpRow}
          onSave={onSave}
        />
      )}
    </StyledRoot>
  );
};
const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "emsFollowUpTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EmsFollowUpGrid);
