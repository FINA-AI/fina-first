import { Box, styled } from "@mui/system";
import Select from "../../../common/Field/Select";
import TextField from "../../../common/Field/TextField";
import React from "react";
import { useTranslation } from "react-i18next";
import MDTNodeEditForm from "./MDTNodeEditForm";
import MDTInputEditForm from "./MDTInputEditForm";
import MDTDataEditForm from "./MDTDataEditForm";
import { getLanguage } from "../../../../util/appUtil";
import { connect } from "react-redux";
import { LanguageType } from "../../../../types/common.type";
import { MdtNode, MDTNodeType } from "../../../../types/mdt.type";

interface MDTNodeGeneralInfoEditProps {
  data: MdtNode;
  setData: (data: MdtNode) => void;
  languages: LanguageType[];
  isUsedByAnotherNode: boolean;
}

const StyledBox = styled(Box)(() => ({
  marginTop: 10,
}));

const MDTNodeGeneralInfoEdit: React.FC<MDTNodeGeneralInfoEditProps> = ({
  data,
  setData,
  languages,
  isUsedByAnotherNode,
}) => {
  const { t } = useTranslation();
  const langCode = getLanguage();
  const currentLang = languages.find((lang) => lang.code === langCode);

  const GetEditComponent = () => {
    switch (data.type) {
      case MDTNodeType.NODE:
        return <MDTNodeEditForm data={data} setData={setData} />;
      case MDTNodeType.INPUT:
        return <MDTInputEditForm data={data} setData={setData} />;
      case MDTNodeType.DATA:
        return <MDTDataEditForm data={data} setData={setData} />;
    }
  };

  const getNodeTypeDataForSelect = (selectedNode: MdtNode) => {
    if (
      selectedNode.parentId === 0 ||
      (selectedNode.type === MDTNodeType.NODE &&
        selectedNode.children?.length > 0)
    ) {
      return [{ label: "Node", value: MDTNodeType.NODE }];
    }

    return [
      { label: "Node", value: MDTNodeType.NODE },
      { label: "Input", value: MDTNodeType.INPUT },
      { label: "Variable", value: MDTNodeType.VARIABLE },
      { label: "List", value: MDTNodeType.LIST },
      { label: "Data", value: MDTNodeType.DATA },
    ];
  };

  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"}>
      <StyledBox>
        <Select
          label={t("type")}
          value={data.type}
          data={getNodeTypeDataForSelect(data)}
          onChange={(val) => {
            setData({ ...data, type: val as MDTNodeType });
          }}
          size={"small"}
        />
      </StyledBox>
      <StyledBox>
        <TextField
          value={data.code}
          onChange={(val: string) => {
            setData({ ...data, code: val });
          }}
          label={t("code")}
          size={"small"}
          isError={data.code === undefined ? false : !data.code}
          isDisabled={isUsedByAnotherNode}
        />
      </StyledBox>
      <StyledBox>
        <TextField
          value={
            currentLang && data?.descriptions
              ? data.descriptions[currentLang.id]
              : data?.name || ""
          }
          onChange={(val: string) => {
            setData({ ...data, name: val });
          }}
          label={t("name")}
          size={"small"}
        />
      </StyledBox>
      {GetEditComponent()}
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  languages: state.getIn(["language", "languages"]),
});

export default connect(mapStateToProps)(MDTNodeGeneralInfoEdit);
