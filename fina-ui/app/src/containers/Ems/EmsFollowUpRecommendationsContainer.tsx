import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteFollowUpRecommendation,
  loadFollowUpRecommendations,
  postFollowUpRecommendation,
  updateFollowUpRecommendation,
} from "../../api/services/ems/emsFollowUpService";
import EmsFollowUpRecommendationsPage from "../../components/EMS/EmsFollowUp/EmsFollowUpRecommendationsPage";
import useConfig from "../../hoc/config/useConfig";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { GridColumnType } from "../../types/common.type";
import {
  FollowUpFilterType,
  FollowUpRecommendationType,
} from "../../types/followUp.type";
import { getFormattedDateValue } from "../../util/appUtil";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import CustomEmsStatusCell from "../../components/EMS/EmsFollowUp/CustomEmsStatusCell";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface EmsFollowUpRecommendationsContainerProps {
  selectedRowId: number | null;
  filters: FollowUpFilterType;
  isRecommendationOpen: boolean;
  setIsRecommendationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  state: any;
}

const EmsFollowUpRecommendationsContainer: React.FC<
  EmsFollowUpRecommendationsContainerProps
> = ({
  selectedRowId,
  filters,
  isRecommendationOpen,
  setIsRecommendationOpen,
  state,
}: EmsFollowUpRecommendationsContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { getDateFormat } = useConfig();
  const { t } = useTranslation();
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [rowsLen, setRowsLen] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<FollowUpRecommendationType[]>([]);
  const [currRecommendation, setCurrRecommendation] =
    useState<FollowUpRecommendationType | null>(null);

  const columnHeader: GridColumnType[] = [
    {
      field: "recommendation",
      headerName: t("recommendation"),
      width: 150,
    },
    {
      field: "status",
      headerName: t("status"),
      width: 150,
      hideCopy: true,
      renderCell: (value) => {
        return <CustomEmsStatusCell val={value} />;
      },
    },
    {
      field: "result",
      headerName: t("result"),
      width: 150,
    },
    {
      field: "deadLine",
      headerName: t("deadline"),
      width: 150,
      renderCell: (value: number) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
    },
    {
      field: "note",
      headerName: t("note"),
      width: 150,
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

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
      setColumns(columnHeader);
    }
  }, [state]);

  useEffect(() => {
    if (!selectedRowId) {
      setRows([]);
      return;
    }
    init();
  }, [selectedRowId]);

  const init = () => {
    if (selectedRowId) {
      setLoading(true);
      loadFollowUpRecommendations(
        pagingPage,
        pagingLimit,
        selectedRowId,
        filters
      )
        .then((res) => {
          setRows(res.data.list as FollowUpRecommendationType[]);
          setRowsLen(res.data.totalResults);
        })
        .catch((err) => openErrorWindow(err, t("error"), true))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const saveRecommendation = (
    data: FollowUpRecommendationType,
    setOpenModal: SetState<boolean>,
    setErrorFields: SetState<{ [k: string]: boolean }>
  ) => {
    if (selectedRowId) {
      if (isMandatoryFieldsEmpty(data, setErrorFields)) {
        return enqueueSnackbar(t("mandatoryFieldsAreEmpty"), {
          variant: "error",
        });
      }
      setOpenModal(false);
      if (currRecommendation) {
        updateFollowUpRecommendation(
          selectedRowId,
          currRecommendation.id,
          data
        ).then((resp) => {
          const updateData = rows.map((item) =>
            item.id === resp.data.id ? resp.data : item
          );

          setRows(updateData);

          enqueueSnackbar(t("edit"), {
            variant: "success",
          });
        });
      } else {
        let newData = { ...data, id: -1 };
        postFollowUpRecommendation(selectedRowId, newData)
          .then((resp) => {
            setRows([...rows, resp.data]);
            enqueueSnackbar(t("addNewItem"), {
              variant: "success",
            });
          })
          .catch((err) => {
            openErrorWindow(err, t("error"), true);
          });
      }
    }
  };

  const deleteRecommendation = () => {
    if (selectedRowId && currRecommendation)
      deleteFollowUpRecommendation(selectedRowId, currRecommendation.id)
        .then(() => {
          const newData = rows.filter(
            (item) => item.id !== currRecommendation?.id
          );
          setRows(newData);
          enqueueSnackbar(t("deleted"), {
            variant: "success",
          });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
  };

  const isMandatoryFieldsEmpty = (
    data: FollowUpRecommendationType,
    setErrorFields: SetState<{ [k: string]: boolean }>
  ) => {
    let isEmpty = false;
    const mandatoryFields: (keyof FollowUpRecommendationType)[] = [
      "status",
      "recommendation",
      "deadLine",
      "result",
    ];
    let errorFields: { [k: string]: boolean } = {};
    mandatoryFields.forEach((field) => {
      if (!data[field]) {
        isEmpty = true;
        errorFields[field] = true;
      }
    });
    setErrorFields((prevState) => ({ ...prevState, ...errorFields }));
    return isEmpty;
  };

  return (
    <div style={{ height: "100%", display: "flex" }}>
      {!isRecommendationOpen ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          marginTop={"10px"}
          width={"100%"}
          justifyContent={"space-between"}
          p={"15px 0px"}
        >
          <p style={{ transform: "rotate(90deg)", marginTop: 85 }}>
            Recommendations
          </p>
          <IconButton onClick={() => setIsRecommendationOpen(true)}>
            <ChevronLeftRoundedIcon />
          </IconButton>
        </Box>
      ) : (
        <EmsFollowUpRecommendationsPage
          columns={columns}
          pagingPage={pagingPage}
          setPagingPage={setPagingPage}
          pagingLimit={pagingLimit}
          setPagingLimit={setPagingLimit}
          rowsLen={rowsLen}
          loading={loading}
          rows={rows}
          setRows={setRows}
          init={init}
          setCurrRecommendation={setCurrRecommendation}
          currRecommendation={currRecommendation}
          saveRecommendation={saveRecommendation}
          deleteRecommendation={deleteRecommendation}
          selectedRowId={selectedRowId}
          setColumns={setColumns}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "emsFollowUpRecommendationsTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsFollowUpRecommendationsContainer);
