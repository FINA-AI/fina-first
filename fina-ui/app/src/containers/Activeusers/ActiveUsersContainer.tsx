import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { loadActiveUsersService } from "../../api/services/activeUserService";
import ActiveUsersPage from "../../components/Activeusers/ActiveUsersPage";
import { Avatar, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import { getFormattedDateTimeValue } from "../../util/appUtil";
import {
  ConfigType,
  GridColumnType,
  LanguageType,
} from "../../types/common.type";
import { ActiveUserType } from "../../types/activeUser.type";
import { styled } from "@mui/system";

interface ActiveUsersContainerProps {
  config: ConfigType;
  state: any;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.mainLayout,
}));

const StyledContent = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  border: theme.palette.borderColor,
  boxSizing: "border-box",
}));

const ActiveUsersContainer: React.FC<ActiveUsersContainerProps> = ({
  config,
  state,
}) => {
  const [users, setUsers] = useState<ActiveUserType[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslation();

  const columnHeader = [
    {
      field: "profile",
      headerName: t("profile"),
      hideCopy: true,
      renderCell: (value: string, row: ActiveUserType) => {
        value = row["name"];
        let abbreviation = "";
        if (value) {
          abbreviation = value.toUpperCase().slice(0, 1);
        }

        return (
          abbreviation && (
            <Box
              display={"flex"}
              justifyContent={"space-around"}
              alignItems={"center"}
              style={{
                margin: "5px 0",
              }}
            >
              <Avatar
                style={{ backgroundColor: blue[500], width: 31, height: 31 }}
                variant="rounded"
              >
                {abbreviation}
              </Avatar>
            </Box>
          )
        );
      },
    },
    {
      field: "login",
      headerName: t("login"),
    },
    {
      field: "name",
      headerName: t("user"),
    },
    {
      field: "language",
      headerName: t("language"),
      hideCopy: true,
      renderCell: (value: LanguageType) => {
        return <span>{value.name ? value.name : value.code}</span>;
      },
    },
    {
      field: "host",
      headerName: t("host"),
    },
    {
      field: "browserDetails",
      headerName: t("Browser"),
    },
    {
      field: "deviceCategory",
      headerName: t("Device"),
      hideCopy: true,
    },
    {
      field: "osDetails",
      headerName: t("System"),
    },
    {
      field: "clientAppName",
      headerName: t("clientAppName"),
      hideCopy: true,
    },
    {
      field: "sessionCreateDate",
      headerName: t("createdAt"),
      hideCopy: true,
      renderCell: (value: string) => {
        return getFormattedDateTimeValue(value, config.dateFormat);
      },
    },
  ];
  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

  const loadUsers = () => {
    loadActiveUsersService()
      .then((res) => {
        const data = res.data;
        if (data) {
          const modifiedData = data.map(
            (item: ActiveUserType, index: number) => ({
              ...item,
              id: index + 1,
            })
          );

          setUsers(modifiedData);
        }
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setColumns(columnHeader);
  }, [t]);

  useEffect(() => {
    if (state && state.columns.length !== 0) {
      let newCols: GridColumnType[] = [];
      for (let item of state.columns) {
        let headerCell = columns.find(
          (el: GridColumnType) => item.field == el.field
        );
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    }
  }, [state]);

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setUsers((prevState) =>
      [...prevState].sort((a, b) => {
        let valueA =
          cellName === "profile"
            ? a["name"]?.toUpperCase().slice(0, 1) ?? ""
            : a[cellName as keyof ActiveUserType];
        let valueB =
          cellName === "profile"
            ? b["name"]?.toUpperCase().slice(0, 1) ?? ""
            : b[cellName as keyof ActiveUserType];

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <StyledRoot>
      <StyledContent>
        <ActiveUsersPage
          data={users}
          setData={setUsers}
          columns={columns}
          setColumns={setColumns}
          orderRowByHeader={orderRowByHeader}
        />
      </StyledContent>
    </StyledRoot>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
  state: state.getIn(["state", "activeUsersTableCustomization"]),
});

export default connect(mapStateToProps, {})(ActiveUsersContainer);
