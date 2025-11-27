import React, { useEffect, useState } from "react";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import { Box, Grid } from "@mui/material";
import GridFilterCloseButton from "../../common/Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { loadAllUsersSimple } from "../../../api/services/userManagerService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

type UserType = {
  id: number;
  login: string;
  description: string;
};

interface ImportManagerUsersFilterProps {
  onClickFunction: (userInfo: { login: string; description: string }) => void;
  closeFilter: (userInfo: { login: string; description: string }) => void;
  selectedUser: { login: string; description: string };
}

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "16px",
  display: "flex",
  alignItems: "center",
}));

const ImportManagerUsersFilter: React.FC<ImportManagerUsersFilterProps> = ({
  onClickFunction,
  closeFilter,
  selectedUser,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [users, setUsers] = useState<UserType[]>([]);
  const [userInfo, setUserInfo] = useState({ login: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllUsersSimple()
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        enqueueSnackbar(t("error"), {
          variant: "error",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        padding: "23px 20px 16px 20px",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        xs={12}
        display={"flex"}
        alignItems={"center"}
        sx={{ width: "100%" }}
      >
        <Box
          style={{ display: "inline-block", marginRight: 10, width: "100%" }}
        >
          <CustomAutoComplete
            data={users}
            onChange={(value) => {
              setUserInfo({
                login: value.login,
                description: value.description,
              });
            }}
            valueFieldName={"id"}
            displayFieldFunction={(user) => {
              if (!user.login && !user.description) return "";
              return `${user.login} - ${user.description}`;
            }}
            selectedItem={selectedUser}
            virtualized={true}
            loading={loading}
          />
        </Box>
        <StyledFilter onClick={() => onClickFunction(userInfo)}>
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(userInfo)} />
      </Grid>
    </Grid>
  );
};

export default ImportManagerUsersFilter;
