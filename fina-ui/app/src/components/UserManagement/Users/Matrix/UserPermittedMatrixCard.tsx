import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Checkbox, Grid, Typography } from "@mui/material";
import Tooltip from "../../../common/Tooltip/Tooltip";
import PermitButton from "../Common/PermitButton";
import { MainMatrixDataType } from "../../../../types/matrix.type";
import { styled } from "@mui/system";

const StyledContainerBox = styled(Box)(({ theme }: { theme: any }) => ({
  boxSizing: "border-box",
  borderRadius: "4px",
  overflow: "hidden",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
  padding: "12px 16px",
  margin: 4,
  background: theme.palette.paperBackground,
  border: `1px solid ${theme.palette.mode === "dark" ? "#4d5c72" : "#EAEBF0"}`,
  "&:hover": {
    background: theme.palette.mode === "dark" ? "#a1bdd914" : "#F5F5F5",
  },
}));

const StyledCheckboxContainer = styled(Box)(() => ({
  marginLeft: -2,
  padding: "0 0 12px 0",
  display: "flex",
  alignItems: "center",
}));

const StyledCheckbox = styled(Checkbox)(() => ({
  "&.MuiCheckbox-root": {
    margin: 0,
    padding: 0,
  },
  "&.Mui-checked": {},
}));

const StyledPermissionText = styled(Typography)(
  ({ _inherited }: { _inherited?: boolean }) => ({
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 5,
    color: _inherited ? "#80808087" : "inherit",
  })
);

const StyledTitle = styled(Typography)(() => ({
  fontWeight: 500,
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 13,
  marginBottom: 8,
}));

const StyledText = styled(Box)(({ theme }: { theme: any }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#596D89",
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
}));

interface UserPermittedMatrixCardProps {
  editMode: boolean;
  onCheck: () => void;
  permitted: boolean;
  data: MainMatrixDataType;
}

const UserPermittedMatrixCard: React.FC<UserPermittedMatrixCardProps> = ({
  editMode,
  onCheck,
  permitted,
  data,
}) => {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState<boolean>(false);

  const onMouseEnterFunction = (event: React.MouseEvent<HTMLDivElement>) => {
    setTooltip(
      event.currentTarget.scrollWidth > event.currentTarget.clientWidth
    );
  };

  return (
    <Grid item xs={3}>
      <StyledContainerBox>
        {editMode ? (
          <StyledCheckboxContainer>
            <StyledCheckbox
              disabled={data.inheritedFromRole}
              onClick={onCheck}
              checked={permitted}
              size="small"
            />
            <StyledPermissionText _inherited={data.inheritedFromRole}>
              {t("permission")}
            </StyledPermissionText>
          </StyledCheckboxContainer>
        ) : (
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <PermitButton permitted={permitted} />
            <Box
              sx={{
                marginBottom: "10px",
                display: "flex",
              }}
            ></Box>
          </Box>
        )}
        <StyledTitle
          onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) =>
            onMouseEnterFunction(event)
          }
        >
          {data.fiTypeModel.code}
        </StyledTitle>
        <Tooltip title={tooltip ? data.pattern : ""} arrow>
          <StyledText
            onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) =>
              onMouseEnterFunction(event)
            }
          >
            {data.pattern}
          </StyledText>
        </Tooltip>
      </StyledContainerBox>
    </Grid>
  );
};

export default UserPermittedMatrixCard;
