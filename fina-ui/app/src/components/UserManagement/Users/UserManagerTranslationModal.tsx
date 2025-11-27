import { useTranslation } from "react-i18next";
import ClosableModal from "../../common/Modal/ClosableModal";
import GridTable from "../../common/Grid/GridTable";
import { Box, styled } from "@mui/system";
import SearchField from "../../common/Field/SearchField";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Grid, InputAdornment, Tooltip } from "@mui/material";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import {
  loadTranslations,
  updateTranslation,
} from "../../../api/services/userManagerService";
import UndoIcon from "@mui/icons-material/Undo";
import TextField from "../../common/Field/TextField";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import { GridColumnType } from "../../../types/common.type";
import { SaveIcon } from "../../../api/ui/icons/SaveIcon";

interface UserManagerTranslationModalProps {
  open: boolean;
  handleClose: VoidFunction;
}

interface Translation {
  id: number;
  key: string;
  value: string;
  dirty: boolean;
}

const StyledGrid = styled(Grid)(({ theme }: any) => ({
  ...theme.pageToolbar,
  justifyContent: "end",
  backgroundColor: "inherit",
  padding: "0px 8px",
}));

const UserManagerTranslationModal: React.FC<
  UserManagerTranslationModalProps
> = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const originalTranslationRef = useRef<Translation[]>();

  const columnHeader = [
    {
      field: "key",
      headerName: t("key"),
    },
    {
      field: "value",
      headerName: t("value"),
      hideCopy: editMode,
      renderCell: (value: string, row: Translation) => {
        return <TranslationColumns row={row} value={value} />;
      },
    },
  ];

  useEffect(() => {
    setColumns(columnHeader);
  }, [editMode]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    filterTranslations(searchValue);
  }, [searchValue]);

  const filterTranslations = (searchValue: string) => {
    const normalizedSearch = searchValue?.toLowerCase();
    if (normalizedSearch) {
      const filteredData = originalTranslationRef?.current?.filter(
        ({ key, value }) =>
          key?.toLowerCase().includes(normalizedSearch) ||
          value?.toLowerCase().includes(normalizedSearch)
      );
      setTranslations(structuredClone(filteredData) || []);
    } else {
      setTranslations(structuredClone(originalTranslationRef?.current) || []);
    }
  };

  const init = () => {
    setLoading(true);
    loadTranslations()
      .then((res) => {
        let response = res.data.map((item: Translation, index: number) => ({
          ...item,
          id: index + 1,
        }));

        originalTranslationRef.current = JSON.parse(JSON.stringify(response));
        setTranslations(response);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const onChange = (rowId: number, key: string, value: string) => {
    let originalValue = originalTranslationRef?.current?.find(
      (item) => item.id === rowId
    )?.[key as keyof Translation];
    let field: any = translations.find((item) => item.id === rowId);
    if (field && value !== originalValue) {
      field.dirty = { ...field.dirty, [key]: true };
    } else {
      delete field.dirty[key];
    }
    field[key] = value;

    return value === originalValue;
  };

  const saveHandler = () => {
    const changedData = translations.filter(
      (item) => item.dirty && Object.keys(item.dirty).length > 0
    );

    const changeItems: Translation[] = [];

    changedData.forEach((item) => {
      const obj: any = {
        key: item.key,
        value: item.value,
      };
      changeItems.push(obj);
    });

    if (changeItems.length > 0) {
      setLoading(true);
      updateTranslation(changeItems)
        .then(() => {
          setEditMode(false);
          setSaveModalOpen(false);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => setLoading(false));
    } else {
      setSaveModalOpen(false);
      setEditMode(false);
    }
  };

  const TranslationColumns = ({
    value,
    row,
  }: {
    value: string;
    row: Translation;
  }) => {
    const [originalValue, setOriginalValue] = useState(value);
    const [hasUndo, setHasUndo] = useState(false);

    const onChangeValue = (
      rowId: number,
      languageCode: string,
      value: string
    ) => {
      setOriginalValue(value);
      setHasUndo(!onChange(rowId, languageCode, value));
    };

    const undoFunction = (rowId: number, key: string, val: string) => {
      setHasUndo(!onChange(rowId, key, val));
      setOriginalValue(value);
    };

    const undo = (rowId: number, key: string, value: string) => {
      return (
        <Tooltip title={t("Undo")}>
          <UndoIcon
            style={{
              cursor: "pointer",
              fontSize: "18px",
              color: "#2962FF",
            }}
            onClick={() => {
              undoFunction(rowId, key, value);
            }}
          />
        </Tooltip>
      );
    };

    const memoizedTextField = useMemo(
      () => (
        <TextField
          size={"small"}
          width={200}
          value={originalValue}
          onChange={(value: string) => onChangeValue(row?.id, "value", value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {hasUndo && undo(row?.id, "value", value)}
              </InputAdornment>
            ),
          }}
        />
      ),
      [originalValue]
    );

    return editMode ? memoizedTextField : <>{value}</>;
  };

  return (
    <>
      <ClosableModal
        onClose={handleClose}
        open={open}
        width={650}
        height={550}
        disableBackdropClick={true}
        padding={0}
        includeHeader={true}
        title={t("translatepermissions")}
        titleFontWeight={"600"}
      >
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
        >
          <Box
            padding={"8px"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Box display={"flex"}>
              <SearchField
                withFilterButton={false}
                text={t("searchRows")}
                onFilterChange={(val) => setSearchValue(val)}
                onClear={() => setSearchValue("")}
                width={"275px"}
              />
            </Box>
            <StyledGrid>
              {!editMode ? (
                <PrimaryBtn
                  onClick={() => setEditMode(true)}
                  fontSize={12}
                  endIcon={<EditIcon />}
                >
                  {t("edit")}
                </PrimaryBtn>
              ) : (
                <Box
                  display={"flex"}
                  width={"100%"}
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                >
                  <Box display={"flex"} gap={"10px"}>
                    <GhostBtn
                      onClick={() => {
                        setEditMode(false);
                        filterTranslations(searchValue);
                      }}
                      style={{ marginRight: "5px" }}
                      height={32}
                    >
                      {t("cancel")}
                    </GhostBtn>
                  </Box>
                  <PrimaryBtn
                    onClick={() => setSaveModalOpen(true)}
                    style={{ background: "#289E20", height: "32px" }}
                  >
                    {t("save")}{" "}
                    <DoneIcon
                      sx={{
                        color: "#FFFFFF",
                        marginLeft: "5px",
                      }}
                    />
                  </PrimaryBtn>
                </Box>
              )}
            </StyledGrid>
          </Box>
          <GridTable
            columns={columns}
            rows={translations}
            setRows={setTranslations}
            virtualized={true}
            loading={loading}
          />
        </Box>
      </ClosableModal>
      {saveModalOpen && (
        <ConfirmModal
          isOpen={saveModalOpen}
          setIsOpen={setSaveModalOpen}
          onConfirm={saveHandler}
          confirmBtnTitle={t("save")}
          headerText={t("saveHeaderText")}
          additionalBodyText={t("changes")}
          bodyText={t("saveBodyText")}
          icon={<SaveIcon />}
        />
      )}
    </>
  );
};

export default UserManagerTranslationModal;
