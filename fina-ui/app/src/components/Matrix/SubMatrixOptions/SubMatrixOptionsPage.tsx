import { Box, Grid } from "@mui/material";
import NoRecordIndicator from "../../common/NoRecordIndicator/NoRecordIndicator";
import CardGridSkeleton from "../../FI/Skeleton/Configuration/CardGridSkeleton";
import React, { useEffect, useRef, useState } from "react";
import { SubMatrixOptionsDataType } from "../../../types/matrix.type";
import SubMatrixOptionsCard from "./SubMatrixOptionsCard";
import SubMatrixOptionsModal from "./SubMatrixOptionsModal";
import { styled } from "@mui/system";

const StyledRoot = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  paddingBottom: "22px",
}));

const StyledBody = styled(Grid)(({ loading }: { loading: boolean }) => ({
  boxSizing: "border-box",
  position: "relative",
  height: "100%",
  padding: "8px 12px",
  margin: 0,
  overflow: loading ? "hidden" : "auto",
}));
interface SubMatrixOptionsPageProps {
  data: SubMatrixOptionsDataType[];
  loading: boolean;
  onSave: (submitData: SubMatrixOptionsDataType) => void;
}

const SubMatrixOptionsPage: React.FC<SubMatrixOptionsPageProps> = ({
  data,
  loading,
  onSave,
}) => {
  const [editModalDetails, setEditModalDetails] = useState<{
    open: boolean;
    data?: SubMatrixOptionsDataType;
  }>({ open: false });
  const lastCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastCardRef.current) {
      lastCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <StyledRoot>
      <StyledBody loading={loading}>
        {!loading && data.length === 0 && <NoRecordIndicator />}
        {loading ? (
          <CardGridSkeleton cardNumber={data.length} fiType={true} />
        ) : (
          <Grid container item xs={12} direction={"row"} wrap={"wrap"}>
            {data.map((item, index: number) => (
              <SubMatrixOptionsCard
                key={index}
                details={item}
                setAddModalDetails={setEditModalDetails}
              />
            ))}
            <div ref={lastCardRef} />
          </Grid>
        )}
      </StyledBody>
      {editModalDetails.open && (
        <SubMatrixOptionsModal
          setEditModalDetails={setEditModalDetails}
          editModalDetails={editModalDetails}
          selectedCard={editModalDetails.data}
          onSave={onSave}
        />
      )}
    </StyledRoot>
  );
};

export default SubMatrixOptionsPage;
