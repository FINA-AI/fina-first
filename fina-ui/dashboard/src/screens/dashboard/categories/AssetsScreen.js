import React, { Fragment, useRef } from "react";
import { connect } from "react-redux";
import { Panel } from "@sencha/ext-react-modern";
import AssetsPortfolioReserveDashlet from "../dashlets/AssetsPortfolioReserveDashlet";
import AssetsPortfolioNplDashlet from "../dashlets/AssetsPortfolioNplDashlet";
import AssetsCreditShareOfAssetsDashlet from "../dashlets/AssetsCreditShareOfAssetsDashlet";
import AssetsPortfolioStructureDashlet from "../dashlets/AssetsPortfolioStructureDashlet";
import AssetsPortfolioOverdueLoansDashlet from "../dashlets/AssetsPortfolioOverdueLoansDashlet";
import AssetsPortfolioStructureByProvisionDashlet from "../dashlets/AssetsPortfolioStructureByProvisionDashlet";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const AssetsScreen = ({ configuration, periodType, isChartLabelVisible }) => {
  const { t } = useTranslation();

  const panelProps = {
    height: 380,
    margin: "10",
  };

  const assetsPortfolioStructureChartRef = useRef(null);
  const assetPortfolioReserveChartRef = useRef(null);
  const assetPortfolioNplChartRef = useRef(null);
  const assetsPortfolioStructureByProvisionChartRef = useRef(null);
  const creditShareOfAssetsChartRef = useRef(null);
  const assetsPortfolioOverdueLoansChartRef = useRef(null);

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
          title={t("AssetsCreditShareOfAssetsDashletTitle")}
          width={"50%"}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(creditShareOfAssetsChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(creditShareOfAssetsChartRef),
            },
          ]}
          resizable={{
            split: true,
            edges: "east",
            dynamic: true,
          }}
        >
          <AssetsCreditShareOfAssetsDashlet
            chartRef={creditShareOfAssetsChartRef}
            periodType={periodType}
            assetMdtCode={getCode("AssetsCreditShareOfAssets", "asset")}
            totalLoanMdtCode={getCode("AssetsCreditShareOfAssets", "totalLoan")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>

        <Panel
          title={t("AssetsPortfolioOverdueLoansDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(assetsPortfolioOverdueLoansChartRef),
            },
            {
              type: "print",
              handler: () =>
                chartDownloader(assetsPortfolioOverdueLoansChartRef),
            },
          ]}
          resizable={{
            split: true,
            dynamic: true,
          }}
        >
          <AssetsPortfolioOverdueLoansDashlet
            chartRef={assetsPortfolioOverdueLoansChartRef}
            periodType={periodType}
            creditPortfolioMdtCode={getCode(
              "AssetsPortfolioOverdueLoans",
              "creditPortfolio"
            )}
            loansOverdue31_60MdtCode={getCode(
              "AssetsPortfolioOverdueLoans",
              "loansOverdue31_60"
            )}
            loansOverdue61_90MdtCode={getCode(
              "AssetsPortfolioOverdueLoans",
              "loansOverdue61_90"
            )}
            loansOverdue91_120MdtCode={getCode(
              "AssetsPortfolioOverdueLoans",
              "loansOverdue91_120"
            )}
            loansOverdue121_150MdtCode={getCode(
              "AssetsPortfolioOverdueLoans",
              "loansOverdue121_150"
            )}
            loansOverdue151_180MdtCode={getCode(
              "AssetsPortfolioOverdueLoans",
              "loansOverdue151_180"
            )}
            loansOverdue180_PlusMdtCode={getCode(
              "AssetsPortfolioOverdueLoans",
              "loansOverdue180_Plus"
            )}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
            docked="left"
            title={t("AssetsPortfolioStructureByProvisionDashletTitle")}
            flex={1}
            width={"50%"}
            layout="fit"
            tools={[
              {
                type: "refresh",
                handler: () =>
                    chartRefresh(assetsPortfolioStructureByProvisionChartRef),
              },
              {
                type: "print",
                handler: () =>
                    chartDownloader(assetsPortfolioStructureByProvisionChartRef),
              },
            ]}
            resizable={{
              split: true,
              edges: "east",
              dynamic: true,
            }}
        >
          <AssetsPortfolioStructureByProvisionDashlet
              chartRef={assetsPortfolioStructureByProvisionChartRef}
              totalMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "total"
              )}
              preciousMetalMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "preciousMetal"
              )}
              realEstateMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "realEstate"
              )}
              transportMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "transport"
              )}
              thirdPersonGuaranteeMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "thirdPersonGuarantee"
              )}
              ownSecurityMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "ownSecurity"
              )}
              otherCompanySecurityMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "otherCompanySecurity"
              )}
              governmentSecurityMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "governmentSecurity"
              )}
              withoutCollateralMdtCode={getCode(
                  "AssetsPortfolioStructureByProvision",
                  "withoutCollateral"
              )}
          />
        </Panel>
        <Panel
            title={t("AssetsPortfolioNplDashletTitle")}
            flex={1}
            layout="fit"
            tools={[
              {
                type: "refresh",
                handler: () => chartRefresh(assetPortfolioNplChartRef),
              },
              {
                type: "print",
                handler: () => chartDownloader(assetPortfolioNplChartRef),
              },
            ]}
            resizable={{
              split: true,
              dynamic: true,
            }}
        >
          <AssetsPortfolioNplDashlet
              chartRef={assetPortfolioNplChartRef}
              periodType={periodType}
              totalLoansMdtCode={getCode("AssetsPortfolioNpl", "totalLoan")}
              standardLoansMdtCode={getCode("AssetsPortfolioNpl", "standardLoan")}
              remarkableLoansMdtCode={getCode(
                  "AssetsPortfolioNpl",
                  "remarkableLoan"
              )}
              isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>
      </Panel>
      <Panel shadow layout="vbox" {...panelProps}>
        <Panel
          docked={"left"}
          title={t("AssetsPortfolioReserveDashletTitle")}
          flex={1}
          width={"50%"}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(assetPortfolioReserveChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(assetPortfolioReserveChartRef),
            },
          ]}
          resizable={{
              split: true,
              edges: "east",
              dynamic: true,
          }}
        >
          <AssetsPortfolioReserveDashlet
            chartRef={assetPortfolioReserveChartRef}
            periodType={periodType}
            totalLoansMdtCode={getCode("AssetsPortfolioReserve", "totalLoan")}
            reserveMdtCode={getCode("AssetsPortfolioReserve", "reserve")}
            isChartLabelVisible={isChartLabelVisible}
          />
        </Panel>

        <Panel
          title={t("AssetsPortfolioStructureDashletTitle")}
          flex={1}
          layout="fit"
          tools={[
            {
              type: "refresh",
              handler: () => chartRefresh(assetsPortfolioStructureChartRef),
            },
            {
              type: "print",
              handler: () => chartDownloader(assetsPortfolioStructureChartRef),
            },
          ]}
        >
          <AssetsPortfolioStructureDashlet
            chartRef={assetsPortfolioStructureChartRef}
            otherPhysicalPersonLoansMdtCode={getCode(
              "AssetsPortfolioStructure",
              "otherPhysicalPersonLoans"
            )}
            otherLegalPersonLoansMdtCode={getCode(
              "AssetsPortfolioStructure",
              "otherLegalPersonLoans"
            )}
            trandeAndServicesMdtCode={getCode(
              "AssetsPortfolioStructure",
              "trandeAndServices"
            )}
            consumerLoansMdtCode={getCode(
              "AssetsPortfolioStructure",
              "consumerLoans"
            )}
            agricultureMdtCode={getCode(
              "AssetsPortfolioStructure",
              "agriculture"
            )}
            onlineLoansMdtCode={getCode(
              "AssetsPortfolioStructure",
              "onlineLoans"
            )}
            lombardMdtCode={getCode("AssetsPortfolioStructure", "lombard")}
            installementMdtCode={getCode(
              "AssetsPortfolioStructure",
              "installement"
            )}
            tradeAndServiceLoansMdtCode={getCode(
              "AssetsPortfolioStructure",
              "tradeAndServiceLoans"
            )}
            agriculturalAndForestryLoansMdtCode={getCode(
              "AssetsPortfolioStructure",
              "agriculturalAndForestryLoans"
            )}
            transportAndCommunicationLoansMdtCode={getCode(
              "AssetsPortfolioStructure",
              "transportAndCommunicationLoans"
            )}
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

export default connect(mapStateToProps)(AssetsScreen);
