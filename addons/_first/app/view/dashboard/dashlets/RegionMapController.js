Ext.define('first.view.dashboard.dashlets.RegionMapController', {
    extend: 'first.view.dashboard.DashletBaseController',
    alias: 'controller.regionMap',

    listen: {
        controller: {
            'managementDashboard': {
                exportMap: 'exportMap'
            }
        }
    },

    requires: [
        'Ext.util.Cookies',
        'first.config.Config'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },

    afterrender: function (cmp) {
        const fiType = this.getViewModel().get('fiType');
        this.loadMap(cmp.getId(), fiType);
    },

    loadMap: function (viewId, fiType) {
        let me = this;
        let lm = new Ext.LoadMask({
            target: me.getView().el,
            msg: i18n.pleaseWait,
            style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }
        });

        Ext.Ajax.request({
            url: `${first.config.Config.remoteRestUrl}ecm/dashboard/fiRegistrationCountByRegionForCountryMap?fiType=${fiType}&licenseStatus=ACTIVE`,
            method: 'GET',
            success: function (response) {
                let resultData = JSON.parse(response.responseText);
                if (resultData && resultData.countryMapLayerNodeId) {
                    me.initChart(viewId, resultData.countryMapLayerNodeId, resultData.countByRegion);
                }
                lm.el.parent().removeChild(lm.el);
            },
            failure: function () {
                lm.el.parent().removeChild(lm.el);
            }
        });
    },

    showLabels: function (isShow) {
        this.getViewModel().set('showLabels', isShow);
        let labelSeries = this.getViewModel().get('labelSeries');
        if (labelSeries) {
            if (isShow) {
                labelSeries.show();
                return;
            }
            labelSeries.hide();
        }
    },

    initChart: function (viewId, countryMapLayerId, countryMapRegionData) {
        const me = this, chart = am4core.create(viewId, am4maps.MapChart), langCode = Ext.util.Cookies.get("locale");
        // hide logo
        chart.logo.height = -1;
        // Set map definition
        chart.geodataSource.url = `${first.config.Config.remoteRestUrl}ecm/node/${countryMapLayerId}/content?attachment=false`;
        chart.geodataSource.events.on("parseended", function (ev) {
            const data = [];
            for (let i = 0; i < ev.target.data.features.length; i++) {
                const regionId = ev.target.data.features[i].id,
                    value = countryMapRegionData[regionId] ? countryMapRegionData[regionId] : 0,
                    color = ev.target.data.features[i].properties.color;

                data.push({
                    id: regionId,
                    value,
                    fill: color ? am4core.color(color) : null
                });
            }

            // Set projection
            chart.projection = new am4maps.projections.Mercator();

            // Create map polygon series
            const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

            // Make map load polygon data (state shapes and names) from GeoJSON
            polygonSeries.useGeodata = true;

            polygonSeries.data = data;

            // Configure series tooltip
            const polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.tooltipText = langCode && langCode !== 'en_US' ? "{" + langCode + "}: {value}" : "{name}: {value}";
            polygonTemplate.nonScalingStroke = true;
            polygonTemplate.strokeWidth = 0.5;
            polygonTemplate.propertyFields.fill = "fill";

            // Configure label series
            const labelSeries = chart.series.push(new am4maps.MapImageSeries()),
                labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
            labelTemplate.horizontalCenter = "middle";
            labelTemplate.verticalCenter = "middle";
            labelTemplate.fontSize = 10;
            labelTemplate.interactionsEnabled = false;
            labelTemplate.nonScaling = true;

            polygonSeries.events.on("inited", function () {
                polygonSeries.mapPolygons.each(function (polygon) {
                    let label = labelSeries.mapImages.create(),
                        state = polygon.dataItem.dataContext.value;
                    label.latitude = polygon.visualLatitude;
                    label.longitude = polygon.visualLongitude;
                    label.children.getIndex(0).text = state;

                    // Create hover
                    const hs = polygon.states.create("hover");
                    hs.properties.fill = polygon.dataItem.dataContext.fill.brighten(-0.3);
                });
            });

            chart.exporting.filePrefix = "chart";

            me.getViewModel().set('chart', chart);

            labelSeries.hide();
            me.getViewModel().set('labelSeries', labelSeries);

            const isShowLabel = me.getViewModel().get('showLabels');
            me.showLabels(isShowLabel);
        })
    },

    exportMap: function () {
        const chart = this.getViewModel().get('chart');
        if (chart) {
            chart.exporting.export("png");
        }
    },

    loadChartData: function (periodType, actionType) {

    },
});