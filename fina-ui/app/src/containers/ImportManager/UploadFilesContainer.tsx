import UploadFilesPage from "../../components/ImportManager/UploadFiles/UploadFilesPage";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UploadFilesModal from "../../components/ImportManager/UploadFiles/Modal/UploadFilesModal";
import StatusCell from "../../components/ImportManager/UploadFiles/StatusCell";
import { GridColumnType } from "../../types/common.type";
import {
  deleteUploadFile,
  getUploadFileConfig,
  getUploadFiles,
  getUploadFileStatuses,
} from "../../api/services/uploadFileService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  UploadFileFilterType,
  UploadFileType,
} from "../../types/uploadFile.type";
import {
  BASE_REST_URL,
  getFormattedDateValue,
  getLanguage,
} from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { Typography } from "@mui/material";
import { connect } from "react-redux";
import webSocket from "../../api/websocket/webSocket";

interface UploadFilesContainerProps {
  state: any;
}

const UploadFilesContainer: FC<UploadFilesContainerProps> = ({ state }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { getDateFormat } = useConfig();

  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [data, setData] = useState<UploadFileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [columns, setColumns] = useState<GridColumnType[]>([]);

  const [showErrorPage, setShowErrorPage] = useState(false);
  const [filterStatuses, setFilterStatuses] = useState<
    {
      status: string;
      name: string;
    }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<
    UploadFileType | undefined
  >();
  const [uploadFilePattern, setUploadFilePattern] = useState<string>("");
  const [filterData, setFilterData] = useState<UploadFileFilterType>({});
  const langCode: string = getLanguage();

  useEffect(() => {
    initData(filterData);
  }, [pagingPage, pagingLimit]);

  useEffect(() => {
    let newColumns = columnHeader.map((h: GridColumnType) => {
      const isVisible =
        !showErrorPage ||
        h.field === "userLogin" ||
        h.field === "fileName" ||
        h.field === "status";
      return {
        ...h,
        hidden: !isVisible,
      };
    });

    if (state && state.columns.length !== 0) {
      let newCols = state.columns.map((item: GridColumnType) => {
        const headerCell = newColumns.find((el) => item.field === el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden || headerCell.hidden;
          headerCell.fixed = item.fixed;
        }
        return headerCell;
      });

      setColumns(newCols);
    } else {
      setColumns(newColumns);
    }
  }, [state, showErrorPage]);

  useEffect(() => {
    getFilterStatuses();
    initUploadFilePattern();
    initWebsocket();
  }, []);

  const initWebsocket = () => {
    webSocket("ws/uploadFile", (message: any) => {
      const fileMessage = JSON.parse(message);
      const fiName = fileMessage?.fiNameMap[langCode] ?? "";
      updateFileStatus(
        fileMessage.id,
        fileMessage.status,
        fileMessage.fiCode,
        fiName
      );
    });
  };

  const updateFileStatus = (
    fileId: number,
    status: number,
    fiCode: string,
    fiName: string
  ) => {
    setData((prevData) =>
      prevData.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            status: String(status),
            bankCode: fiCode,
            bankName: fiName,
          };
        }
        return file;
      })
    );
  };

  const initUploadFilePattern = async () => {
    try {
      const res = await getUploadFileConfig();
      setUploadFilePattern(res.data.fileNamePatterns);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const getFilterStatuses = async () => {
    const res = await getUploadFileStatuses();
    setFilterStatuses(res.data);
  };

  const initData = async (filters?: UploadFileFilterType) => {
    try {
      setLoading(true);

      let f = filters ?? {};

      const res = await getUploadFiles({
        page: pagingPage,
        limit: pagingLimit,
        ...f,
      });
      const { data } = res;
      setData(data.list);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  const statusClickHandler = (event: any, selectedItem: UploadFileType) => {
    event.stopPropagation();
    if (
      ["16", "0", "12", "9", "11", "13", "17", "22", "24"].includes(
        selectedItem.status
      )
    ) {
      return;
    } else {
      if (!showErrorPage) {
        setShowErrorPage(true);
      }
      if (selectedFile && selectedItem["id"] === selectedFile["id"]) {
        onErrorPageClose();
        return;
      }
      setSelectedFile(selectedItem);
    }
  };

  const onRefresh = () => {
    initData();
  };

  const columnHeader: GridColumnType[] = [
    {
      field: "bankName",
      headerName: t("fiName"),
      hideCopy: true,
      minWidth: 200,
    },
    {
      field: "bankCode",
      headerName: t("fiCode"),
      hideCopy: true,
      minWidth: 80,
    },
    {
      field: "userLogin",
      headerName: t("user"),
      hideCopy: true,
      minWidth: 120,
    },
    {
      field: "type",
      headerName: t("type"),
      hideCopy: true,
      minWidth: 20,
    },
    {
      field: "fileName",
      headerName: t("file"),
      hideCopy: true,
      renderCell: (value: string, row: UploadFileType) => {
        const downloadUploadFile = () => {
          window.open(
            BASE_REST_URL +
              `/uploadFile/file?fileId=${row.id}&langCode=${getLanguage()}`
          );
        };
        return (
          <Typography
            style={{
              color: "#3f51b5",
              fontSize: 13,
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={downloadUploadFile}
          >
            {value}
          </Typography>
        );
      },
    },
    {
      field: "uploadedTime",
      headerName: t("uploadTime"),
      hideCopy: true,
      minWidth: 80,
      renderCell: (value: string) => {
        return getFormattedDateValue(value, getDateFormat(false));
      },
    },
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
      minWidth: 180,
      renderCell: (value: string, row: UploadFileType) => {
        return (
          <StatusCell
            row={row}
            onClick={(event, selectedItem: UploadFileType) => {
              statusClickHandler(event, selectedItem);
            }}
          />
        );
      },
    },
  ];

  const onUploadFileDelete = async (ids: number[]) => {
    await deleteUploadFile(ids);
    let newData = data.map((item) => {
      if (ids.includes(item.id)) {
        return { ...item, status: "23" };
      }
      return item;
    });
    setData(newData);
  };

  const onErrorPageClose = () => {
    setShowErrorPage(false);
    setSelectedFile(undefined);
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  return (
    <>
      <UploadFilesPage
        pagingPage={pagingPage}
        onPagingLimitChange={onPagingLimitChange}
        setPagingPage={setPagingPage}
        data={data}
        setData={setData}
        columns={columns}
        setColumns={setColumns}
        showErrorPage={showErrorPage}
        loading={loading}
        setIsUploadFileModalOpen={setIsUploadFileModalOpen}
        initData={initData}
        filterStatuses={filterStatuses}
        onErrorPageClose={onErrorPageClose}
        onUploadFileDelete={onUploadFileDelete}
        selectedFile={selectedFile}
        setFilterData={setFilterData}
        onRefresh={onRefresh}
      />
      {isUploadFileModalOpen && (
        <UploadFilesModal
          isUploadFileModalOpen={isUploadFileModalOpen}
          setIsUploadFileModalOpen={setIsUploadFileModalOpen}
          uploadFilePattern={uploadFilePattern}
          data={data}
          setData={setData}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "uploadFilesTableCustomization"]),
});
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFilesContainer);
