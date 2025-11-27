import React, { Fragment, useRef } from "react";
import { connect } from "react-redux";
import { Panel } from "@sencha/ext-react-modern";
import BalanceSheetDashlet from "../dashlets/common/BalanceSheetDashlet";
import OthersForeignCurrencyConsolidatedTurnoverDashlet from "../dashlets/OthersForeignCurrencyConsolidatedTurnoverDashlet";
import OthersLoanPortfolioDashlet from "../dashlets/OthersLoanPortfolioDashlet";
import OthersReceivedLoansDashlet from "../dashlets/OthersReceivedLoansDashlet";
import LiabilitiesDollarizationDashlet from "../dashlets/common/LiabilitiesDollarizationDashlet";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const OtherFIsScreen = ({ configuration, periodType, isChartLabelVisible }) => {
  const { t } = useTranslation();

  const balanceSheetLeChartRef = useRef(null);
  const balanceSheetCruChartRef = useRef(null);
  const foreignCurrencyConsolidatedTurnoverChartRef = useRef(null);
  const foreignCurrencyConsolidatedTurnoverChartLoadRef = useRef(null);
  const OthersLoanPortfolioChartRef = useRef(null);
  const OthersReceivedLoansRef = useRef(null);
  const liabilitiesDollarizationChartRef = useRef(null);

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

  const getCode = (nameRef, mdtCodeRef, fiType) => {
    const data = configuration.data;
    if (configuration && data && Object.keys(data).length > 0) {
      return data[nameRef]["mdtCodes"][fiType][mdtCodeRef];
    }
    return "";
  };

  return (
    <Fragment>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          shadow
          docked="left"
          title={t("OtherLEBalanceSheetDashletTitle")}
          width={"50%"}
          flex={1}
          layout="fit"
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(balanceSheetLeChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(balanceSheetLeChartRef),
            },
          ]}
        >
          <BalanceSheetDashlet
            chartRef={balanceSheetLeChartRef}
            periodType={periodType}
            totalAssetsMdtCode={getCode("BalanceSheet", "totalAssets", "le")}
            totalLiabilitiesMdtCode={getCode(
              "BalanceSheet",
              "totalLiabilities",
              "le"
            )}
            totalCapitalMdtCode={getCode("BalanceSheet", "totalCapital", "le")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
            title={t("OthersLoanPortfolioDashletTitle")}
            flex={1}
            layout="fit"
            tools={[
                {
                    type: "refresh",
                    handler: () => chartRefresh(OthersLoanPortfolioChartRef),
                },
                {
                    type: "print",
                    handler: () => chartDownloader(OthersLoanPortfolioChartRef),
                },
            ]}
        >
            <OthersLoanPortfolioDashlet
                chartRef={OthersLoanPortfolioChartRef}
                periodType={periodType}
                totalLoanMdtCode={getCode("LoanPortfolio", "totalLoan", "le")}
                isChartLabelVisible={isChartLabelVisible}
            />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
            title={t("OthersReceivedLoansDashletTitle")}
            docked="left"
            width={"50%"}
            flex={1}
            layout="fit"
            resizable={{
              split: true,
              edges: "east",
              dynamic: true,
            }}
            tools={[
              {
                type: "refresh",
                handler: () => chartRefresh(OthersReceivedLoansRef),
              },
              {
                type: "print",
                handler: () => chartDownloader(OthersReceivedLoansRef),
              },
            ]}
        >
          <OthersReceivedLoansDashlet
              chartRef={OthersReceivedLoansRef}
              periodType={periodType}
              resident1MdtCode={getCode("ReceivedLoans", "resident1", "le")}
              resident2MdtCode={getCode("ReceivedLoans", "resident2", "le")}
              nonResident1MdtCode={getCode("ReceivedLoans", "nonResident1", "le")}
              nonResident2MdtCode={getCode("ReceivedLoans", "nonResident2", "le")}
              partnersMdtCode={getCode("ReceivedLoans", "partners", "le")}
              isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
            shadow
            title={t("OtherLiabilitiesDollarizationDashletTitle")}
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
                  "totalAssets",
                  "sgs"
              )}
              usdIndicator1MdtCode={getCode(
                  "LiabilitiesDollarization",
                  "usdAssets",
                  "sgs"
              )}
              indicator2MdtCode={getCode(
                  "LiabilitiesDollarization",
                  "totalLiabilities",
                  "sgs"
              )}
              usdIndicator2MdtCode={getCode(
                  "LiabilitiesDollarization",
                  "usdLiabilities",
                  "sgs"
              )}
              indicator1Name={t("assets")}
              indicator2Name={t("liabilities")}
              isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          title={t("OtherCUBalanceSheetDashletTitle")}
          docked="left"
          flex={1}
          width={"50%"}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(balanceSheetCruChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(balanceSheetCruChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <BalanceSheetDashlet
            chartRef={balanceSheetCruChartRef}
            periodType={periodType}
            totalAssetsMdtCode={getCode("BalanceSheet", "totalAssets", "cu")}
            totalLiabilitiesMdtCode={getCode(
              "BalanceSheet",
              "totalLiabilities",
              "cu"
            )}
            totalCapitalMdtCode={getCode("BalanceSheet", "totalCapital", "cu")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
          title={t("OthersForeignCurrencyConsolidatedTurnoverDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => {
                if (
                  typeof foreignCurrencyConsolidatedTurnoverChartLoadRef.current ===
                  "function"
                ) {
                  foreignCurrencyConsolidatedTurnoverChartLoadRef.current();
                }
              },
            },
            {
              type: "print",
              handler: () =>
                chartDownloader(foreignCurrencyConsolidatedTurnoverChartRef),
            },
          ]}
        >
          <OthersForeignCurrencyConsolidatedTurnoverDashlet
            chartRef={foreignCurrencyConsolidatedTurnoverChartRef}
            chartLoadRef={foreignCurrencyConsolidatedTurnoverChartLoadRef}
            periodType={periodType}
            purchaseColumnNodeCode={getCode(
              "ForeignCurrencyConsolidatedTurnover",
              "purchaseColumn",
              "fex"
            )}
            purchaseUsdNodeCode={getCode(
              "ForeignCurrencyConsolidatedTurnover",
              "purchaseUsd",
              "fex"
            )}
            purchaseEurNodeCode={getCode(
              "ForeignCurrencyConsolidatedTurnover",
              "purchaseEur",
              "fex"
            )}
            saleColumnNodeCode={getCode(
              "ForeignCurrencyConsolidatedTurnover",
              "saleColumn",
              "fex"
            )}
            saleUsdNodeCode={getCode(
              "ForeignCurrencyConsolidatedTurnover",
              "saleUsd",
              "fex"
            )}
            saleEurNodeCode={getCode(
              "ForeignCurrencyConsolidatedTurnover",
              "saleEur",
              "fex"
            )}
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

export default connect(mapStateToProps)(OtherFIsScreen);
