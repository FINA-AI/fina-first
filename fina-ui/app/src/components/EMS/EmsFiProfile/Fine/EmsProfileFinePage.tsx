import React, { useEffect, useState } from "react";
import { EmsFineDataType } from "../../../../types/emsFineDataType";
import { Box, darken } from "@mui/system";
import EmsProfileFineItem from "./EmsProfileFineItem";
import Typography from "@mui/material/Typography";
import { EmsFiProfileSanctionType } from "../../../../types/emsFiProfile.type";
import { useTranslation } from "react-i18next";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmsProfileFineAddModal from "./EmsProfileFineAddModal";
import { SanctionFineType } from "../../../../types/sanction.type";
import withLoading from "../../../../hoc/withLoading";
import DeleteForm from "../../../common/Delete/DeleteForm";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/material/styles";

interface EmsProfileFinePage {
  selectedSanction?: EmsFiProfileSanctionType;
  data: EmsFineDataType[];
  sanctionFineTypeData: SanctionFineType[];
  onSaveClick: (fine: EmsFineDataType) => void;
  onDeleteClick: (fine: EmsFineDataType) => void;
  onRefreshClick: () => void;
  loading?: boolean;
}

const StyledSummaryItem = styled(Box)(({ theme }) => ({
  paddingLeft: 40,
  paddingRight: 40,
  marginBottom: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "rgb(226,233,239)",
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "9px",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  width: "100%",
  minWidth: "0px",
  minHeight: "0px",
  boxSizing: "border-box",
}));

const StyledIconButtonsBox = styled(Box)(({ theme }) => ({
  "& .MuiButtonBase-root": {
    padding: "2px",
    border: "1px solid #10629e !important",
    borderRadius: "4px",
    marginRight: "5px",
    background:
      theme.palette.mode === "dark" ? theme.palette.primary.main : "#178ee5",
    "&.Mui-disabled": {
      background:
        theme.palette.mode === "dark"
          ? `${darken(theme.palette.secondary.main, 0.2)} !important`
          : "#1478c2 !important",
      "& .MuiSvgIcon-root": {
        color: "rgba(149,194,230,255)",
      },
    },
  },
  "& .MuiSvgIcon-root": {
    width: "16px",
    height: "16px",
    color: "#FFF",
    "&:hover": {
      background:
        theme.palette.mode === "dark" ? theme.palette.primary.main : "#178ee5",
    },
  },
}));

const EmsProfileFinePage: React.FC<EmsProfileFinePage> = ({
  selectedSanction,
  onSaveClick,
  onDeleteClick,
  onRefreshClick,
  data = [],
  sanctionFineTypeData = [],
}) => {
  const { hasPermission } = useConfig();
  const [totalFineTypes, setTotalFineTypes] = useState<number>(0);
  const [fineCount, setFineCount] = useState<number>(0);
  const [selectedFine, setSelectedFine] = useState<EmsFineDataType>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDeleteModelOpen, setDeleteModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedSanction) {
      const fineTypes = new Set();
      data.forEach((item) => fineTypes.add(item.fineType.id));
      setFineCount(
        data.reduce((total, curr) => {
          return total + curr.amount;
        }, 0)
      );

      setTotalFineTypes(fineTypes.size);
    } else {
      setFineCount(0);
      setTotalFineTypes(0);
    }
  }, [data]);

  const SummaryItem = () => {
    return (
      <StyledSummaryItem
        display={"flex"}
        justifyContent={"space-between"}
        height={"40px"}
        alignItems={"center"}
      >
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontWeight={500} fontSize={12}>
            {t("finetype")} :
          </Typography>
          <Typography marginLeft={1} fontSize={12}>
            {totalFineTypes}
          </Typography>
        </Box>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography marginLeft={1} fontSize={12}>
            {t("fine")} :
          </Typography>
          <Typography fontWeight={500} fontSize={12}>
            {fineCount}
          </Typography>
        </Box>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontWeight={500} fontSize={12}>
            {t("total")} :
          </Typography>
          <Typography marginLeft={1} fontSize={12}>
            {selectedSanction?.totalPrice ? selectedSanction?.totalPrice : 0}
          </Typography>
        </Box>
      </StyledSummaryItem>
    );
  };

  return (
    <Box
      overflow={"hidden"}
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      flex={1}
    >
      <StyledHeader>
        <Box display={"flex"} style={{ color: "#FFF" }}>
          <FlashOnIcon />
          <span style={{ marginLeft: "5px" }}>{t("fines")}</span>
        </Box>
        <Box display={"flex"}>
          <StyledIconButtonsBox>
            {hasPermission(PERMISSIONS.EMS_INSPECTION_AMEND) && (
              <IconButton
                onClick={() => {
                  setModalOpen(true);
                }}
                size="large"
                disabled={!selectedSanction}
                data-testid={"add-button"}
              >
                <Tooltip title={t("add")}>
                  <AddCircleIcon />
                </Tooltip>
              </IconButton>
            )}

            <IconButton
              size="large"
              onClick={onRefreshClick}
              disabled={!selectedSanction}
              data-testid={"refresh-button"}
            >
              <Tooltip title={t("refresh")}>
                <RefreshIcon />
              </Tooltip>
            </IconButton>
          </StyledIconButtonsBox>
        </Box>
      </StyledHeader>

      <Box
        overflow={"hidden"}
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        flex={1}
      >
        <Box flex={1} overflow={"auto"}>
          {data.map((item, index) => {
            return (
              <div key={index} data-testid={"item-" + index}>
                <EmsProfileFineItem
                  fine={item}
                  onEditClick={(fine) => {
                    setSelectedFine(fine);
                    setModalOpen(true);
                  }}
                  onDeleteClick={(fine) => {
                    setSelectedFine(fine);
                    setDeleteModalOpen(true);
                  }}
                />
              </div>
            );
          })}
        </Box>
        <SummaryItem />
      </Box>
      {isModalOpen && (
        <EmsProfileFineAddModal
          currFine={selectedFine}
          fineTypes={sanctionFineTypeData}
          onCancelClick={() => {
            setModalOpen(false);
            setSelectedFine(undefined);
          }}
          onSaveClick={async (v) => {
            await onSaveClick(v);
            setModalOpen(false);
            setSelectedFine(undefined);
          }}
        />
      )}
      {isDeleteModelOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("fine")}
          isDeleteModalOpen={true}
          setIsDeleteModalOpen={setDeleteModalOpen}
          onDelete={() => {
            setDeleteModalOpen(false);
            selectedFine && onDeleteClick(selectedFine);
            setSelectedFine(undefined);
          }}
        />
      )}
    </Box>
  );
};

export default withLoading(EmsProfileFinePage);
