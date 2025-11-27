import { Box, styled } from "@mui/system";
import TextField from "../../common/Field/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import React, { useEffect, useState } from "react";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { deleteLegislativeCategory } from "../../../api/services/legislativeDocumentService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { getLegislativeBasisData } from "../../../api/services/legislativeBasisService";
import { CategoryType } from "../../../types/legislativeDocument.type";

interface CategoryModalProps {
  setIsCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addCategories: (data: CategoryType[]) => void;
}

const StyledRootBox = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  boxSizing: "border-box",
}));

const StyledContent = styled(Box)(() => ({
  padding: "10px 12px",
  overflow: "auto",
}));

const StyledAddRoundedIcon = styled(AddRoundedIcon)(
  ({ theme }: { theme: any }) => ({
    ...theme.smallIcon,
  })
);
const StyledDeleteRoundedIcon = styled(DeleteRoundedIcon)(
  ({ theme }: { theme: any }) => ({
    ...theme.smallIcon,
    cursor: "pointer",
    "&:hover": {
      color: "#FF4128",
    },
  })
);
const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalFooter,
  display: "flex",
  justifyContent: "flex-end",
  padding: "4px",
  gap: "12px",
}));

const StyledBtnBox = styled(Box)(() => ({
  color: "#2962FF",
  fontWeight: 500,
  fontSize: 11,
  lineHeight: "16px",
  display: "flex",
  alignItems: "center",
  paddingLeft: 4,
  paddingTop: 4,
  cursor: "pointer",
}));
const CategoryModal: React.FC<CategoryModalProps> = ({
  setIsCategoryModalOpen,
  addCategories,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [data, setData] = useState<CategoryType[]>([]);

  useEffect(() => {
    initCategories();
  }, []);

  const initCategories = () => {
    getLegislativeBasisData().then((res) => {
      setData(res.data);
    });
  };

  const addNewCategory = () => {
    setData([...data, { name: "", version: 0, id: 0 }]);
  };

  const removeCategory = (index: number, id: number) => {
    if (!id) {
      let newArr = [...data.filter((_, i) => index !== i)];
      setData(newArr);
    } else {
      deleteLegislativeCategory(id)
        .then(() => {
          let newArr = [...data.filter((item) => item.id !== id)];
          setData(newArr);
        })
        .catch((error) => {
          openErrorWindow(error, t("error"), true);
        });
    }
  };

  return (
    <StyledRootBox>
      <StyledContent>
        {data.map((item, index) => {
          return (
            <Box p={"4px"} key={index}>
              <TextField
                onChange={(val: string) => {
                  item["name"] = val;
                }}
                value={item.name}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <StyledDeleteRoundedIcon
                        onClick={() => removeCategory(index, +item.id)}
                        data-testid={"delete-icon"}
                      />
                    </InputAdornment>
                  ),
                }}
                fieldName={"category-" + index}
              />
            </Box>
          );
        })}
        <StyledBtnBox
          onClick={addNewCategory}
          data-testid={"create-category-button"}
        >
          {t("addNewCategory")}
          <StyledAddRoundedIcon />
        </StyledBtnBox>
      </StyledContent>
      <StyledFooter>
        <GhostBtn
          onClick={() => {
            setIsCategoryModalOpen(false);
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn
          onClick={() => {
            addCategories(data);
            setIsCategoryModalOpen(false);
          }}
          data-testid={"save-button"}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </StyledRootBox>
  );
};

export default CategoryModal;
