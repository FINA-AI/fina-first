import React, { Fragment, useRef } from "react";
import { connect } from "react-redux";
import { Panel } from "@sencha/ext-react-modern";
import BalanceSheetDashlet from "../dashlets/common/BalanceSheetDashlet";
import CapitalsSupervisoryCapitalDashlet from "../dashlets/CapitalsSupervisoryCapitalDashlet";
import CapitalsOwnersEquityDashlet from "../dashlets/CapitalsOwnersEquityDashlet";
import CapitalsCoefficientDashlet from "../dashlets/CapitalsCoefficientDashlet";
import CapitalsFIAmountsByCreditCoefficientApproachDashlet from "../dashlets/CapitalsFIAmountsByCreditCoefficientApproachDashlet";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const CapitalsScreen = ({ configuration, periodType, isChartLabelVisible }) => {
  const { t } = useTranslation();

  const panelProps = {
    height: 380,
    margin: "10",
  };

  const capitalsBalanceSheetChartRef = useRef(null);
  const capitalsSupervisoryCapitalChartRef = useRef(null);
  const ownersEquityChartRef = useRef(null);
  const lightCapitalCapitalsCoefficientChartRef = useRef(null);
  const strongCapitalCapitalsCoefficientChartRef = useRef(null);
  const amountsByCreditCoefficientApproach = useRef(null);

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
          title={t("CapitalBalanceSheetDashletTitle")}
          width={"50%"}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(capitalsBalanceSheetChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(capitalsBalanceSheetChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <BalanceSheetDashlet
            chartRef={capitalsBalanceSheetChartRef}
            periodType={periodType}
            totalAssetsMdtCode={getCode("BalanceSheet", "totalAssets")}
            totalLiabilitiesMdtCode={getCode(
              "BalanceSheet",
              "totalLiabilities"
            )}
            totalCapitalMdtCode={getCode("BalanceSheet", "totalCapital")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
          title={t("CapitalsSupervisoryCapitalDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(capitalsSupervisoryCapitalChartRef),
            },
            {
              type: "print",
              handler: () =>
                chartDownloader(capitalsSupervisoryCapitalChartRef),
            },
          ]}
        >
          <CapitalsSupervisoryCapitalDashlet
            chartRef={capitalsSupervisoryCapitalChartRef}
            periodType={periodType}
            authorizedCapitalMdtCode={getCode(
              "CapitalsSupervisoryCapital",
              "authorizedCapital"
            )}
            subordinatedLoansMdtCode={getCode(
              "CapitalsSupervisoryCapital",
              "subordinatedLoans"
            )}
            retainedEarningsMdtCode={getCode(
              "CapitalsSupervisoryCapital",
              "retainedEarnings"
            )}
            emissionCapitalMdtCode={getCode(
                "CapitalsSupervisoryCapital",
                "emissionCapital"
            )}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
            title={t("CapitalsOwnersEquityDashletTitle")}
            flex={1}
            width={"50%"}
            layout="fit"
            docked="left"
            tools={[
              {
                type: "refresh",
                handler: () => chartRefresh(ownersEquityChartRef),
              },
              {
                type: "print",
                handler: () => chartDownloader(ownersEquityChartRef),
              },
            ]}
            resizable={{
              split: true,
              edges: "east",
              dynamic: true,
            }}
        >
          <CapitalsOwnersEquityDashlet
              chartRef={ownersEquityChartRef}
              residentMdtCode={getCode("CapitalsOwnersEquity", "resident")}
              nonResidentMdtCode={getCode("CapitalsOwnersEquity", "nonResident")}
          />
        </Panel>
        <Panel
            title={t("CapitalsFIAmountsByCreditCoefficientApproachDashletTitle")}
            flex={1}
            layout="fit"
            tools={[
              {
                type: "refresh",
                handler: () => chartRefresh(amountsByCreditCoefficientApproach),
              },
              {
                type: "print",
                handler: () =>
                    chartDownloader(amountsByCreditCoefficientApproach),
              },
            ]}
        >
          <CapitalsFIAmountsByCreditCoefficientApproachDashlet
              chartRef={amountsByCreditCoefficientApproach}
              drawnFundsToSupervisoryCapitalRatioMdtNodeCode={getCode(
                  "CapitalsFIAmountsByCreditCoefficientApproach",
                  "drawnFundsToSupervisoryCapitalRatio"
              )}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          title={t("CapitalsCoefficientStrictDashletTitle")}
          flex={1}
          docked="left"
          width={"50%"}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () =>
                chartRefresh(strongCapitalCapitalsCoefficientChartRef),
            },
            {
              type: "print",
              handler: () =>
                chartDownloader(strongCapitalCapitalsCoefficientChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <CapitalsCoefficientDashlet
            chartRef={strongCapitalCapitalsCoefficientChartRef}
            periodType={periodType}
            supervisorCapitalMdtCode={getCode(
              "CapitalsCoefficient",
              "supervisorCapital"
            )}
            totalAssetsAfterDepreciationMdtCode={getCode(
              "CapitalsCoefficient",
              "totalAssetsAfterDepreciation"
            )}
            limit={getCode("CapitalsCoefficient", "strictLimit")}
            filterNodeCode={getCode("CapitalsCoefficient", "raisedFundsPercentage")}
            filterNodeValue={getCode("CapitalsCoefficient", "strictRaisedFundsValue")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
        <Panel
          title={t("CapitalsCoefficientDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () =>
                chartRefresh(lightCapitalCapitalsCoefficientChartRef),
            },
            {
              type: "print",
              handler: () =>
                chartDownloader(lightCapitalCapitalsCoefficientChartRef),
            },
          ]}
        >
          <CapitalsCoefficientDashlet
            chartRef={lightCapitalCapitalsCoefficientChartRef}
            periodType={periodType}
            supervisorCapitalMdtCode={getCode(
              "CapitalsCoefficient",
              "supervisorCapital"
            )}
            totalAssetsAfterDepreciationMdtCode={getCode(
              "CapitalsCoefficient",
              "totalAssetsAfterDepreciation"
            )}
            limit={getCode("CapitalsCoefficient", "lightLimit")}
            filterNodeCode={getCode("CapitalsCoefficient", "raisedFundsPercentage")}
            filterNodeValue={getCode("CapitalsCoefficient", "lightRaisedFundsValue")}
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

export default connect(mapStateToProps)(CapitalsScreen);
