Ext.define('first.view.dashboard.dashlets.BranchesByRegion3DPieChart', {
    extend: 'Ext.chart.PolarChart',

    requires: [
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.series.Pie3D',
        'Ext.data.proxy.Rest',
        'first.view.dashboard.dashlets.BranchesByRegion3DPieChartController',
    ],

    xtype: 'branchesByRegion3DPieChart',

    controller: 'branchesByRegion3DPieChart',

    store: {
        proxy: {
            type: 'rest',
            enablePaging: false,
        }
    },

    innerPadding: 40,

    interactions: ['itemhighlight', 'rotate'],

    legend: {
        type: window.devicePixelRatio >= 1.5 ? 'dom' : 'sprite',
        docked: 'bottom'
    },

    series: [
        {
            type: 'pie3d',
            angleField: 'value',
            donut: 30,
            distortion: 0.6,

            label: {
                field: 'region',
                calloutColor: "rgba(0,0,0,0)",
                calloutLine: {
                    length: 40,
                },
                renderer: 'onLabelRender',
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onTooltipRender'
            }
        }
    ]

});