import MailLogPage from "../../components/MailLog/MailLogPage";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import React, { useEffect, useState } from "react";
import {
  getMailAttachments,
  getMailLogs,
  getMailReply,
} from "../../api/services/mailLogService";
import {
  BASE_REST_URL,
  FilterTypes,
  getFormattedDateValue,
} from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { Box } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { connect } from "react-redux";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import {
  attachmentType,
  MailDataType,
  MailLogDataType,
  MailLogStatus,
} from "../../types/mailLog.type";
import { styled } from "@mui/system";

interface MailLogContainerProps {
  state: any;
}

const StyledStatusBox = styled(Box)(() => ({
  borderRadius: 2,
  width: 100,
  padding: "4px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "16px",
}));

const MailLogContainer: React.FC<MailLogContainerProps> = ({ state }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [data, setData] = useState<MailLogDataType[]>([]);
  const [dataLength, setDataLength] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [pagingPage, setPagingPage] = useState<number>(1);
  const [pagingLimit, setPagingLimit] = useState<number>(25);
  const [filterObject, setFilterObject] = useState<FilterType>({
    mailType: "MAIL_ROBOT",
  });
  const { getDateFormat } = useConfig();

  useEffect(() => {
    generateColumnFilterConfig();
  }, [filterObject.mailType]);

  const generateColumnFilterConfig = () => {
    let columnFilterConfig: columnFilterConfigType[] = [
      {
        field: "mailType",

        type: FilterTypes.list,
        name: "mailType",
        value: "MAIL_ROBOT",
        filterArray: [
          { label: t("mailRobot"), value: "MAIL_ROBOT" },
          { label: t("system"), value: "SYSTEM" },
        ],
      },
      {
        field: "address",
        type: FilterTypes.string,
        name: "address",
      },
      {
        field: "fromAddress",
        type: FilterTypes.string,
        name: "fromAddress",
      },
      {
        field: "note",
        type: FilterTypes.string,
        name: "toAddress",
      },
      {
        field: "receiveDate",
        type: FilterTypes.date,
        name: "receivedFromDate",
      },
      {
        field: "replyStatus",
        type: FilterTypes.list,
        name: "replyStatus",
        filterArray: [
          { label: t("sent"), value: MailLogStatus.SENT },
          { label: t("notSent"), value: MailLogStatus.NOT_SENT },
          { label: t("ignore"), value: MailLogStatus.IGNORE },
          { label: t("disable"), value: MailLogStatus.DISABLE },
          { label: t("later"), value: MailLogStatus.LATER },
        ],
      },
    ];
    if (filterObject.mailType === "MAIL_ROBOT") {
      columnFilterConfig.push(
        {
          field: "readDate",
          type: FilterTypes.date,
          name: "readFromDate",
        },
        {
          field: "status",
          type: FilterTypes.list,
          name: "statues",
          filterArray: [
            { label: t("active"), value: "ACTIVE" },
            { label: t("archive"), value: "ARCHIVE" },
            { label: t("error"), value: "ERROR" },
            { label: t("ignoreReplay"), value: "IGNORE_REPLAY" },
          ],
        }
      );
    }
    return columnFilterConfig;
  };

  useEffect(() => {
    init(filterObject);
  }, [pagingLimit, pagingPage]);

  let columnHeader: GridColumnType[] = [
    {
      field: "mailType",
      headerName: t("type"),
      minWidth: 135,
      renderCell: (value: string) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            <MailOutlineIcon
              style={{
                color: "#FF8D00",
                width: "16px",
                height: "16px",
                padding: "2px",
                marginRight: "8px",
              }}
            />
            {value}
          </Box>
        );
      },
    },
    {
      field: "fromAddress",
      headerName: t("fromAddress"),
      minWidth: 200,
    },
    {
      field: "toAddress",
      headerName: t("toAddress"),
      minWidth: 200,
    },
    {
      field: "note",
      headerName: t("note"),
      minWidth: 200,
    },
    {
      field: "receiveDate",
      headerName: t("receiveDate"),
      minWidth: 100,
      hideCopy: true,
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "readDate",
      headerName: t("readDate"),
      minWidth: 100,
      hideCopy: true,
      renderCell: (value: number) =>
        getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "status",
      headerName: t("status"),
      minWidth: 100,
      renderCell: (value: string) => {
        return (
          value && (
            <StyledStatusBox style={getStatusInfo(value)}>
              {t(`mailLog_${value}`)}
            </StyledStatusBox>
          )
        );
      },
    },
    {
      field: "replyStatus",
      headerName: t("replayStatus"),
      minWidth: 100,
      renderCell: (value: string | null) => {
        return (
          <StyledStatusBox style={getReplay(value || MailLogStatus.NOT_SENT)}>
            {t(`mailLog_${value || MailLogStatus.NOT_SENT}`)}
          </StyledStatusBox>
        );
      },
    },
  ];

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols = [];
      for (let item of state.columns) {
        let headerCell = columnHeader.find((el) => item.field === el.field);
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
  }, [t, state]);

  const init = (filter: FilterType) => {
    getMailLogs(pagingPage, pagingLimit, filter ? filter : filterObject)
      .then((resp) => {
        setData(resp.data.list);
        setDataLength(resp.data.totalResults);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStatusInfo = (status: string) => {
    let result = { background: "", color: "" };
    switch (status) {
      case MailLogStatus.ACTIVE:
        result.background = "#E9F5E9";
        result.color = "#289E20";
        break;
      case MailLogStatus.ARCHIVE:
        result.background = "#FFF4E5";
        result.color = "#FF8D00";
        break;
      case MailLogStatus.ERROR:
        result.background = "#FFECE9";
        result.color = "#FF4128";
        break;
      case MailLogStatus.IGNORE_REPLAY:
        result.background = "#FFF4E5";
        result.color = "#FF8D00";
        break;
      default:
        result.background = "#E9F5E9";
        result.color = "#289E20";
        break;
    }

    return result;
  };

  const getReplay = (status: string) => {
    let result = { background: "", color: "" };
    switch (status) {
      case MailLogStatus.SENT:
        result.background = "#F0F4FF";
        result.color = "#2962FF";
        break;
      case MailLogStatus.NOT_SENT:
        result.background = "#DFDFDF";
        result.color = "#596D89";
        break;
      case MailLogStatus.IGNORE:
        result.background = "#FFF4E5";
        result.color = "#FF8D00";
        break;
      case MailLogStatus.DISABLE:
        result.background = "#FFECE9";
        result.color = "#FF4128";
        break;
      case MailLogStatus.LATER:
        result.background = "#DFDFD";
        result.color = "#596D89";
        break;
      default:
        result.background = "#F0F4FF";
        result.color = "#2962FF";
        break;
    }

    return result;
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const FilterOnChangeFunction = (obj: FilterType[]) => {
    let filter: FilterType = {};
    for (let item of obj) {
      switch (item.type) {
        case FilterTypes.list:
          if (item.value) {
            filter[item.name] = item.value;
          }
          break;

        case FilterTypes.date:
          if (item.start) {
            filter[item.name] = item.start;
          }
          if (item.end) {
            filter["receivedToDate"] = item.end;
          }

          break;

        default: {
          filter[item.name] = item.value;
        }
      }
    }

    setFilterObject(filter);
    setPagingPage(1);
    init(filter);
  };

  const getReply = async (messageId: number, isRobotMail: boolean) => {
    let result: { data: MailDataType | {}; attachments: attachmentType[] } = {
      data: {},
      attachments: [],
    };
    await getMailReply(messageId)
      .then((resp) => {
        result.data = resp.data;
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });

    if (isRobotMail) {
      await getAttachments(messageId).then((attachments) => {
        result.attachments = attachments;
      });
    }

    return result;
  };

  const getAttachments = async (messageId: number) => {
    let result: attachmentType[] = [];
    await getMailAttachments(messageId)
      .then((resp) => {
        result = resp.data;
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
    return result;
  };

  const downloadFile = (fileId: number) => {
    window.open(
      BASE_REST_URL + `/mail/attachment/download/${fileId}`,
      "_blank"
    );
  };

  return (
    <MailLogPage
      pagingPage={pagingPage}
      dataLength={dataLength}
      data={data}
      columns={columns}
      setColumns={setColumns}
      columnFilterConfig={generateColumnFilterConfig()}
      setActivePage={setPagingPage}
      setRowPerPage={onPagingLimitChange}
      loading={loading}
      setData={setData}
      initialRowsPerPage={pagingLimit}
      FilterOnChangeFunction={FilterOnChangeFunction}
      getReply={getReply}
      downloadFile={downloadFile}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "mailLogTableCustomization"]),
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MailLogContainer);
