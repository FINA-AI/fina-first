import React, { useState } from "react";
import { Box, styled } from "@mui/system";
import SearchField from "../../../common/Field/SearchField";
import GridTable from "../../../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../../common/Button/GhostBtn";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ClosableModal from "../../../common/Modal/ClosableModal";
import CreateGroupForm from "./CreateGroupForm";
import EcmCheckBox from "./EcmCheckBox";
import { UserType, UserTypeWithUIProps } from "../../../../types/user.type";
import { ECMData } from "../../../../types/ecm.type";

interface UsersEcmProps {
  setUserData: (object: Partial<UserType>) => void;
  editMode: boolean;
  ecmData: ECMData[];
  setEcmData: React.Dispatch<React.SetStateAction<ECMData[]>>;
  currUser: Partial<UserTypeWithUIProps>;
  loading: boolean;
  handleCheckChange(row: ECMData): void;
}

const StyledToolbarBox = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
}));

const StyledBodyBox = styled(Box)(() => ({
  height: "100%",
  overflow: "hidden",
  borderRadius: "8px",
  backgroundColor: "#FFF",
}));

const UsersEcm: React.FC<UsersEcmProps> = ({
  editMode,
  ecmData,
  setEcmData,
  handleCheckChange,
  currUser,
  loading,
}) => {
  const { t } = useTranslation();

  const [filteredRows, setFilteredRows] = useState<ECMData[] | null>(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const onCancel = () => {
    handleClose();
  };

  const columnHeader = [
    {
      field: "id",
      headerName: t("code"),
    },
    {
      field: "displayName",
      headerName: t("description"),
    },
    {
      hideCopy: true,
      field: "checked",
      hideSort: true,
      renderCell: (value: boolean, row: ECMData) => {
        return (
          <EcmCheckBox
            handleCheckChange={handleCheckChange}
            row={row}
            editMode={editMode}
            currUser={currUser}
          />
        );
      },
    },
  ];

  const onFilter = (value: string) => {
    value = value.toLowerCase();
    if (value && value.trim().length > 0) {
      const filtered = ecmData.filter(
        (r) =>
          r.id?.toLowerCase().includes(value) || r.displayName?.includes(value)
      );
      setFilteredRows(filtered);
    } else {
      onFilterClear();
    }
  };

  const onFilterClear = () => {
    setFilteredRows(null);
  };

  return (
    <Box
      height={"100%"}
      boxSizing={"border-box"}
      display={"flex"}
      flexDirection={"column"}
    >
      <StyledToolbarBox display={"flex"} justifyContent={"space-between"}>
        <SearchField
          withFilterButton={false}
          onClear={onFilterClear}
          width={400}
          onFilterChange={onFilter}
        />
        <GhostBtn
          fontSize={14}
          onClick={() => setOpen(true)}
          height={32}
          startIcon={<SupervisedUserCircleIcon />}
          children={
            <span style={{ fontSize: 14, paddingLeft: "4px" }}>
              {t("addGroup")}
            </span>
          }
        />
        <ClosableModal
          onClose={() => setOpen(false)}
          open={open}
          width={600}
          includeHeader={true}
          disableBackdropClick={true}
          title={t("addGroup")}
        >
          <CreateGroupForm
            ecmData={ecmData}
            setEcmData={setEcmData}
            onCancel={onCancel}
          />
        </ClosableModal>
      </StyledToolbarBox>
      <StyledBodyBox flex={1}>
        <GridTable
          columns={columnHeader}
          rows={filteredRows || ecmData}
          selectedRows={[]}
          setRows={setEcmData}
          loading={loading}
        />
      </StyledBodyBox>
    </Box>
  );
};

export default UsersEcm;
