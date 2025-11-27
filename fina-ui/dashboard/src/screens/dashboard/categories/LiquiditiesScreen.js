import React, {Fragment, useRef} from "react";
import {connect} from "react-redux";
import {Panel} from "@sencha/ext-react-modern";
import LiquiditiesLiabilityStructureDashlet from "../dashlets/LiquiditiesLiabilityStructureDashlet";
import LiquiditiesAssetLevelDashlet from "../dashlets/LiquiditiesAssetLevelDashlet";
import LiquiditiesCoefficientDashlet from "../dashlets/LiquiditiesCoefficientDashlet";
import LiquiditiesGapDashlet from "../dashlets/LiquiditiesGapDashlet";
import LiabilitiesDollarizationDashlet from "../dashlets/common/LiabilitiesDollarizationDashlet";
import {useTranslation} from "react-i18next";

const Ext = window["Ext"];

const LiquiditiesScreen = ({
  configuration,
  periodType,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const panelProps = {
    height: 380,
    margin: "10",
  };

  const liabilityStructureChartRef = useRef(null);
  const liabilitiesDollarizationChartRef = useRef(null);
  const assetLevelChartRef = useRef(null);
  const strictCoefficientChartRef = useRef(null);
  const lightCoefficientChartRef = useRef(null);
  const liquiditiesGapChartRef = useRef(null);

  const chartDownloader = (chartRef) => {
    const chart = chartRef.current.cmp;

    if (Ext.is.Desktop) {
      chart.download({ filename: "Chart" });
    } else {
      chart.preview();
    }
  };

  const chartRefresh = (chartRef) => {
    const chart = chartRef.current.cmp;
    chart.getStore().reload();
  };

  const getCode = (nameRef, mdtCodeRef) => {
    const data = configuration.data;
    if (configuration && data && Object.keys(data).length > 0) {
      return data[nameRef]["mdtCodes"]["mfo"][mdtCodeRef];
    }
    return "";
  };

  const getReturnDefinitionCode = (nameRef, returnCodeRef) => {
    const data = configuration.data;
    if (configuration && data && Object.keys(data).length > 0) {
      return data[nameRef]["returnCodes"]["mfo"][returnCodeRef];
    }
  };

  return (
    <Fragment>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          docked="left"
          title={t("LiquiditiesAssetLevelDashletTitle")}
          width={"50%"}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(assetLevelChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(assetLevelChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <LiquiditiesAssetLevelDashlet
            chartRef={assetLevelChartRef}
            periodType={periodType}
            totalAssetsMdtCode={getCode("LiquiditiesAssetLevel", "totalAssets")}
            liquidAssets={getCode("LiquiditiesAssetLevel", "liquidAsset")}
            physicalFundsMdtCode={getCode(
              "LiquiditiesAssetLevel",
              "physicalFunds"
            )}
            physicalSecuritiesMdtCode={getCode(
              "LiquiditiesAssetLevel",
              "physicalSecurities"
            )}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
          title={t("LiquiditiesLiabilitiesDollarizationDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(liabilitiesDollarizationChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(liabilitiesDollarizationChartRef),
            },
          ]}
        >
          <LiabilitiesDollarizationDashlet
            chartRef={liabilitiesDollarizationChartRef}
            periodType={periodType}
            indicator1MdtCode={getCode(
              "LiabilitiesDollarization",
              "totalLiabilities"
            )}
            usdIndicator1MdtCode={getCode(
              "LiabilitiesDollarization",
              "usdLiabilities"
            )}
            indicator2MdtCode={getCode("LiabilitiesDollarization", "totalLoan")}
            usdIndicator2MdtCode={getCode(
              "LiabilitiesDollarization",
              "usdLoan"
            )}
            indicator1Name={t("liabilitiesDollarization")}
            indicator2Name={t("loanDollarization")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
            title={t("LiquiditiesLiabilityStructureDashletTitle")}
            flex={1}
            width={"50%"}
            layout="fit"
            docked="left"
            tools={[
              {
                type: "refresh",
                handler: () => chartRefresh(liabilityStructureChartRef),
              },
              {
                type: "print",
                handler: () => chartDownloader(liabilityStructureChartRef),
              },
            ]}
            resizable={{
              split: true,
              edges: "east",
              dynamic: true,
            }}
        >
          <LiquiditiesLiabilityStructureDashlet
              chartRef={liabilityStructureChartRef}
              loansFiMdtCode={getCode("LiquiditiesLiabilityStructure", "loansFi")}
              loansSubordinatedMdtCode={getCode(
                  "LiquiditiesLiabilityStructure",
                  "loansSubordinated"
              )}
              loansPhysicalPersonMdtCode={getCode(
                  "LiquiditiesLiabilityStructure",
                  "loansPhysicalPerson"
              )}
              loansLegalPersonMdtCode={getCode(
                  "LiquiditiesLiabilityStructure",
                  "loansLegalPerson"
              )}
          />
        </Panel>
        <Panel
            title={t("LiquiditiesGapDashletTitle")}
            flex={1}
            layout="fit"
            tools={[
              {
                type: "refresh",
                handler: () => chartRefresh(liquiditiesGapChartRef),
              },
              {
                type: "print",
                handler: () => chartDownloader(liquiditiesGapChartRef),
              },
            ]}
        >
          <LiquiditiesGapDashlet
              chartRef={liquiditiesGapChartRef}
              under1MonthNodeCode={getCode("LiquiditiesGap", "under1Month")}
              oneTo2MonthsNodeCode={getCode("LiquiditiesGap", "oneTo2Months")}
              twoTo3MonthsNodeCode={getCode("LiquiditiesGap", "twoTo3Months")}
              threeTo6MonthsNodeCode={getCode("LiquiditiesGap", "threeTo6Months")}
              sixMonthsTo1YearNodeCode={getCode(
                  "LiquiditiesGap",
                  "sixMonthsTo1Year"
              )}
              oneTo5YearsNodeCode={getCode("LiquiditiesGap", "oneTo5Years")}
              above5YearsNodeCode={getCode("LiquiditiesGap", "above5Years")}
              returnDefinitionCode={getReturnDefinitionCode(
                  "LiquiditiesGap",
                  "liquidityPosition"
              )}
              isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          title={t("LiquiditiesCoefficientStrictDashletTitle")}
          docked="left"
          flex={1}
          layout="fit"
          width={"50%"}
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(strictCoefficientChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(strictCoefficientChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <LiquiditiesCoefficientDashlet
            chartRef={strictCoefficientChartRef}
            periodType={periodType}
            liquidAssetsMdtCode={getCode(
              "LiquiditiesCoefficient",
              "liquidAssets"
            )}
            totalBalanceLiabilitiesMdtCode={getCode(
              "LiquiditiesCoefficient",
              "totalBalanceLiabilities"
            )}
            limit={getCode("LiquiditiesCoefficient", "strictLimit")}
            filterNodeCode={getCode("LiquiditiesCoefficient", "raisedFundsPercentage")}
            filterNodeValue={getCode("LiquiditiesCoefficient", "strictRaisedFundsPercentageValue")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
          title={t("LiquiditiesCoefficientLightDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(lightCoefficientChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(lightCoefficientChartRef),
            },
          ]}
        >
          <LiquiditiesCoefficientDashlet
            chartRef={lightCoefficientChartRef}
            periodType={periodType}
            liquidAssetsMdtCode={getCode(
              "LiquiditiesCoefficient",
              "liquidAssets"
            )}
            totalBalanceLiabilitiesMdtCode={getCode(
              "LiquiditiesCoefficient",
              "totalBalanceLiabilities"
            )}
            limit={getCode("LiquiditiesCoefficient", "lightLimit")}
            filterNodeCode={getCode("LiquiditiesCoefficient", "raisedFundsPercentage")}
            filterNodeValue={getCode("LiquiditiesCoefficient", "lightRaisedFundsPercentageValue")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
      </Panel>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  configuration: state.configuration,
  periodType: state.periodType,
  isChartLabelVisible: state.isChartLabelVisible,
});

export default connect(mapStateToProps)(LiquiditiesScreen);
