import React, { Fragment, useRef } from "react";
import { connect } from "react-redux";
import { Panel } from "@sencha/ext-react-modern";
import ProfitabilityProfitDashlet from "../dashlets/ProfitabilityProfitDashlet";
import ProfitabilityMarginSpreedDashlet from "../dashlets/ProfitabilityMarginSpreeDashlet";
import ProfitabilityPercentageCostDashlet from "../dashlets/ProfitabilityPercentageCostDashlet";
import ProfitabilityEfficiencyIndicatorsDashlet from "../dashlets/ProfitabilityEfficiencyIndicatorsDashlet";
import ProfitabilityRoeRoaDashlet from "../dashlets/ProfitabilityRoeRoaDashlet";
import ProfitabilityCreditPortfolioAndYieldDashlet from "../dashlets/ProfitabilityCreditPortfolioAndYieldDashlet";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const ProfitabilityScreen = ({
  configuration,
  periodType,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const profitabilityProfitChartRef = useRef(null);
  const profitabilityMarginSpreedChartRef = useRef(null);
  const profitabilityMarginSpreedChartLoadRef = useRef(null);
  const profitabilityPercentageCostChartRef = useRef(null);
  const profitabilityEfficiencyIndicatorsChartRef = useRef(null);
  const profitabilityRoeRoaChartRef = useRef(null);
  const profitabilityRoeRoaChartLoadRef = useRef(null);
  const profitabilityCreditPortfolioAndYieldChartRef = useRef(null);
  const profitabilityCreditPortfolioAndYieldChartLoadRef = useRef(null);
  const profitabilityEfficiencyIndicatorsChartLoadRef = useRef(null);

  const panelProps = {
    height: 380,
    margin: "10",
  };

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

  return (
    <Fragment>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          docked="left"
          title={t("ProfitabilityMarginSpreedDashletTitle")}
          width={"50%"}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => {
                if (
                  typeof profitabilityMarginSpreedChartLoadRef.current ===
                  "function"
                ) {
                  profitabilityMarginSpreedChartLoadRef.current();
                }
              },
            },
            {
              type: "print",
              handler: () => chartDownloader(profitabilityMarginSpreedChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <ProfitabilityMarginSpreedDashlet
            chartRef={profitabilityMarginSpreedChartRef}
            chartLoadRef={profitabilityMarginSpreedChartLoadRef}
            paidPercentageMdtCode={getCode(
              "ProfitabilityMarginSpreed",
              "paidPercentage"
            )}
            totalLoanMdtCode={getCode("ProfitabilityMarginSpreed", "totalLoan")}
            netPercentageIncomeMdtCode={getCode(
              "ProfitabilityMarginSpreed",
              "netPercentageIncome"
            )}
            loansFiMdtCodeMdtCode={getCode(
              "ProfitabilityMarginSpreed",
              "loansFi"
            )}
            physLegPersonLoanMdtCode={getCode(
              "ProfitabilityMarginSpreed",
              "physLegPersonLoan"
            )}
            securitiesMdtCode={getCode(
              "ProfitabilityMarginSpreed",
              "securities"
            )}
            loansSubordinatedMdtCode={getCode(
              "ProfitabilityMarginSpreed",
              "loansSubordinated"
            )}
            paidPercentageMarginMdtCode={getCode(
                "ProfitabilityMarginSpreed",
                "paidPercentageMargin"
            )}
            assetMdtCode={getCode("ProfitabilityMarginSpreed", "asset")}
            isChartLabelVisible={isChartLabelVisible}
            periodType={periodType}
          />
        </Panel>
        <Panel
          title={t("ProfitabilityCreditPortfolioAndYieldDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => {
                if (
                  typeof profitabilityCreditPortfolioAndYieldChartLoadRef.current ===
                  "function"
                ) {
                  profitabilityCreditPortfolioAndYieldChartLoadRef.current();
                }
              },
            },
            {
              type: "print",
              handler: () =>
                chartDownloader(profitabilityCreditPortfolioAndYieldChartRef),
            },
          ]}
        >
          <ProfitabilityCreditPortfolioAndYieldDashlet
            chartRef={profitabilityCreditPortfolioAndYieldChartRef}
            chartLoadRef={profitabilityCreditPortfolioAndYieldChartLoadRef}
            totalInterestIncomeNodeCode={getCode(
              "ProfitabilityCreditPortfolioAndYield",
              "totalInterestIncome"
            )}
            totalLoansNodeCode={getCode(
              "ProfitabilityCreditPortfolioAndYield",
              "totalLoans"
            )}
            isChartLabelVisible={isChartLabelVisible}
            periodType={periodType}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
            title={t("ProfitabilityPercentageCostDashletTitle")}
            flex={1}
            width={"50%"}
            layout="fit"
            docked="left"
            tools={[
              {
                type: "refresh",
                handler: () => chartRefresh(profitabilityPercentageCostChartRef),
              },
              {
                type: "print",
                handler: () =>
                    chartDownloader(profitabilityPercentageCostChartRef),
              },
            ]}
            resizable={{
              split: true,
              edges: "east",
              dynamic: true,
            }}
        >
          <ProfitabilityPercentageCostDashlet
              chartRef={profitabilityPercentageCostChartRef}
              periodType={periodType}
              percentageCostMdtCode={getCode(
                  "ProfitabilityPercentageCost",
                  "percentageCost"
              )}
              totalLiabilitiesMdtCode={getCode(
                  "ProfitabilityPercentageCost",
                  "totalLiabilities"
              )}
              otherLiabilitiesMdtCode={getCode(
                  "ProfitabilityPercentageCost",
                  "otherLiabilities"
              )}
              unpaidPercAndDivMdtCode={getCode(
                  "ProfitabilityPercentageCost",
                  "unpaidPercAndDiv"
              )}
              isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
            title={t("ProfitabilityRoeRoaDashletTitle")}
            flex={1}
            layout="fit"
            tools={[
              {
                type: "refresh",
                handler: () => {
                  if (
                      typeof profitabilityRoeRoaChartLoadRef.current === "function"
                  ) {
                    profitabilityRoeRoaChartLoadRef.current();
                  }
                },
              },
              {
                type: "print",
                handler: () => chartDownloader(profitabilityRoeRoaChartRef),
              },
            ]}
        >
          <ProfitabilityRoeRoaDashlet
              chartRef={profitabilityRoeRoaChartRef}
              chartLoadRef={profitabilityRoeRoaChartLoadRef}
              netIncomeMdtCode={getCode("ProfitabilityRoeRoa", "netIncome")}
              equityMdtCode={getCode("ProfitabilityRoeRoa", "equity")}
              assetsMdtCode={getCode("ProfitabilityRoeRoa", "assets")}
              isChartLabelVisible={isChartLabelVisible}
              periodType={periodType}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          title={t("ProfitabilityEfficiencyIndicatorsDashletTitle")}
          docked="left"
          flex={1}
          width={"50%"}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => {
                if (
                    typeof profitabilityEfficiencyIndicatorsChartLoadRef.current === "function"
                ) {
                  profitabilityEfficiencyIndicatorsChartLoadRef.current();
                }
              }
            },
            {
              type: "print",
              handler: () =>
                chartDownloader(profitabilityEfficiencyIndicatorsChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <ProfitabilityEfficiencyIndicatorsDashlet
            chartRef={profitabilityEfficiencyIndicatorsChartRef}
            chartLoadRef={profitabilityEfficiencyIndicatorsChartLoadRef}
            periodType={periodType}
            netIncomeMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "netIncome"
            )}
            dividendMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "dividend"
            )}
            securitiesMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "securities"
            )}
            currencyBuySellMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "currencyBuySell"
            )}
            totalMdtCode={getCode("ProfitabilityEfficiencyIndicators", "total")}
            assetsMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "assets"
            )}
            personalCostMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "personalCost"
            )}
            operatingIncomeMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "operatingIncome"
            )}
            totalCostsMdtCode={getCode(
              "ProfitabilityEfficiencyIndicators",
              "totalCosts"
            )}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
          title={t("ProfitabilityProfitDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(profitabilityProfitChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(profitabilityProfitChartRef),
            },
          ]}
        >
          <ProfitabilityProfitDashlet
            chartRef={profitabilityProfitChartRef}
            periodType={periodType}
            pureProfitBeforeReservingNodeCode={getCode(
              "ProfitabilityProfit",
              "pureProfitBeforeReserving"
            )}
            receivedDividendsNodeCode={getCode(
              "ProfitabilityProfit",
              "receivedDividends"
            )}
            profitOrLossFromSecuritiesNodeCode={getCode(
              "ProfitabilityProfit",
              "profitOrLossFromSecurities"
            )}
            profitOrLossFromForeignExchangeFundsReevaluationNodeCode={getCode(
              "ProfitabilityProfit",
              "profitOrLossFromForeignExchangeFundsReevaluation"
            )}
            profitOrLossFromPropertySalesNodeCode={getCode(
              "ProfitabilityProfit",
              "profitOrLossFromPropertySales"
            )}
            lossAccordingToPossibleLoanLossesNodeCode={getCode(
              "ProfitabilityProfit",
              "lossAccordingToPossibleLoanLosses"
            )}
            pureProfitNodeCode={getCode("ProfitabilityProfit", "pureProfit")}
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

export default connect(mapStateToProps)(ProfitabilityScreen);
