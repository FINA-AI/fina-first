import { Box, Grid } from "@mui/material";
import RegionalStructureCountryList from "./RegionalStructureCountryList";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import SearchField from "../../../common/Field/SearchField";
import GridTable from "../../../common/Grid/GridTable";
import RegionalStructureCreateProperty from "./Create/RegionalStructureCreateProperty";
import CircularProgress from "@mui/material/CircularProgress";
import RegionalStructureTree from "./RegionalStructureTree";
import RegionalStructureProperties from "./RegionalStructureProperties";
import RegionalStructureSkeleton from "../../Skeleton/Configuration/RegionalStructure/RegionalStructureSkeleton";
import RelationsModal from "../../../UserManagement/Users/RelationsModal";
import SimpleLoadMask from "../../../common/SimpleLoadMask";
import { styled } from "@mui/material/styles";
import {
  CountryItemType,
  RegionPropertiesType,
} from "../../../../containers/FI/Configuration/RegionalStructure/RegionalStructureContainer";
import {
  CountryDataTypes,
  TreeGridColumnType,
  TreeGridStateType,
  TreeState,
} from "../../../../types/common.type";
import { FiDataType } from "../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  paddingTop: "0px !important",
  ...theme.page,
}));

const StyledRegionFi = styled(Box)(() => ({
  color: "#2C3644",
  lineHeight: "20px",
  fontWeight: 600,
  fontSize: "13px",
  textTransform: "capitalize",
}));

const StyledShowAllFi = styled(Box)(({ theme }: any) => ({
  border: theme.palette.borderColor,
  borderRadius: "2px",
  padding: "8px 16px",
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  lineHeight: "16px",
  fontWeight: 500,
  fontSize: "12px",
  cursor: "pointer",
  minWidth: "61px",
}));

const StyledRegionSearch = styled(Box)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

interface StyledHeaderProps {
  padding?: string;
}

const StyledHeader = styled(Box)<StyledHeaderProps>(({ theme, padding }) => ({
  backgroundColor: (theme as any).palette.paperBackground,
  borderTopLeftRadius: "2px",
  height: "100%",
  flexBasis: 0,
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: `0px 1px 0px ${
    theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0"
  }`,
  padding: padding ?? "6px 12px",
}));
const StyledStructureListContainer = styled(Grid)(({ theme }: any) => ({
  borderRight: theme.palette.borderColor,
  backgroundColor: "#FFFFFF",
}));

const StyledCircularProgressCountry = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const StyledCircularProgress = styled(Box)({
  width: "120px",
  height: "90px",
  border: "1px solid #F9F9F9",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
  borderRadius: "4px",
  backgroundColor: "#FFFFFF",
  "& .MuiCircularProgress-svg": {
    color: "#2962FF",
  },
});

const StyledLoadingText = styled(Box)({
  color: "#2C3644",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "15px",
});

const StyledPropertiesWrapper = styled(Box)({
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  marginTop: "12px",
  borderRadius: "2px !important",
  height: "100%",
});

const StyledRegionBody = styled(Box)({
  backgroundColor: "#FFFFFF",
  borderBottomLeftRadius: "2px",
  borderBottomRightRadius: "2px",
});

const StyledRegionFis = styled(Box)({
  position: "relative",
  height: "100%",
  minWidth: 0,
  minHeight: 0,
  boxSizing: "border-box",
});

const StyledSpan = styled("span")({
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: 9999999999999,
});

interface RegionalStructurePageProps {
  countries: CountryDataTypes[];
  selectedCountry?: CountryItemType;
  setSelectedCountry: (country: CountryItemType) => void;
  loading?: boolean;
  deleteCountryFunction: (data: CountryItemType) => void;
  addCountryFunction: (data: CountryItemType) => void;
  regionFIs: FiDataType[] | null;
  regionProperties: RegionPropertiesType[];
  onRegionPropertyDeleteFunction: () => void;
  onRegionPropertySaveFunction: (data: any) => void;
  getRegionFIsDemoDataFunction: () => void;
  saveCountryItemFunction: (countryItem: any, selectedItem: any) => void;
  getChildren: (id: number) => void;
  countryItem: CountryItemType[];
  columns: TreeGridColumnType[];
  defaultExpandedRowIds: number[];
  countryItemDeleteFunction: (items: CountryItemType[]) => void;
  setCountryItems: (items: CountryItemType[]) => void;
  expandToPath: (path: any) => void;
  filterOnClear: () => void;
  maxLevel: number;
  openRestoreModal?: boolean;
  setOpenRestoreModal: React.Dispatch<React.SetStateAction<boolean>>;
  restoreRegionFunc: () => void;
  filterLoading?: boolean;
  regionSearchData: CountryItemType[];
  filterSelectedItem: {
    name: string;
  };
  treeState: TreeState;
  setTreeState: React.Dispatch<React.SetStateAction<TreeGridStateType>>;
}

const RegionalStructurePage: React.FC<RegionalStructurePageProps> = ({
  treeState,
  setTreeState,
  countries = [],
  selectedCountry = {} as CountryItemType,
  setSelectedCountry,
  loading,
  deleteCountryFunction,
  addCountryFunction,
  regionFIs,
  regionProperties = [],
  onRegionPropertyDeleteFunction,
  onRegionPropertySaveFunction,
  getRegionFIsDemoDataFunction,
  saveCountryItemFunction,
  getChildren,
  countryItem,
  columns,
  countryItemDeleteFunction,
  maxLevel,
  openRestoreModal,
  setOpenRestoreModal,
  restoreRegionFunc,
  setCountryItems,
  defaultExpandedRowIds,
  expandToPath,
  filterLoading,
  regionSearchData,
  filterOnClear,
  filterSelectedItem,
}) => {
  const [regionShowAll, setRegionShowAll] = useState(false);
  const { t } = useTranslation();
  const [selectedProperty, setSelectedProperty] =
    useState<RegionPropertiesType>();
  const [openPropertyModal, setOpenPropertyModal] = useState(false);
  const [openEditPropertyModal, setOpenEditPropertyModal] = useState(false);
  const [selectedCountryItems, setSelectedCountryItems] = useState<
    CountryItemType[]
  >([]);

  useEffect(() => {
    setRegionShowAll(false);
  }, [regionProperties, selectedCountry]);

  useEffect(() => {
    if (regionShowAll) {
      getRegionFIsDemoDataFunction();
    }
  }, [regionShowAll]);

  const dummyData = [
    { code: "099879", addressString: "713-699 Broadway", name: "NYC" },
    { code: "099879", addressString: "713-699 Broadway", name: "NYC" },
    { code: "099879", addressString: "713-699 Broadway", name: "NYC" },
    { code: "099879", addressString: "713-699 Broadway", name: "NYC" },
    { code: "099879", addressString: "713-699 Broadway", name: "NYC" },
  ];

  const RegionFIsMemo = useMemo(() => {
    let columns = [
      {
        field: "code",
        headerName: t("code"),
        minWidth: 40,
      },
      {
        field: "name",
        headerName: t("name"),
        minWidth: 85,
      },
      {
        field: "region",
        headerName: t("region"),
        minWidth: 50,
        fixed: true,
        renderCell: () => {
          return <>{selectedCountry.name}</>;
        },
      },
    ];

    return (
      <Box height={"100%"}>
        <Box height={"100%"} display={"flex"} flexDirection={"column"}>
          <StyledRegionSearch
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            padding={"12px"}
            boxShadow={"0px 2px 10px rgba(0, 0, 0, 0.08)"}
          >
            <SearchField
              withFilterButton={false}
              onFilterClick={() => {}}
              onClear={() => {}}
            />
          </StyledRegionSearch>
          <StyledRegionBody overflow={"auto"} display={"block"} height={"100%"}>
            <GridTable
              columns={columns}
              rows={!regionFIs || !regionShowAll ? dummyData : regionFIs}
              setRows={() => {}}
              selectedRows={[]}
              rowOnClick={() => {}}
              loading={false}
            />
          </StyledRegionBody>
        </Box>
      </Box>
    );
  }, [selectedCountry, regionFIs, regionShowAll]);

  return (
    <StyledRoot>
      <Grid height={"100%"} container direction={"row"}>
        {loading ? (
          <RegionalStructureSkeleton />
        ) : (
          <>
            <StyledStructureListContainer item xs={2} height="100%">
              <RegionalStructureCountryList
                setSelectedItem={setSelectedCountry}
                countries={countries}
                selectedItem={selectedCountry}
                deleteCountryFunction={deleteCountryFunction}
                addCountryFunction={addCountryFunction}
                setSelectedCountryItems={setSelectedCountryItems}
                setCountryItems={setCountryItems}
              />
            </StyledStructureListContainer>
            <Grid height={"100%"} item xs={10}>
              <Grid container direction={"row"} height={"100%"} marginTop={0}>
                <Grid
                  item
                  xs={8}
                  height={"100%"}
                  sx={{ paddingBottom: "53px", paddingTop: "0px !important" }}
                >
                  <RegionalStructureTree
                    treeState={treeState}
                    setTreeState={setTreeState}
                    saveCountryItemFunction={saveCountryItemFunction}
                    getChildren={getChildren}
                    countryItems={countryItem}
                    columns={columns}
                    countryItemDeleteFunction={countryItemDeleteFunction}
                    maxLevel={maxLevel}
                    regionProperties={regionProperties}
                    setSelectedCountryItems={setSelectedCountryItems}
                    selectedCountryItems={selectedCountryItems}
                    selectedCountry={selectedCountry}
                    defaultExpandedRowIds={defaultExpandedRowIds}
                    expandToPath={expandToPath}
                    regionTree={regionSearchData}
                    filterOnClear={filterOnClear}
                    filterSelectedItem={filterSelectedItem}
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  pt={"0px !important"}
                  pl={"12px"}
                  display={"flex"}
                  flexDirection={"column"}
                  height={"100%"}
                >
                  <Box
                    height={"100%"}
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    <StyledHeader padding={"20px 12px"}>
                      <StyledRegionFi>{t("regionFi")}</StyledRegionFi>
                      <StyledShowAllFi
                        onClick={() => {
                          selectedCountry.id &&
                            setRegionShowAll(!regionShowAll);
                        }}
                        style={{
                          cursor: selectedCountry.id ? "default" : "pointer",
                          opacity: selectedCountry.id === 0 ? 0.6 : 1,
                        }}
                      >
                        {!regionShowAll ? t("showAllFi") : t("hideAllFi")}
                      </StyledShowAllFi>
                    </StyledHeader>
                    <StyledRegionFis
                      flex={0.7}
                      style={{
                        overflow: regionShowAll ? undefined : "hidden",
                        filter: regionShowAll ? undefined : "blur(2px)",
                      }}
                    >
                      {!regionShowAll && <StyledSpan />}
                      {!regionFIs && regionShowAll && (
                        <StyledCircularProgressCountry>
                          <StyledCircularProgress
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"row"}
                          >
                            <div>
                              <div>
                                <CircularProgress />
                              </div>
                              <StyledLoadingText>
                                {t("Loading")} ...
                              </StyledLoadingText>
                            </div>
                          </StyledCircularProgress>
                        </StyledCircularProgressCountry>
                      )}
                      {RegionFIsMemo}
                    </StyledRegionFis>
                    <StyledPropertiesWrapper flex={0.3}>
                      <RegionalStructureProperties
                        regionProperties={regionProperties}
                        onRegionPropertyDeleteFunction={
                          onRegionPropertyDeleteFunction
                        }
                        selectedProperty={selectedProperty}
                        setSelectedProperty={setSelectedProperty}
                        setOpenEditPropertyModal={setOpenEditPropertyModal}
                        setOpenPropertyModal={setOpenPropertyModal}
                      />
                    </StyledPropertiesWrapper>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {(openPropertyModal || openEditPropertyModal) && (
          <RegionalStructureCreateProperty
            open={openPropertyModal || openEditPropertyModal}
            handClose={() => {
              if (openPropertyModal) setOpenPropertyModal(false);
              else setOpenEditPropertyModal(false);
            }}
            selectedItem={openPropertyModal ? undefined : selectedProperty}
            setSelectedItem={setSelectedProperty}
            title={t("addRegionProperty")}
            onSaveClick={onRegionPropertySaveFunction}
            regionProperties={regionProperties}
            editMode={openEditPropertyModal}
          />
        )}
        {openRestoreModal && (
          <RelationsModal
            setOpenRelationWarningModal={setOpenRestoreModal}
            openRelationWarningModal={openRestoreModal}
            onSave={() => restoreRegionFunc()}
            title={"entityprogramaticallydeleted"}
            saveOnClose={false}
          />
        )}
        {filterLoading && (
          <SimpleLoadMask
            loading={true}
            message={"Working, Please Wait..."}
            color={"primary"}
          />
        )}
      </Grid>
    </StyledRoot>
  );
};

export default RegionalStructurePage;
