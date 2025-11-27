import { Box, Typography } from "@mui/material";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import React from "react";
import { useTranslation } from "react-i18next";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";

const ReturnVersionsToolbar = ({
  setAddNewReturnVersionsModal,
}: {
  setAddNewReturnVersionsModal: (value: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <>
      {hasPermission(PERMISSIONS.RETURN_VERSION_AMEND) && (
        <PrimaryBtn
          onClick={() => {
            setAddNewReturnVersionsModal(true);
          }}
        >
          <Box display={"flex"} alignItems={"center"} alignContent={"center"}>
            <Typography ml={"5px"} fontSize={12}>
              {t("addNew")}
            </Typography>
            <AddRoundedIcon />
          </Box>
        </PrimaryBtn>
      )}
    </>
  );
};

export default ReturnVersionsToolbar;
