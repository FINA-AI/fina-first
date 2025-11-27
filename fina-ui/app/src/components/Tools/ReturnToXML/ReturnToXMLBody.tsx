import TextField from "../../common/Field/TextField";
import React from "react";
import { useTranslation } from "react-i18next";
import Select from "../../common/Field/Select";
import DatePicker from "../../common/Field/DatePicker";
import { Grid } from "@mui/material";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { ReturnToXMLData } from "../../../types/tools.type";
import { LanguageType } from "../../../types/common.type";

const StyledGridItem = styled(Grid)({
  padding: "4px 8px",
});

interface ReturnToXMLBodyProps {
  data?: ReturnToXMLData;
  setData: (data: ReturnToXMLData) => void;
  languages: LanguageType[];
}

const ReturnToXMLBody: React.FC<ReturnToXMLBodyProps> = ({
  data,
  setData,
  languages,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container>
      <StyledGridItem xs={6} item>
        <TextField
          onChange={(val: string) => {
            setData({ ...(data ?? {}), folderLocation: val });
          }}
          label={t("outputFolderServer")}
          fieldName={"outputFolderServer"}
        />
      </StyledGridItem>
      <StyledGridItem xs={6} item>
        <Select
          data={languages.map((item) => {
            return { label: item.name, value: item.code };
          })}
          label={t("language") + ":"}
          onChange={(val: string) => {
            setData({ ...(data ?? {}), languageCode: val });
          }}
          data-testid={"language-select"}
        />
      </StyledGridItem>
      <StyledGridItem xs={6} item>
        <DatePicker
          onChange={(val) => {
            setData({ ...(data ?? {}), fromDate: val });
          }}
          label={t("periodFrom")}
          data-testid={"periodFrom"}
        />
      </StyledGridItem>
      <StyledGridItem xs={6} item>
        <DatePicker
          onChange={(val) => {
            setData({ ...data, toDate: val });
          }}
          label={t("periodTo")}
          data-testid={"periodTo"}
        />
      </StyledGridItem>
    </Grid>
  );
};

const languageReducer = "language";
const mapStateToProps = (state: any) => ({
  languages: state.getIn([languageReducer, "languages"]),
});

export default connect(mapStateToProps)(ReturnToXMLBody);
