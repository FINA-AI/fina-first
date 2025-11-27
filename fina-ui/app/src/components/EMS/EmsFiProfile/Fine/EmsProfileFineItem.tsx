import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { EmsFineDataType } from "../../../../types/emsFineDataType";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useTranslation } from "react-i18next";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CreateIcon from "@mui/icons-material/Create";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/material/styles";

interface EmsProfileFineItemProps {
  fine: EmsFineDataType;
  onEditClick: (fine: EmsFineDataType) => void;
  onDeleteClick: (fine: EmsFineDataType) => void;
}

interface DescriptionItemProps {
  description: string;
  value: string | number;
  direction?: any;
  flex?: number;
  dataKey: string;
}

const StyledAccordion = styled(Accordion)({
  "&.MuiAccordion-root.Mui-expanded": {
    marginBottom: "2px !important",
    marginTop: "2px !important",
  },
});

const StyledDescriptionItem = styled(Typography)({
  fontWeight: 300,
  marginLeft: 5,
  fontSize: "12px",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const StyledAccordionDetils = styled(AccordionDetails)({
  paddingLeft: 70,
  paddingRight: 70,
  backgroundColor: "rgba(194,221,242,0.56)",
});

const EmsProfileFineItem: React.FC<EmsProfileFineItemProps> = ({
  fine,
  onEditClick,
  onDeleteClick,
}) => {
  const { hasPermission } = useConfig();
  const [expanded, setExpanded] = useState<boolean>(false);

  const { t } = useTranslation();

  const getFineTotalAmount = () => {
    return fine.finePrice * fine.amount;
  };

  const DescriptionItem: React.FC<DescriptionItemProps> = ({
    description,
    value,
    direction = "row",
    flex = 1,
    dataKey,
  }) => {
    return (
      <Box
        display={"flex"}
        flexDirection={direction}
        flex={flex}
        overflow={"hidden"}
        textOverflow={"ellipsis"}
        alignItems={"flex-start"}
      >
        <Typography
          style={{
            fontWeight: 500,
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </Typography>
        <StyledDescriptionItem data-testid={dataKey + "-value"}>
          {value}
        </StyledDescriptionItem>
      </Box>
    );
  };

  return (
    <StyledAccordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
      }}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        style={{
          backgroundColor: expanded ? "rgba(194,221,242,0.56)" : "inherit",
        }}
      >
        <Box display={"flex"} flexDirection={"row"} width={"100%"}>
          <Box>
            <Box>{!expanded && <ArrowRightIcon />}</Box>
            <Box>{expanded && <ArrowDropUpIcon />}</Box>
          </Box>
          <Box flex={1} display={"flex"} justifyContent={"space-between"}>
            <DescriptionItem
              description={t("description")}
              value={fine.description}
              flex={2}
              direction={"column"}
              dataKey={"description"}
            />
            <DescriptionItem
              description={t("amount")}
              value={fine.amount}
              direction={"column"}
              dataKey={"amount"}
            />
            <DescriptionItem
              description={t("fineprice")}
              value={fine.finePrice}
              direction={"column"}
              dataKey={"fine-price"}
            />
            <DescriptionItem
              description={t("total")}
              value={getFineTotalAmount()}
              direction={"column"}
              dataKey={"total"}
            />
            {hasPermission(PERMISSIONS.EMS_INSPECTION_DELETE) && (
              <Box>
                <RemoveCircleIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(fine);
                  }}
                  fontSize={"small"}
                  style={{
                    color: "red",
                  }}
                  data-testid={"delete-button"}
                />
              </Box>
            )}
            {hasPermission(PERMISSIONS.EMS_INSPECTION_AMEND) && (
              <Box>
                <CreateIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(fine);
                  }}
                  fontSize={"small"}
                  style={{
                    color: "grey",
                  }}
                  data-testid={"edit-button"}
                />
              </Box>
            )}
          </Box>
        </Box>
      </AccordionSummary>
      <StyledAccordionDetils>
        <DescriptionItem
          description={t("rule")}
          value={fine.fineType.rule}
          dataKey={"rule"}
        />
        <DescriptionItem
          description={t("article") + " : "}
          value={fine.fineType.article}
          dataKey={"article"}
        />
        <DescriptionItem
          description={t("paragraph") + " : "}
          value={fine.fineType.paragraph}
          dataKey={"paragraph"}
        />
        <DescriptionItem
          description={t("subparagraph") + " : "}
          value={fine.fineType.subParagraph}
          dataKey={"sub-paragraph"}
        />
      </StyledAccordionDetils>
    </StyledAccordion>
  );
};

export default EmsProfileFineItem;
