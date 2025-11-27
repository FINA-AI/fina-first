import {
  Box,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { useHistory } from "react-router-dom";
import {
  SubMatrixOptionsDataType,
  VctTableEndConditionsType,
} from "../../../types/matrix.type";
import { useTranslation } from "react-i18next";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Grid)(({ theme }: any) => ({
  boxSizing: "border-box",
  flexGrow: 1,
  minWidth: 164,
  width: "auto",
  border: theme.palette.borderColor,
  borderRadius: 4,
  padding: 12,
  boxShadow: "none",
  "&:hover": {
    boxShadow: theme.palette.paperBoxShadow,
  },
  cursor: "pointer",
  margin: 4,
  maxHeight: "182px",
}));

const StyledTypeName = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  height: 18,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 2,
  padding: "3px 6px 2px 6px",
}));

const StyledEditIconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 22,
  height: 22,
});

const StyledEditIcon = styled(EditIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  cursor: "pointer",
}));

const StyledSecondTitle = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.secondaryText,
  marginTop: 4,
  marginBottom: 2,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  padding: "2px",
}));

const StyledTableHeader = styled(TableHead)(() => ({
  "& .MuiTableCell-root": {
    padding: 0,
  },
}));

const StyledTableBody = styled(TableBody)(() => ({
  "& .MuiTableCell-root": {
    padding: 8,
  },
}));

const StyledTableBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

const StyledTableIcon = styled(TableChartRoundedIcon)(({ theme }: any) => ({
  height: "122px",
  width: "100px",
  color: theme.palette.primary.main,
}));

interface SubMatrixOptionsCardProps {
  details: SubMatrixOptionsDataType;

  setAddModalDetails: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      data?: SubMatrixOptionsDataType;
    }>
  >;
}
const SubMatrixOptionsCard: React.FC<SubMatrixOptionsCardProps> = ({
  details,
  setAddModalDetails,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const url = history.location.pathname;

  const conditionsTable = (conditions: VctTableEndConditionsType[]) => (
    <TableContainer>
      <Table>
        <StyledTableHeader>
          <TableRow>
            <TableCell>{t("column")}</TableCell>
            <TableCell>{t("condition")}</TableCell>
          </TableRow>
        </StyledTableHeader>
        <StyledTableBody>
          {conditions.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.column}</TableCell>
              <TableCell>{item.condition}</TableCell>
            </TableRow>
          ))}
        </StyledTableBody>
      </Table>
    </TableContainer>
  );

  const MctTable = () => {
    return (
      <Grid item display={"flex"} flexDirection={"column"}>
        <Box display={"flex"} paddingBottom={"8px"}>
          <StyledTypeName>{details.definitionTable.type}</StyledTypeName>
          <StyledSecondTitle paddingLeft={"10px !important"}>
            {details.definitionTable.code}
          </StyledSecondTitle>
        </Box>
        <StyledTableBox>
          <StyledTableIcon />
        </StyledTableBox>
      </Grid>
    );
  };

  const VctTable = () => {
    return (
      <>
        <Grid item>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box display={"flex"} paddingBottom={"8px"}>
              <StyledTypeName>{details.definitionTable.type}</StyledTypeName>
              <StyledSecondTitle paddingLeft={"10px !important"}>
                {details.definitionTable.code}
              </StyledSecondTitle>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <StyledEditIconContainer>
                <IconButton>
                  <StyledEditIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddModalDetails({ open: true, data: details });
                    }}
                  />
                </IconButton>
              </StyledEditIconContainer>
            </Box>
          </Box>
        </Grid>
        <Grid item display={"flex"}>
          <Box width={"100%"}>
            <StyledSecondTitle>
              {`${t("startcolumn")}: ${details.startColumn || ""}`}
            </StyledSecondTitle>
            <StyledSecondTitle>
              {`${t("vcttableheader")}: ${details.vctTableHeader || ""}`}
            </StyledSecondTitle>
            <StyledSecondTitle>
              {`${t("offset")}: ${details.offset}`}
            </StyledSecondTitle>
            <StyledSecondTitle>
              {`${t("startrow")}: ${details.startRow}`}
            </StyledSecondTitle>
            <StyledSecondTitle>
              {`${t("afterheaderrowAmount")}: ${details.afterHeaderRowAmount}`}
            </StyledSecondTitle>
          </Box>
          <Box width={"100%"}>
            <StyledSecondTitle
              style={{ paddingBottom: "6px", fontWeight: 600 }}
            >
              {`${t("stopconditions")}:`}
            </StyledSecondTitle>
            {conditionsTable(details.vctTableEndConditions)}
          </Box>
        </Grid>
      </>
    );
  };

  return (
    <Grid item xl={3} md={4} sm={6} xs={12}>
      <StyledCard onClick={() => history.push(`${url}/${details.id}`)}>
        {details.definitionTable.type === "MCT" ? <MctTable /> : <VctTable />}
      </StyledCard>
    </Grid>
  );
};

export default SubMatrixOptionsCard;
