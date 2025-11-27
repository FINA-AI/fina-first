import ToolbarListSearch from "./ListSearch";
import CustomList from "../../common/List/List";
import React from "react";
import MiniPaging from "../../common/Paging/MiniPaging";
import withLoading from "../../../hoc/withLoading";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { Catalog } from "../../../types/catalog.type";

interface MiniCatalogProps {
  data: Catalog;
  itemId: string;
  catalogLength: number;
  pagingPage: number;
  filterValue: string;
  initialRowsPerPage: number;
  onFilter(searchValue: string): void;
  setActivePage(page: number): void;
  onSelect(item: Catalog, autoSelect?: boolean): void;
}

const StyledListContainer = styled(Box)({
  height: "calc(100% - 105px)",
  overflow: "auto",
});

const StyledDrawerContainer = styled(Box)({
  height: "100%",
  position: "relative",
});

const StyledPages = styled(Box)({
  bottom: "0",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  position: "absolute",
  padding: "8px 16px",
});

const MiniCatalog: React.FC<MiniCatalogProps> = ({
  data,
  onSelect,
  itemId,
  setActivePage,
  catalogLength,
  pagingPage,
  filterValue,
  onFilter,
  initialRowsPerPage,
}) => {
  return (
    <StyledDrawerContainer data-testid={"mini-catalog"}>
      <div>
        <ToolbarListSearch
          filterValue={filterValue}
          onFilter={onFilter}
          height={48}
        />
      </div>
      <StyledListContainer>
        <CustomList onSelect={onSelect} data={data} itemId={itemId} />
      </StyledListContainer>
      <StyledPages>
        <MiniPaging
          totalNumOfRows={catalogLength}
          initialedPage={pagingPage}
          onPageChange={(number) => setActivePage(number)}
          initialRowsPerPage={initialRowsPerPage}
        />
      </StyledPages>
    </StyledDrawerContainer>
  );
};

export default React.memo(withLoading(MiniCatalog));
