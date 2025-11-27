import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import VirtualTreeGrid from "../../../../common/TreeGrid/VirtualTreeGrid";
import MainGridSkeleton from "../../../Skeleton/GridSkeleton/MainGridSkeleton";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { UserType } from "../../../../../types/user.type";
import { TreeGridColumnType } from "../../../../../types/common.type";

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  width: "100%",
  flexDirection: "column",
});

const StyledBody = styled(Box)(({ theme }: any) => ({
  borderLeft: theme.palette.borderColor,
  height: "100%",
}));

const StyledEdit = styled("span")(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: "4px",
  width: "fit-content",
  padding: "8px 16px",
  color: "#FFFFFF",
  textTransform: "capitalize",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  display: "flex",
  cursor: "pointer",
  justifyContent: "space-between",
  "& .MuiSvgIcon-root": {
    width: "15px",
    height: "15px",
    marginLeft: "5px",
  },
}));

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "150%",
  textTransform: "capitalize",
  height: "60px",
  padding: "0px 16px",
  borderBottom: theme.palette.borderColor,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderLeft: theme.palette.borderColor,
}));

interface ResponsibleUserProps {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  columns: (isPermitted: boolean) => TreeGridColumnType[];
  data: UserType[];
  onCancelClick: () => void;
  onSaveClick: () => void;
  onResponsibleCheckboxChange: (data: string[]) => void;
  responsibleUsers: UserType[];
  loading: boolean;
}

const ResponsibleUser: React.FC<ResponsibleUserProps> = ({
  editMode,
  setEditMode,
  columns,
  data,
  onCancelClick,
  onSaveClick,
  onResponsibleCheckboxChange,
  responsibleUsers,
  loading,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [defaultCheckedRows, setDefaultCheckedRows] = useState<string[]>([]);

  useEffect(() => {
    let defaultCheckedRows = [...getCheckedRows([...responsibleUsers])];
    setDefaultCheckedRows(defaultCheckedRows);
  }, [loading]);

  useEffect(() => {
    if (editMode) {
      let defaultCheckedRows = [...getCheckedRows([...responsibleUsers])];
      setDefaultCheckedRows(defaultCheckedRows);
    }
  }, [editMode, responsibleUsers]);

  const getCheckedRows = (rows: UserType[]): string[] => {
    return rows.map((item) => checkboxIdProperty(item));
  };

  const checkboxIdProperty = (row: UserType): string => {
    return `user_${row.id}`;
  };

  const getMemoizedData = useMemo(() => {
    return data.filter((user: any) => !user.hidden);
  }, [data]);

  return (
    <StyledRoot>
      <StyledToolbar>
        <span>{t("responsibleUsers")}</span>
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <Box display={"flex"}>
            {!editMode ? (
              <StyledEdit
                onClick={() => setEditMode(!editMode)}
                data-testid={"edit-button"}
              >
                {t("edit")} <EditIcon />
              </StyledEdit>
            ) : (
              <Box display={"flex"} alignItems={"center"}>
                <GhostBtn
                  onClick={() => {
                    setEditMode(false);
                    onCancelClick();
                  }}
                  data-testid={"cancel-button"}
                >
                  {t("cancel")}
                </GhostBtn>
                <span style={{ marginRight: "5px" }} />
                <PrimaryBtn
                  backgroundColor={"#289E20"}
                  onClick={() => {
                    setEditMode(false);
                    onSaveClick();
                  }}
                  endIcon={<CheckIcon fontSize={"inherit"} />}
                  data-testid={"save-button"}
                >
                  {t("save")} &nbsp;
                </PrimaryBtn>
              </Box>
            )}
          </Box>
        )}
      </StyledToolbar>
      <StyledBody>
        {loading ? (
          <MainGridSkeleton
            columns={columns(false)}
            checkboxEnabled={true}
            minWidth={270}
            paddingLeft={"12px"}
          />
        ) : (
          <VirtualTreeGrid
            withCheckbox={true}
            editMode={!editMode}
            checkboxIdProperty={checkboxIdProperty}
            columns={columns(false)}
            data={getMemoizedData}
            defaultCheckedRows={defaultCheckedRows}
            checkboxOnChange={onResponsibleCheckboxChange}
            loadChildrenFunction={() => {}}
          />
        )}
      </StyledBody>
    </StyledRoot>
  );
};

export default ResponsibleUser;
