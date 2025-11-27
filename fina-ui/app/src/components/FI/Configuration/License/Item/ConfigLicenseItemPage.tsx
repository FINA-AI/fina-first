import { Box } from "@mui/system";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleTreeGrid from "../../../../common/SimpleTreeGrid/SimpleTreeGrid";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import ConfigLicenseCreate from "../Create/ConfigLicenseCreate";
import CopyCellButton from "../../../../common/Grid/CopyCellButton";
import { Typography } from "@mui/material";
import LicenseConfigItemSkeleton from "../../../Skeleton/Configuration/License/LicenseConfigItemSkeleton";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { LicenseTypeWithUIProps } from "../../../../../containers/FI/Configuration/License/ConfigLicenseItemContainer";

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderBottom: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  height: 30,
}));

const StyledBody = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
}));

const StyledDescription = styled(Typography)(({ theme }: any) => ({
  wordBreak: "break-word",
  fontWeight: 400,
  color: theme.palette.secondaryTextColor,
  fontSize: 12,
  lineHeight: "20px",
}));

const StyledCodeTextBox = styled(Box)(({ theme }: any) => ({
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "18px",
  color: theme.palette.textColor,
}));

interface StyledCurrencyBoxProps {
  isEnable: boolean;
}

const StyledCurrencyBox = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== "isEnable",
})<StyledCurrencyBoxProps>(({ theme, isEnable }) => ({
  border: isEnable ? "1px solid #2962FF" : (theme as any).palette.borderColor,
  borderRadius: 2,
  fontWeight: 500,
  color: isEnable ? "#2962FF" : "#9AA7BE",
  marginRight: isEnable ? 4 : 10,
  fontSize: 11,
  lineHeight: "12px",
  height: "fit-content",
  padding: "2px 4px",
  backgroundColor: !isEnable
    ? theme.palette.mode === "dark"
      ? "#344258"
      : "#EAEBF0"
    : "",
}));

interface Props {
  licenseItem: LicenseTypeWithUIProps;
  loadChildren: (row: LicenseTypeWithUIProps) => void;
  deleteLicense: (row: LicenseTypeWithUIProps) => void;
  saveLicense: (
    isEdit: boolean,
    data: any,
    defaultData: LicenseTypeWithUIProps
  ) => void;
  loading: boolean;
}

const ConfigLicenseItemPage: React.FC<Props> = ({
  licenseItem = {},
  loadChildren,
  deleteLicense,
  saveLicense,
  loading,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [selectedRow, setSelectedRow] = useState<LicenseTypeWithUIProps>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [actionBtnRow, setActionBtnRow] = useState<LicenseTypeWithUIProps>(
    {} as LicenseTypeWithUIProps
  );
  const [currExpandedRow, setCurrExpandedRow] =
    useState<LicenseTypeWithUIProps>();
  const [openExpandedInfo, setOpenExpandedInfo] = useState(false);

  const addLicense = () => {
    if (selectedRow && selectedRow.level < 3) {
      setOpenAddModal(true);
    }
  };

  const isBankOperation = () => {
    return (
      (openAddModal && selectedRow && selectedRow.level === 1) ||
      (openEditModal && actionBtnRow.level === 2)
    );
  };

  return (
    <Box height={"100%"}>
      <StyledHeader>
        {hasPermission(PERMISSIONS.FINA_LICTYPE_AMEND) && (
          <PrimaryBtn
            style={{
              opacity: selectedRow && selectedRow.level !== 3 ? 1 : 0.7,
            }}
            onClick={() => addLicense()}
            fontSize={12}
            data-testid={"addNewBtn"}
            endIcon={<AddIcon />}
          >
            {t("addNew")}
          </PrimaryBtn>
        )}
      </StyledHeader>
      <StyledBody overflow={"auto"} height={"100%"}>
        {loading ? (
          <LicenseConfigItemSkeleton />
        ) : (
          <SimpleTreeGrid
            data={[{ ...licenseItem }]}
            defaultExpandedRows={[0]}
            loadChildren={loadChildren}
            lastLevel={3}
            rowHeight={76}
            deleteRow={(row) => {
              setOpenDeleteModal(true);
              setActionBtnRow(row);
            }}
            setSelectedRow={setSelectedRow}
            selectedRow={selectedRow}
            editRow={(row) => {
              setActionBtnRow(row);
              setOpenEditModal(true);
            }}
            openRow={(row) => {
              setCurrExpandedRow(row);
              setOpenExpandedInfo(true);
            }}
            actionBtnCfg={{
              hideOnLevel: [
                {
                  level: 1,
                  hideAll: false,
                  hideDelete: true,
                  hideEdit: true,
                  hideExpand: false,
                },
              ],
            }}
          />
        )}
      </StyledBody>
      {openDeleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={openDeleteModal}
          setIsDeleteModalOpen={setOpenDeleteModal}
          onDelete={() => {
            deleteLicense(actionBtnRow);
            setOpenDeleteModal(false);
          }}
          showConfirm={false}
        />
      )}
      {(openEditModal || openAddModal) && (
        <ClosableModal
          open={openAddModal ? openAddModal : openEditModal}
          onClose={() =>
            openAddModal ? setOpenAddModal(false) : setOpenEditModal(false)
          }
          title={
            openAddModal
              ? selectedRow!.level === 1
                ? t("addBankingOperation")
                : t("addSubLevel")
              : actionBtnRow.level === 3
              ? t("editSubLevel")
              : t("editBankingOperation")
          }
          includeHeader={true}
          width={600}
        >
          <ConfigLicenseCreate
            addLicenseHandler={(data, defaultData) => {
              saveLicense(!openAddModal, data, defaultData);
              setOpenAddModal(false);
              setOpenEditModal(false);
            }}
            modalCloseHandler={() => {
              setOpenAddModal(false);
              setOpenEditModal(false);
            }}
            isBankOperation={isBankOperation()}
            defaultData={openAddModal ? selectedRow : actionBtnRow}
            isEdit={!openAddModal}
          />
        </ClosableModal>
      )}
      {openExpandedInfo && (
        <ClosableModal
          open={openExpandedInfo}
          onClose={() => setOpenExpandedInfo(false)}
          title={
            currExpandedRow?.level === 1
              ? t("license")
              : currExpandedRow?.level === 2
              ? t("bankingOperation")
              : t("subLevel")
          }
          includeHeader={true}
          width={600}
          height={"auto"}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            sx={{ gap: "8px", padding: "8px" }}
          >
            <StyledCodeTextBox display={"flex"}>
              {currExpandedRow?.code} <CopyCellButton />
            </StyledCodeTextBox>
            {currExpandedRow?.level === 2 && (
              <Box display={"flex"} justifyContent={"flex-start"}>
                <StyledCurrencyBox isEnable={currExpandedRow?.nationalCurrency}>
                  {t("nationalCurrency")}
                </StyledCurrencyBox>
                <StyledCurrencyBox isEnable={currExpandedRow?.foreignCurrency}>
                  {t("foreignCurrency")}
                </StyledCurrencyBox>
              </Box>
            )}
            <StyledDescription>
              {currExpandedRow?.description}
            </StyledDescription>
          </Box>
        </ClosableModal>
      )}
    </Box>
  );
};

export default ConfigLicenseItemPage;
