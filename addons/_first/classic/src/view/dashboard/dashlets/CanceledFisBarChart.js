Ext.define('first.view.dashboard.dashlets.CanceledFisBarChart', {
    extend: 'Ext.chart.CartesianChart',

    requires: [
        'Ext.chart.axis.Category3D',
        'Ext.chart.axis.Numeric3D',
        'Ext.chart.series.Bar3D',
        'Ext.data.proxy.Rest',
        'first.view.dashboard.dashlets.CanceledFisChartController',
        'Ext.chart.grid.HorizontalGrid3D',
        'Ext.chart.grid.VerticalGrid3D',
    ],

    xtype: 'canceledFisChart',

    controller: 'canceledFisChart',

    store: {
        proxy: {
            type: 'rest',
            enablePaging: false,
        },
        listeners: {
            load: function (store, data, success) {
                    this.fireEvent('redrawCanceledFisChart', store.viewId, data, success);
            }
        }
    },

    axes: [{
        type: 'numeric3d',
        fields: ['value'],
        position: 'left',
        grid: true,
        minimum: 0
    }, {
        type: 'category3d',
        fields: 'periodName',
        position: 'bottom',
        grid: false,
        label: {
            rotate: {
                degrees: -60,
            },
        },
    }],

    series: [{
        type: 'bar3d',
        xField: 'periodName',
        yField: 'value',
        highlight: true,
        label: {
            field: 'value',
            display: 'none',
            renderer: 'onSeriesLabelRender'
        },
        tooltip: {
            trackMouse: true,
            renderer: 'onTooltipRender'
        }
    }]
});