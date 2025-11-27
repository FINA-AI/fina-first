import { Box } from "@mui/material";
import EmsProfileSanctionContainer from "../../../containers/Ems/EmsProfile/EmsProfileSanctionContainer";
import EmsProfileFineContainer from "../../../containers/Ems/EmsProfile/Fine/EmsProfileFineContainer";
import React, { FC, useRef, useState } from "react";
import { EmsFiProfileSanctionType } from "../../../types/emsFiProfile.type";
import { SanctionDataType } from "../../../types/sanction.type";
import { styled } from "@mui/material/styles";

interface EMSProfileDetailsProps {
  menuRef: React.RefObject<HTMLDivElement>;
  selectedInspectionRow: any;
  sanctionTypes: SanctionDataType[];
}

const StyledContent = styled(Box)({
  height: "100%",
  display: "flex",
  boxSizing: "border-box",
  minWidth: "0px",
  minHeight: "0px",
});

const EMSProfileDetails: FC<EMSProfileDetailsProps> = ({
  menuRef,
  selectedInspectionRow,
  sanctionTypes,
}) => {
  const emsProfileSancContRef = useRef<any>(null);

  const [selectedSanction, setSelectedSanction] =
    useState<EmsFiProfileSanctionType>();

  const handleSanctionTotalSizeUpdate = (
    sanctionId: number,
    totalPrice: number
  ) => {
    if (emsProfileSancContRef?.current?.updateSanctionTotalPrice) {
      emsProfileSancContRef.current.updateSanctionTotalPrice(
        sanctionId,
        totalPrice
      );
    }
  };

  return (
    <StyledContent flex={2} ref={menuRef} flexDirection={"column"}>
      <StyledContent>
        <EmsProfileSanctionContainer
          ref={emsProfileSancContRef}
          fiCode={selectedInspectionRow ? selectedInspectionRow.fiCode : ""}
          inspectionId={selectedInspectionRow?.id}
          selectedSanction={selectedSanction}
          setSelectedSanction={setSelectedSanction}
          sanctionTypes={sanctionTypes}
        />
      </StyledContent>
      <StyledContent>
        <EmsProfileFineContainer
          selectedSanction={selectedSanction}
          fiCode={selectedInspectionRow?.fiCode}
          handleSanctionTotalSizeUpdate={handleSanctionTotalSizeUpdate}
        />
      </StyledContent>
    </StyledContent>
  );
};

export default EMSProfileDetails;
